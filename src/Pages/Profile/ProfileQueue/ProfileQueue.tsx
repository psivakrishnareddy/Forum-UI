import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaginationBox from '../../../components/common/UI/PaginationBox/PaginationBox';
import FilterBar from '../../../components/FilterBar/FilterBar'
import ThreadCard from '../../../components/ThreadCard/ThreadCard'
import { questionCategoryColors } from '../../../constants/appConstants';
import { IThread } from '../../../constants/models';
import { DiscussionResponseType, SearchParamsType } from '../../../constants/types';
import { DiscussionService } from '../../../services/DiscussionService';
import GlobalContext from '../../../store/context/global-context';
import { SET_GLOBAL_LOADER } from '../../../store/Types/GlobalTypes';

const ProfileQueue: React.FC<{ isSavedDiscussion?: boolean }> = ({ isSavedDiscussion }) => {
    const { dispatch } = useContext(GlobalContext);
    const [userDiscussions, setuserDiscussions] = useState<Array<IThread>>([])
    const [threadFilters] = useSearchParams({ category: '0', sort: 'asc' });
    const location = useLocation();
    const navigate = useNavigate();
    const sortValue = threadFilters.get('sort') === 'asc' ? 0 : 1;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const handleSortFilter = (event: ChangeEvent<HTMLSelectElement>) => {
        let sort = event.currentTarget?.value === '0' ? 'asc' : 'desc';
        navigate({ pathname: location.pathname, search: `?sort=${sort}` });
    }

    const fetchUserDiscussions = () => {
        dispatch({ type: SET_GLOBAL_LOADER, payload: true })
        let searchParams: SearchParamsType = { sort: sortValue === 0 ? 'recent' : 'oldest', offset: ((currentPage - 1) * 5), limit: 5, categoryId: threadFilters.get('category') || '' }
        DiscussionService.getUserDiscussions(searchParams).then((data: DiscussionResponseType) => {
            setuserDiscussions(data?.discussionData);
            setTotalPage(Math.floor(data.totalCount / 5) + (data.totalCount % 5 === 0 ? 0 : 1));
            dispatch({ type: SET_GLOBAL_LOADER, payload: false })
        }).catch(()=>{
            toast.error("Error in fetching discussions");
        })
    }

    const fetchSaveDiscussions = () => {
        dispatch({ type: SET_GLOBAL_LOADER, payload: true })
        console.log(threadFilters.get('sort'), sortValue)
        let searchParams: SearchParamsType = { sort: sortValue === 0 ? 'recent' : 'oldest', offset: ((currentPage - 1) * 5), limit: 5, categoryId: threadFilters.get('category') || '' }
        DiscussionService.getSavedDiscussions(searchParams).then((data: DiscussionResponseType) => {
            setuserDiscussions(data?.discussionData);
            setTotalPage(Math.floor(data.totalCount / 5) + (data.totalCount % 5 === 0 ? 0 : 1));
            dispatch({ type: SET_GLOBAL_LOADER, payload: false })
        }).catch(()=>{
            toast.error("Error in fetching discussions");
        })
    }

    const fetchDiscussion = () => {
        if (!isSavedDiscussion) {
            fetchUserDiscussions();
        } else {
            fetchSaveDiscussions();
        }
    }
    useEffect(() => {
        fetchDiscussion();
    }, [threadFilters, location.pathname, currentPage, totalPage]);

    useEffect(() => {
        setCurrentPage(1)
    }, [location.pathname])

    const pageChangeHandler = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="questions-queue-container mt-1">
            <FilterBar sortValue={sortValue} onInputSort={handleSortFilter} />
            <div className="threads-list-container">
                {userDiscussions?.map((thread: IThread, index: number) => (
                    <ThreadCard key={thread.id} postId={thread.id} title={thread.title}
                        author={thread.userName}
                        timestamp={new Date(thread.timestamp)}
                        category={{ color: questionCategoryColors[thread.category.id], text: thread.category.name }}
                        votes={thread.voteCount}
                        status={thread.status}
                        reply={thread.commentCount}
                        tags={thread.tags.join(', ')}
                        liked={thread.voted}
                        isUserThread
                    >
                    </ThreadCard>
                ))}
            </div>
            <span className='d-flex justify-content-center'><PaginationBox activePage={currentPage} totalPageNumbers={totalPage} pageChange={pageChangeHandler}></PaginationBox></span>
        </div>
    )
}

export default ProfileQueue