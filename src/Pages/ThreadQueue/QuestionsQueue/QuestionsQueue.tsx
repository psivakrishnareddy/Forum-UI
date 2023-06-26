
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PaginationBox from '../../../components/common/UI/PaginationBox/PaginationBox';
import DashTabs from '../../../components/common/UI/Tabs/DashTabs';
import FilterBar from '../../../components/FilterBar/FilterBar';
import ThreadCard from '../../../components/ThreadCard/ThreadCard'
import { AdminThreadFilter, questionCategoryColors } from '../../../constants/appConstants';
import { IThread } from '../../../constants/models';
import { DiscussionResponseType, QuestionsTicketDataType, SearchParamsType } from '../../../constants/types';
import { DiscussionService } from '../../../services/DiscussionService';
import AuthContext from '../../../store/context/auth-context';
import GlobalContext from '../../../store/context/global-context';
import { SET_GLOBAL_LOADER } from '../../../store/Types/GlobalTypes';
import "./QuestionQueue.scss"

const QuestionsQueue: React.FC = () => {
    const { dispatch } = useContext(GlobalContext);
    const { userDetails } = useContext(AuthContext);
    const [threadFilters] = useSearchParams({ category: '0', sort: 'asc', filter: 'all' });
    const [ticketCountData, setticketCountData] = useState<any>([]);
    const sortValue = threadFilters.get('sort') === 'asc' ? 0 : 1;
    const [threads, setthreads] = useState<IThread[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [tabValue, setTabValue] = useState<number>(0)
    const navigate = useNavigate();
    const location = useLocation();
    const [filter, setFilter] = useState<string>("all");

    const handleSortFilter = (event: ChangeEvent<HTMLSelectElement>) => {
        let sort = event.currentTarget?.value === '0' ? 'asc' : 'desc';
        navigate({ pathname: location.pathname, search: `?category=${threadFilters.get('category')}&sort=${sort}` })
        fetchthreadsData();
    }

    const handleStatusFilter = (event: ChangeEvent<HTMLSelectElement>) => {
        let status = event.currentTarget?.value === '1' ? '3' : '0';
        threadFilters.set("status", status);
        fetchthreadsData();
    }

    const fetchthreadsData = () => {
        let status = threadFilters.get("status") || tabValue.toString();
        let filterValue = threadFilters.get("filter") || filter;
        setTabValue(parseInt(status));
        let searchParams: SearchParamsType = { sort: sortValue === 0 ? 'recent' : 'oldest', offset: ((currentPage - 1) * 5), limit: 5, categoryId: threadFilters.get('category') || '', filter: filterValue || '', status: status || '0'}
        dispatch({ type: SET_GLOBAL_LOADER, payload: true })
        DiscussionService.getAllDiscussions(searchParams).then((data: DiscussionResponseType) => {
            setthreads(data?.discussionData);
            dispatch({ type: SET_GLOBAL_LOADER, payload: false })
            setTotalPage(Math.floor(data.totalCount / 5) + (data.totalCount % 5 === 0 ? 0 : 1));
        });
        if (userDetails?.role.roleId === 1) {
            if(searchParams.categoryId === '0')
            {
                DiscussionService.getTicketStatusData().then((data: QuestionsTicketDataType[]) => {
                    let ticketData = AdminThreadFilter.map((question: any) => {
                        let category = data.find((catg: QuestionsTicketDataType) => catg.id === question.id);
                        return { ...question, count: category?.count }
                    });
                    setticketCountData(ticketData); 
                })
            }
            else 
            {
                if(searchParams.categoryId !== undefined)
                {
                   DiscussionService.getTicketStatusDataByCategory(+searchParams.categoryId).then((data: QuestionsTicketDataType[]) => {
                    let ticketData = AdminThreadFilter.map((question: any) => {
                        let category = data.find((catg: QuestionsTicketDataType) => catg.id === question.id);
                        return { ...question, count: category?.count }
                    });
                    setticketCountData(ticketData);
                })
                }
                
            }
            
        } else {
            console.log("Not Admin");
        }

    }

    const pageChangeHandler = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    const handleAdminFilter = (event: string | any) => {
        if (event !== '') {
            let tabValue = event.split('-').at(-1) || '0';
            let filter = AdminThreadFilter[tabValue]?.filter || '';
            threadFilters.set("filter", filter);
            threadFilters.set("status", tabValue);
            setTabValue(tabValue)
            setFilter(filter);
            setCurrentPage(1);
            fetchthreadsData();
        }
    }

    useEffect(() => {
        fetchthreadsData();
    }, [threadFilters, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [threadFilters.get('category')])

    return (
        <div className="questions-queue-container">
            <FilterBar sortValue={sortValue} onInputSort={handleSortFilter} onInputStatus={handleStatusFilter} ShowAdminStatusFilter={userDetails?.role?.roleId === 1} showAskButton />
            {userDetails?.role?.roleId === 1 && <DashTabs headers={ticketCountData} tabGroupName="adminfiltertabs" onSelectTabs={handleAdminFilter} tabValue={tabValue}></DashTabs>}
            <div className="threads-list-container">
                {threads?.map((thread: IThread, index: number) => (
                    <ThreadCard key={thread.id} postId={thread.id} title={thread.title}
                        author={thread.userName}
                        timestamp={new Date(thread.timestamp)}
                        category={{ color: questionCategoryColors[thread.category.id], text: thread.category.name }}
                        votes={thread.voteCount}
                        status={thread.status}
                        liked={thread.voted}
                        comments={thread.commentCount!}
                        tags={thread.tags.join(', ')}
                    >{thread.description}
                    </ThreadCard>
                ))}
            </div>
            <span className='d-flex justify-content-center mt-3'><PaginationBox activePage={currentPage} totalPageNumbers={totalPage} pageChange={pageChangeHandler}></PaginationBox></span>
        </div>
    )
}

export default QuestionsQueue