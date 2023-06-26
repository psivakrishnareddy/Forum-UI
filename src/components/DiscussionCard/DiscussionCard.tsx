import { CSSProperties, useContext, useEffect, useRef, useState } from "react"
import { ListGroup } from "react-bootstrap"
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { questionCategoryColors } from "../../constants/appConstants";
import { QuestionCategoryType } from "../../constants/types";
import { DiscussionService } from "../../services/DiscussionService";
import CatIndicator from "../common/UI/CategoryBadge/CatIndicator";
import CompLoader from "../common/UI/Loader/CompLoader";
import "./DiscussionCard.scss";
import { SET_DISCUSSION_CATEGORY } from "../../../src/store/Types/GlobalTypes";
import GlobalContext from "../../store/context/global-context";


const DiscussionCard: React.FC<{ style?: CSSProperties }> = (props) => {
    const [categories, setCategories] = useState<Array<QuestionCategoryType>>([]);
    const [isCatgLoading, setisCatgLoading] = useState(false);
    const CategoryColors = questionCategoryColors;

    const { dispatch } = useContext(GlobalContext);
    let styles = props.style || {};
    const [selectedCategory, setselectedCategory] = useState(0);
    const [threadFilters] = useSearchParams({ category: '0', sort: 'asc' });
    const [faqCategory, setfaqCategory] = useState<QuestionCategoryType>()
    const faqsActive = useRef(false);

    const sortThreads = threadFilters.get('sort') || 'asc';
    const location = useLocation();

    const fetchCategories = async () => {
        setisCatgLoading(true);
        DiscussionService.getQuestionCategories().then((categories) => {
            let faq = categories.pop();
            setCategories(categories);
            dispatch({ type: SET_DISCUSSION_CATEGORY, payload: categories })
            setfaqCategory(faq);
            setisCatgLoading(false);
        }).catch(() => setisCatgLoading(false))
    }
    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (location.state && location.state?.isCategoryUpdated) {
            fetchCategories();
        }
    }, [location.state?.isCategoryUpdated]);

    useEffect(() => {
        let category = threadFilters.get('category') || 0;
        if (location.pathname === '/forum/threads') {
            if (selectedCategory === +category) {
                return;
            }
            setselectedCategory(+category);
            faqsActive.current = false;
        } else
            if (location.pathname === '/forum/faqs') {
                if (selectedCategory === -1) {
                    return;
                }
                faqsActive.current = true;
                setselectedCategory(-1);
            }
        // eslint-disable-next-line
    }, [selectedCategory, threadFilters]);


    return (
        <div className="card dash-menu-card p-1 mx-1" style={styles}>
            <div className="header d-flex align-items-center px-3">
                <div className="dash-menu-icon d-flex align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#fff">
                        <path d="M0 0h24v24H0V0z" fill="none" /><path d="M15 4v7H5.17l-.59.59-.58.58V4h11m1-2H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm5 4h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z" />
                    </svg>
                </div>
                <div className="menu-title ms-3 fs-6">
                    <b>Discussions</b>
                </div>
            </div>
            <hr className="my-0 mx-3" />
            <div className="card-content d-flex align-items-center justify-content-center">
                {isCatgLoading ? (<CompLoader />) : (<ListGroup variant="flush">
                    {categories?.map((category: any, index: number) => (
                        <ListGroup.Item key={category.id} className={category?.id === selectedCategory ? 'border border-primary text-primary fw-bold' : ''}>
                            <NavLink style={{ textDecoration: "none", color: "unset" }} to={{ pathname: "threads", search: `?category=${category?.id}&sort=${sortThreads}` }}>
                                <div className="catg-menu-item d-flex justify-content-start align-items-center fs-7">
                                    <CatIndicator color={CategoryColors[category.id % CategoryColors.length]}></CatIndicator>
                                    <div className="label px-2">{category?.name} ({category?.count})</div>
                                </div>
                            </NavLink>
                        </ListGroup.Item>
                    ))}

                    <ListGroup.Item key="Faqs" className={(faqsActive.current) ? 'border border-primary text-primary fw-bold' : ''}>
                        <NavLink style={{ textDecoration: "none", color: "unset" }} to={{ pathname: "faqs", search: `?filter=${0}&sort=${sortThreads}` }}>
                            <div className="catg-menu-item d-flex justify-content-start align-items-center fs-7">
                                <CatIndicator color="dark-indigo"></CatIndicator>
                                <div className="label px-2">FaQs ({faqCategory?.count})</div>
                            </div>
                        </NavLink>
                    </ListGroup.Item>
                </ListGroup>)}
            </div>
        </div>
    )
}

export default DiscussionCard