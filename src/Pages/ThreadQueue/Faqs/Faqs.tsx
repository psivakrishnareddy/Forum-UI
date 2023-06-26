import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Accordion, Button, ListGroup } from "react-bootstrap";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PaginationBox from "../../../components/common/UI/PaginationBox/PaginationBox";
import FilterBar from "../../../components/FilterBar/FilterBar";
import { IThread } from "../../../constants/models";
import { DiscussionResponseType, SearchParamsType } from "../../../constants/types";
import { DiscussionService } from "../../../services/DiscussionService";
import GlobalContext from "../../../store/context/global-context";
import {SET_GLOBAL_LOADER } from "../../../store/Types/GlobalTypes";
import {FAQCATEGORY,FAQCATEGORYID } from "../../../constants/appConstants";
import "./Faqs.scss"

const Faqs: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useContext(GlobalContext);
    const [faqFilters] = useSearchParams({category: FAQCATEGORY, sort: 'asc', filter: 'all',faqCategoryId: FAQCATEGORYID });
    const [currentPage, setCurrentPage] = useState(1);
    const [faqs, setFaqs] = useState<IThread[]>([]);
    const location = useLocation();
    const sortValue = faqFilters.get('sort') === 'asc' ? 0 : 1;
    const [totalPage, setTotalPage] = useState(1);
    const fetchFaqData = () => {
        let searchParams: SearchParamsType = { sort: sortValue === 0 ? 'recent' : 'oldest', offset: ((currentPage - 1) * 5), limit: 5 || 0, categoryId: faqFilters.get('category') || '', filter: faqFilters.get("filter") || '', status: faqFilters.get("status") || '0',faqCategoryId: faqFilters.get('faqCategoryId')|| '1' }
        dispatch({ type: SET_GLOBAL_LOADER, payload: true })
        DiscussionService.getAllDiscussions(searchParams).then((data: DiscussionResponseType) => {
            setFaqs(data?.discussionData);
            dispatch({ type: SET_GLOBAL_LOADER, payload: false })
            setTotalPage(Math.floor(data.totalCount / 5) + (data.totalCount % 5 === 0 ? 0 : 1));
        });
    }
    const handleSortFilter = (event: ChangeEvent<HTMLSelectElement>) => {
        let sort = event.currentTarget?.value === '0' ? 'asc' : 'desc';
        navigate({ pathname: location.pathname, search: `?category=${faqFilters.get('category')}&sort=${sort}&faqCategoryId=${faqFilters.get('faqCategoryId')}` })
    }
    const pageChangeHandler = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }
    const handleCategoryFilter = (event: ChangeEvent<HTMLSelectElement>) => {
        let category = event.currentTarget?.value;
        navigate({ pathname: location.pathname, search: `?category=${faqFilters.get('category')}&sort=${faqFilters.get('sort')}&faqCategoryId=${category}` })
    }

    const handleTrendQuestionClick = (postId: number) => {
        navigate("/forum/threads/" + postId.toString());
    }

    useEffect(() => {
        fetchFaqData();
    }, [faqFilters, currentPage])

    useEffect(() => {
        setCurrentPage(1);
    }, [faqFilters.get('faqCategoryId')])

    return (
        <div className="faqs-queue-container mt-1">
            <FilterBar type="faqs" onInputCategory={handleCategoryFilter}  sortValue={sortValue} onInputSort={handleSortFilter}/>
            <div className="faq-list-container">
                    {faqs?.map((faq: IThread, index: number) => (
                        <Accordion key={index} flush className='swam-accordian dash-box-shadow mb-4'>
                        <Accordion.Item eventKey="0" className=''>
                            <Accordion.Header as={'div'} className='fs-3 fw-bold border-start border-primary border-5'>{faq.title}</Accordion.Header>
                            <Accordion.Body className='fs-6 fs-light border-start border-primary border-5 pointer-cursor' onClick={() => handleTrendQuestionClick(faq?.id)}>
                           {faq.description}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    ))}
                            <div className="text text-center load-more" >
        </div>
            </div>
            <span className='d-flex justify-content-center mt-3 pagination-box'><PaginationBox activePage={currentPage} totalPageNumbers={totalPage} pageChange={pageChangeHandler}></PaginationBox></span>
        
        </div>
    )
}
export default Faqs