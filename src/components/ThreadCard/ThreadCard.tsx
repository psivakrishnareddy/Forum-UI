import CommentButton from "../common/UI/CommentButton/CommentButton";
import Like from "../common/UI/LikeButton/LikeButton";
import CategoryBadge from "../common/UI/CategoryBadge/CategoryBadge";
import ReadMore from "../common/UI/ReadMore/ReadMore";
import "./ThreadCard.scss";
import ProfileBadge from "../common/UI/UserProfile/ProfileBadge";
import React, { useEffect, useState } from "react";
import { DiscussionService } from "../../services/DiscussionService";
import { useLocation, useNavigate } from "react-router-dom";
import { postTimeStamp } from "../../utils/DateUtils";
import { toast } from "react-toastify";

declare type ThreadProps = {
    title: string,
    children?: React.ReactNode,
    author: string,
    timestamp: Date,
    category: { color: string, text: string },
    comments?: number,
    reply?: number,
    liked: boolean,
    tags: string
    votes: number,
    status?: string,
    isUserThread?: boolean,
    postId: number
}



const ThreadCard: React.FC<ThreadProps> = (props) => {
    const [liked, setliked] = useState(false);
    const [votesCount, setVotesCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchThread = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (location.pathname === "/profile/activities" || location.pathname === "/profile/saved-posts") {
            navigate("/forum/threads/" + props.postId.toString())
        } else {
            navigate(props.postId.toString())
        }
    }

    const handleVoteTrigger = (event: React.MouseEvent) => {
        event.stopPropagation();
        let vote = !liked;
        DiscussionService.postVoteHandle(props.postId, vote).then(data => {
            setliked(vote);
            if (data) {
                  setVotesCount(votesCount+1)
            } else {
                setVotesCount(votesCount-1);
            }
        }).catch(()=>{
            toast.error("Error in posting vote");
        })
    }

    useEffect(() => {
        setliked(props.liked);
        setVotesCount(props.votes);
    }, [])

    return (
        <div className="thread-container bg-white border-start border-primary border-5 d-flex flex-column justify-content-between px-3 py-2 my-2 dash-box-shadow pointer-cursor" onClick={fetchThread}>
            <div className="thred-main-container d-flex justify-content-between align-items-center h-100">
                <div className="thread-left-section">
                    <ProfileBadge className="float-start" username={props.author} size="40" />
                    <div className="title d-flex flex-column justify-content-between align-items-start ps-3 me-1">
                        <div className="fs-7 text-gray fw-light">
                            Created by {`${props.author}`}&nbsp;<span className="fw-normal text-dark-gray">{postTimeStamp(props.timestamp)}</span> {props.status && (<span className="ms-4">Status: {(<span className="fw-normal text-dark-gray">{props.status}</span>)}</span>)}
                        </div>
                        <div className="fs-4">
                            <b>{props.title}</b>
                        </div>
                    </div>
                </div>
                <div className="thread-right-section align-self-start">
                    <CategoryBadge color={props.category.color}>{props.category.text}</CategoryBadge>
                </div>
            </div>
            <div className="main-content my-2 fs-7 text-dark-gray">
                {props.children ? <ReadMore>{props.children}</ReadMore> : null}
            </div>
            <div className="thread-footer d-flex justify-content-between align-items-center text-gray fs-7">
                <div className="thread-footer-left">
                    <div className="d-inline-block align-bottom pe-1">
                        <CommentButton size={15}></CommentButton>
                    </div>
                    {(!props.isUserThread) ?
                        (<span><span className="fw-normal text-dark-gray">{props.comments}</span> {props?.comments! <= 1 ? 'Comment' : 'Comments'}</span>)
                        : (<span><span className="fw-normal text-dark-gray">{props.reply}</span> {props?.reply! <= 1 ? 'Reply' : 'Replies'}</span>)}
                    {props.tags && (<span className="ms-4">Tags: <span className="fw-normal text-dark-gray">{props.tags}</span></span>)}
                </div>
                <div className="thread-footer-right">
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
        </div>
    )
}

export default ThreadCard
