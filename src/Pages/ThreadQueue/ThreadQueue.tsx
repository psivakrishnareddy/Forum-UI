
import { Outlet } from 'react-router-dom'
import DiscussionCard from '../../components/DiscussionCard/DiscussionCard'
import TrendQuestionsCard from '../../components/TrendQuestionsCard/TrendQuestionsCard'

const ThreadQueue = () => {
    return (
        <div className="forum-queue-container d-flex align-items-start justify-content-evenly flex-wrap flex-lg-nowrap h-100 w-100 mt-2">
            <div className="left-side-menu-container w-25 d-flex flex-column">
                <DiscussionCard></DiscussionCard>
                <TrendQuestionsCard></TrendQuestionsCard>

            </div>
            <div className="right-side-main-content w-75 px-2 ms-4">
                <Outlet />
            </div>
        </div>
    )
}

export default ThreadQueue