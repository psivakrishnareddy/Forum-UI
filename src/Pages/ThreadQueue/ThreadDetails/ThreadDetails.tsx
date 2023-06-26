import React, { useContext, useEffect, useState } from 'react'
import { Badge, Button } from 'react-bootstrap';
import "./ThreadDetails.scss"
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashModal from '../../../components/common/UI/DashModal/DashModal';
import Like from '../../../components/common/UI/LikeButton/LikeButton';
import TextFilesInputSection from '../../../components/common/UI/TextFilesInputSection/TextFilesInputSection';
import ProfileBadge from '../../../components/common/UI/UserProfile/ProfileBadge';
import { Comment, IThread, Tags } from '../../../constants/models';
import { DiscussionService } from '../../../services/DiscussionService'
import AuthContext from '../../../store/context/auth-context';
import GlobalContext from '../../../store/context/global-context';
import { SET_GLOBAL_LOADER } from '../../../store/Types/GlobalTypes';
import { postTimeStamp } from '../../../utils/DateUtils';
import { FaRegEdit } from "react-icons/fa";
import { RiChatDeleteFill, RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import { toast } from 'react-toastify';


const ThreadDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);
    const [modalShowDelete, setModalShowDelete] = useState(false);
    const [discussion, setdiscussion] = useState<IThread>();
    const [tags, settags] = useState<string[]>([]);
    const [liked, setliked] = useState(false);
    const [bookMark, setbookMark] = useState(false);
    const [votesCount, setVotesCount] = useState(0);
    const [triggerEditDelete, setTriggerEditDelete] = useState(false);
    const [comment, setcomment] = useState('');
    const [showEditTextBox, setShowEditTextBox] = useState(false);
    const [commentToDelete, setcommentToDelete] = useState<Comment>();
    const [commentToEdit, setCommentToEdit] = useState<Comment>();
    const [renderComment, setRenderComment] = useState(Math.random());
    const { dispatch } = useContext(GlobalContext);
    const { userDetails } = useContext(AuthContext);

    const fetchDiscussion = (postId: string) => {
        dispatch({ type: SET_GLOBAL_LOADER, payload: true })
        DiscussionService.getDiscussionById(postId).then((discussion: IThread) => {
            setdiscussion(discussion);
            setliked(discussion?.voted);
            setbookMark(discussion?.bookmarked!)
            setVotesCount(discussion?.voteCount);
            let tags = discussion?.tags.map((data: Tags) => data?.tagName);
            settags(tags);
            dispatch({ type: SET_GLOBAL_LOADER, payload: false })
        })
    }

    useEffect(() => {
        let postId = params?.postid || "0"
        fetchDiscussion(postId);
    }, [params])


    const handleVoteTrigger = (event: React.MouseEvent) => {
        event.stopPropagation();
        let vote = !liked;
        DiscussionService.postVoteHandle(+params?.postid!, vote).then(data => {
            setliked(vote);
            if (data) {
                setVotesCount(votesCount + 1)
            } else {
                setVotesCount(votesCount - 1);
            }
        })
    }

    const handleBookMark = (event: React.MouseEvent) => {
        event.stopPropagation();
        let bookmark = !bookMark;
        DiscussionService.postBookmark(+params?.postid!, bookmark).then(data => {
            setbookMark(data);
        })
    }

    const handleReplyTextInput = (data: string) => {
        setcomment(data);
    }

    const handlePostComment = () => {
        let postId = params?.postid || "0";
        dispatch({ type: SET_GLOBAL_LOADER, payload: true })
        DiscussionService.postComment(+postId, comment).then((discussion: IThread) => {
            setcomment('');
            setRenderComment(Math.random());
            setdiscussion(discussion);
            toast.success('Your comment has been posted');
            dispatch({ type: SET_GLOBAL_LOADER, payload: false })
        }).catch(() => {
            toast.error("Error in posting comment");
        })
    }

    const handleEditComment = () => {
        let postId = params?.postid || "0";
        if (comment.length > 0 && commentToEdit !== undefined) {
            let newCommentObject: Comment = commentToEdit;
            newCommentObject.description = comment;
            setCommentToEdit(newCommentObject);
        }
        setShowEditTextBox(false);
        setTriggerEditDelete(false);
        if (commentToEdit !== undefined) {
            dispatch({ type: SET_GLOBAL_LOADER, payload: true })
            DiscussionService.UpdateComment(+postId, commentToEdit.id, commentToEdit.description).then((discussion: IThread) => {
                setcomment('');
                setRenderComment(Math.random());
                setdiscussion(discussion);
                setTriggerEditDelete(true);
                toast.info('Your comment has been updated');
                dispatch({ type: SET_GLOBAL_LOADER, payload: false })
            }).catch(() => {
                toast.error("Error in editing comment")
            })
        }
    }

    const handleEditPost = () => {
        let postId = params?.postid || "0";
        navigate("/forum/threads/edit/" + postId);

    }

    const handleCancelButton = () => {
        navigate("/forum/threads");
    }

    const handleCancelEditButton = () => {
        let postId = params?.postid || "0";
        setShowEditTextBox(false);
        navigate("/forum/threads/" + postId)
    }

    const handleCloseConversation = () => {
        let postId = params?.postid || "0";
        dispatch({ type: SET_GLOBAL_LOADER, payload: true })
        if (discussion?.userId === userDetails.user.userId || userDetails?.role?.roleId === 1) {
            DiscussionService.postCloseConversation(+postId).then((thread: IThread) => {
                let threadData: IThread = { ...discussion!, closed: thread?.closed };
                setdiscussion(threadData);
                setModalShow(false);
                navigate("/forum/threads/" + postId);
                toast.info("The conversation is closed successfully");
                dispatch({ type: SET_GLOBAL_LOADER, payload: false })
            }).catch(() => {
                setModalShow(false);
            });
        } else {
            toast.error("You are not allowed to close this conversation!");
        }
    }
    const handleDeleteThread = () => {
        let postId = params?.postid || "0";
        dispatch({ type: SET_GLOBAL_LOADER, payload: true })
        if (commentToDelete !== undefined) {
            DiscussionService.deleteCommentOfAuthor(commentToDelete.id, +postId).then((status: boolean) => {
                setTriggerEditDelete(true);
                setModalShowDelete(false);
                setShowEditTextBox(false);
                navigate("/forum/threads/" + postId);
                toast.info('Your comment has been deleted');
                dispatch({ type: SET_GLOBAL_LOADER, payload: false })

            }).catch(() => {
                toast.error("Error in deleting comment");
                setModalShowDelete(false);
            })
        }
        else {
            toast.error("Error in deleting this comment");
        }

    }
    const handleAddToFAQs = () => {
        let postId = params?.postid || "0";
        if (discussion?.faq) {
            toast.info("Already in FAQ")
            return;
        }
        DiscussionService.postAddToFAQs(+postId, true).then((action: boolean) => {
            let threadData: IThread = { ...discussion!, faq: action };
            setdiscussion(threadData);
        });
    }

    return (
        <>
            <DashModal
                color='danger'
                title='Close Conversation'
                body={"Are you sure you want to close this conversation? You cannot undo this action"}
                show={modalShow}
                onHide={() => setModalShow(false)}
                showSecondaryBtn
                onActionTrigger={handleCloseConversation}
            ></DashModal>
            <DashModal
                color='danger'
                title='Delete comment'
                body={"Are you sure you want to delete this comment? You cannot undo this action"}
                show={modalShowDelete}
                onHide={() => setModalShowDelete(false)}
                showSecondaryBtn
                onActionTrigger={handleDeleteThread}
            ></DashModal>
            <Link className="back-link" to={"/forum/threads"}>Back</Link>
            <div className="thread-details-container bg-white d-flex flex-column justify-content-between p-5 my-3 dash-box-shadow">
                <div className="thred-main-container d-flex justify-content-between align-items-center h-100">
                    <div className="thread-left-section">
                        <ProfileBadge className="float-start" username={discussion?.userName!} size="40" />
                        <div className="title d-flex flex-column justify-content-between align-items-start ps-3 me-1">
                            <div className="fs-7 text-gray fw-light">
                                Created by {`${discussion?.userName} ${discussion?.timestamp && postTimeStamp(new Date(discussion?.timestamp!))}`} {discussion?.status && (<span className="ms-4">Status: {(<span className="fw-normal text-dark-gray">{discussion.status}</span>)}</span>)}
                            </div>
                            <div className="fs-4">
                                <b>{discussion?.title}</b>
                            </div>
                        </div>
                    </div>
                    <div className="thread-right-section d-flex justify-content-end align-self-start text-primary fs-7 pointer-cursor">
                        {(discussion?.closed) ? (<Badge bg="success">Closed</Badge>) : (discussion?.userId === userDetails.user.userId || userDetails?.role?.roleId === 1) ? (
                            <div className='header-icons pe-2'>
                                <FaRegEdit className='action-icons' onClick={handleEditPost} title="Edit post" />
                                <RiChatDeleteFill className='ms-2 action-icons' title="Close conversation" onClick={() => setModalShow(true)} />
                            </div>

                        ) : <Badge bg="info">Open</Badge>}
                    </div>
                </div>
                <div className="main-content my-2 ms-5 ps-2 fs-7 text-dark-gray">
                    {discussion?.description}
                </div>

                <div className="thread-footer ms-4 d-flex justify-content-between align-items-center text-gray fs-7 mt-2">
                    <div className="thread-footer-left">
                        <div className="d-inline-block align-bottom pe-1">
                            {userDetails?.role?.roleId !== 1 ? (tags.length > 0 && <span className="ms-4">Tags: <span className="fw-normal text-dark-gray">{tags.join(", ")}</span></span>) :
                                discussion?.faq ? (<Badge pill bg="purple" className='ms-4'>FAQ</Badge>) : <span className="add-to-faqs ms-4 fw-normal pointer-cursor" onClick={handleAddToFAQs}>Add To FAQs</span>}
                        </div>
                    </div>
                    <div className="thread-footer-right">
                        <div className="d-inline-block align-middle px-1">
                            <span>Bookmark</span>
                        </div>
                        <div className="d-inline-block align-middle px-1 pointer-cursor" onClick={handleBookMark} title="Save post" >
                            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 22 22" width="22px" fill={bookMark ? "#066fad" : "#9BA1A9"}>
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                            </svg>
                        </div>
                        <div className="d-inline-block align-middle px-1">
                            <span>Votes</span>
                        </div>
                        <div className="d-inline-block align-middle px-1">
                            <Like size={12} liked={liked} onClick={handleVoteTrigger} />
                        </div>
                        <div className="d-inline-block align-middle fw-normal text-dark-gray">
                            {votesCount}
                        </div>
                    </div>
                </div>
                <hr className='my-2'></hr>
                {discussion?.comments?.map((comment: Comment) => (
                    <div className="reply-section-container" key={comment.id}>
                        <div className="thred-main-container d-flex justify-content-between align-items-center h-100">
                            <div className="thread-left-section">
                                <ProfileBadge className="float-start" username={comment?.userName!} size="40" />
                                <div className="title d-flex flex-column justify-content-between align-items-start ps-3 me-1">
                                    <div className="fs-7 text-gray fw-light">
                                        Answered by <strong className='text-dark-gray fw-bolder'>{comment?.userName} </strong> {comment?.createdAt && postTimeStamp(new Date(comment?.createdAt!))}
                                    </div>

                                    {showEditTextBox === true && commentToEdit !== undefined && commentToEdit.id === comment.id && <div className='edit-input-box'>
                                        <TextFilesInputSection key={'CommentInput-' + renderComment} textInput={commentToEdit?.description} files={[]}
                                            placeholder={'Post a reply...'}
                                            exportTextInput={handleReplyTextInput}
                                            exportFiles={(data: any[]) => { }} />
                                        <div className="action-buttons d-flex align-items-center justify-content-end mt-5">
                                            <Button variant="secondary" className="fw-bold" onClick={handleCancelEditButton}> Cancel </Button>
                                            <Button variant="primary" className="ms-3 fw-bold" onClick={handleEditComment} disabled={commentToEdit?.description.length <= 0}>Update</Button>
                                        </div></div>}
                                    {
                                        showEditTextBox === false && <div className="my-2 fs-7 text-dark-gray">
                                            {
                                                comment.description.split("\n").map(rowIter => (
                                                    <div className='comment-description' key={rowIter}>
                                                        {
                                                            rowIter.split(" ").map(columnIter => (
                                                                <span>{columnIter.startsWith("http") && <a href={columnIter} rel="noreferrer" target="_blank">{columnIter}</a>}
                                                                    {!columnIter.startsWith("http") && <span>{columnIter}</span>}
                                                                    &nbsp;</span>
                                                            ))
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                    {
                                        showEditTextBox === true && commentToEdit !== undefined && commentToEdit.id !== comment.id && <div className="my-2 fs-7 text-dark-gray">
                                            {
                                                comment.description.split("\n").map(rowIter => (
                                                    <div className='comment-description' key={rowIter}>
                                                        {
                                                            rowIter.split(" ").map(columnIter => (
                                                                <span>{columnIter.startsWith("http") && <a href={columnIter} rel="noreferrer" target="_blank">{columnIter}</a>}
                                                                    {!columnIter.startsWith("http") && <span>{columnIter}</span>}
                                                                    &nbsp;</span>
                                                            ))
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }

                                </div>
                            </div>
                            <br></br>
                            <div className="thread-right-section align-self-start">
                                {comment?.userId === userDetails?.user?.userId && discussion.closed === false && (showEditTextBox === false || (commentToEdit !== undefined && commentToEdit.id === comment.id)) &&
                                    (<span className='status-change'>
                                        <RiEdit2Line className='action-icons' title="Edit comment" onClick={() => {
                                            setCommentToEdit(comment);
                                            setShowEditTextBox(true);
                                        }} />&nbsp;&nbsp;
                                        <RiDeleteBinLine className='action-icons' title="Delete comment" onClick={() => {
                                            setModalShowDelete(true);
                                            setcommentToDelete(comment);
                                        }} />
                                    </span>)
                                }
                                <p>{triggerEditDelete}</p>
                                {
                                    (showEditTextBox === true) && commentToEdit !== undefined && commentToEdit.id !== comment.id && comment?.userId === userDetails?.user?.userId &&
                                    <div className='disable-div'>
                                        <span><RiEdit2Line />
                                            &nbsp;&nbsp;<RiDeleteBinLine /></span>

                                    </div>
                                }

                            </div>
                        </div>
                        <br></br>
                    </div>
                ))}

                {!discussion?.closed && (userDetails?.role?.roleId === 1 || userDetails?.user?.userId === discussion?.userId) && (<><TextFilesInputSection key={'CommentInput-' + renderComment} textInput={comment}
                    files={[]}
                    placeholder={'Post a reply...'}
                    exportTextInput={handleReplyTextInput}
                    exportFiles={(data: any[]) => { }} />
                    <div className="action-buttons d-flex align-items-center justify-content-end mt-5">
                        <Button variant="secondary" className="fw-bold" onClick={handleCancelButton}> Cancel </Button>
                        <Button variant="primary" className="ms-3 fw-bold" onClick={handlePostComment} disabled={comment?.trim().length <= 0}> Post </Button>
                    </div></>)}
            </div>
        </>
    )
}

export default ThreadDetails