import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import sbsdLogo from "../../assets/images/sbsd_logo.png";
import { IThread } from "../../constants/models";
import { DiscussionResponseType } from "../../constants/types";
import { DiscussionService } from "../../services/DiscussionService";
import CompLoader from "../common/UI/Loader/CompLoader";

const TrendQuestionsCard: React.FC = (props: any) => {
    const navigate = useNavigate();
    const [trendQuestionsList, settrendQuestionsList] = useState<Array<IThread>>([]);
    const [isQaLoading, setisQaLoading] = useState(false);

    const fetchTrendingQuestions = async () => {
        setisQaLoading(true);
        DiscussionService.getTrendingQuestions().then((data: DiscussionResponseType) => {
            settrendQuestionsList(data?.discussionData)
            setisQaLoading(false);
        }).catch(err => {
            toast.error("Error in fetching trending discussions");
            setisQaLoading(false);
        })
    }

    const handleTrendQuestionClick = (postId: number) => {
        navigate("threads/" + postId.toString());
    }

    useEffect(() => {
        fetchTrendingQuestions();
    }, [])


    return (
        <div className="card dash-menu-card p-1 mx-1 mt-4">
            <div className="header d-flex align-items-center px-3">
                <div className="dash-menu-icon d-flex align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#fff">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
                    </svg>
                </div>
                <div className="menu-title ms-3 fs-6">
                    <b>Trending Questions</b>
                </div>
            </div>
            <hr className="my-0 mx-3" />
            <div className="card-content d-flex align-items-center justify-content-center">
                {isQaLoading ? (<CompLoader />) : (<ListGroup variant="flush" className="w-100">
                    {trendQuestionsList?.map((thread: IThread, index: number) => (
                        <ListGroup.Item key={index} onClick={() => handleTrendQuestionClick(thread?.id)}>
                            <div className="trend-qa-container d-flex align-items-start pointer-cursor">
                                <div className="image-user rounded-circle">
                                    <img src={sbsdLogo} alt="icon" height={'15px'} width={'15px'} />
                                </div>
                                <div className="qa-container text-start ms-2">
                                    <p className="fs-7 text-dark m-0">
                                        {thread.title}
                                    </p>
                                    <p className="fs-9 text-gray m-0">
                                        Created at {new Date(thread.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                    {trendQuestionsList?.length === 0 && <p className="fs-7 text-center py-2 text-dark m-0">No Questions Found!</p>}
                </ListGroup>)}
            </div>
        </div>
    )
}

export default TrendQuestionsCard