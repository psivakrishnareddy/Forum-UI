import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IQuestionData, IThread } from "../../constants/models";
import { QuestionCategoryType } from "../../constants/types";
import { DiscussionService } from "../../services/DiscussionService";
import GlobalContext from "../../store/context/global-context";
import { SET_GLOBAL_LOADER } from "../../store/Types/GlobalTypes";
import Chips from "../common/UI/Chips/Chips";
import InputField from "../common/UI/InputField/InputField";
import "./QuestionForm.scss";


const QuestionForm: React.FC = () => {
    const params = useParams();
    const location = useLocation();
    const [categories, setCategories] = useState<Array<QuestionCategoryType>>([]);
    const [title, settitle] = useState('');
    const [categoryInput, setcategoryInput] = useState(1);
    const [description, setdescription] = useState('');
    const [tags, settags] = useState<string[]>([])
    const tagsArray: string[] = [];
    const navigate = useNavigate();
    const [editOrCreate, setEditOrCreate] = useState("");
    const { dispatch } = useContext(GlobalContext)

    const fetchCategories = () => {
        DiscussionService.getQuestionCategories().then((categoriesList: QuestionCategoryType[]) => {
            categoriesList.shift();
            setCategories(categoriesList);
        })
    }

    const handlePostQuestion = () => {
        if (title === '' || description === '') {
            toast.error('Please enter the details');
            return;
        }
        console.log(title, categoryInput, description, categoryInput, "FORM");
        let questionData: IQuestionData = {
            title: title,
            description: description,
            categoryId: categoryInput,
            tags: tags
        }
        dispatch({ type: SET_GLOBAL_LOADER, payload: true })
        DiscussionService.postDiscussion(questionData).then((postId: number) => {
            setcategoryInput(0);
            setdescription('');
            settitle('');
            settags([]);
            dispatch({ type: SET_GLOBAL_LOADER, payload: false })
            toast.success('Your post was posted successfully');
            navigate("/forum/threads/" + postId.toString(), { state: { isCategoryUpdated: true } });
        }).catch(() => {
            toast.error("Error in posting thread");
            navigate("/forum/threads/");
        })

    }

    const fetchDiscussion = (postId: string) => {
        dispatch({ type: SET_GLOBAL_LOADER, payload: true })
        DiscussionService.getDiscussionById(postId).then((discussion: IThread) => {
            settitle(discussion.title);
            setdescription(discussion.description);
            setcategoryInput(discussion.category.id);
            discussion.tags.forEach(tags => {
                if (!tagsArray.includes(tags.tagName)) {
                    tagsArray.push(tags.tagName)
                }
            });
            settags(tagsArray);
            dispatch({ type: SET_GLOBAL_LOADER, payload: false })
        })
    }


    const editQuestion = () => {
        if (title === '' || description === '') {
            alert("Please enter the question details!");
            return;
        }
        let postId = params?.postid || "0";
        let questionData: any = {
            title: title,
            description: description,
            categoryId: categoryInput,
            tags: tags,
            postId: postId
        }
        dispatch({ type: SET_GLOBAL_LOADER, payload: true })
        DiscussionService.updateDiscussion(questionData).then((postId: number) => {
            setcategoryInput(0);
            setdescription('');
            settitle('');
            settags([]);
            dispatch({ type: SET_GLOBAL_LOADER, payload: false })
            toast.info('Your post was updated successfully');
            navigate("/forum/threads/" + postId.toString(), { state: { isCategoryUpdated: true } });
        }).catch(() => {
            toast.error("Error in updating post");
            navigate("/forum/threads/" + postId.toString());
        })

    }

    const handleCancelQuestion = () => {
        navigate("/forum/threads")
    }
    const handleCancelQuestionEdit = () => {
        let postId = params?.postid || "0";
        navigate("/forum/threads/" + postId);
    }

    useEffect(() => {
        if (location.pathname.includes("edit")) {
            setEditOrCreate("edit");
            let postId = params?.postid || "0";
            fetchDiscussion(postId);
        }
        else {
            setEditOrCreate("create");
        }
        fetchCategories();
    }, [])

    return (
        <div className="qa-form-container dash-box-shadow bg-white border-start border-primary border-5 ps-5 py-5 pe-3 mb-3">
            <InputField type={'text'} label="Question" maxLength={255} value={title} onChange={(e) => settitle(e.currentTarget.value)} required />
            <div className="description-container w-100 d-inline-block">
                <InputField type="text" label="Description" maxLength={3000} value={description} onChange={(e) => setdescription(e.currentTarget.value)} required />
            </div>
            <div className="d-flex justify-content-between">
                <div className="categories-select w-25">
                    <label className="form-label fs-7 fw-bold">Categories *</label>
                    <select className="form-select  bg-secondary mb-3" aria-label="Sort Select" value={categoryInput} onInput={(e) => setcategoryInput(+e.currentTarget.value)}>
                        {categories?.filter((ctg: QuestionCategoryType)  => ctg.name.toLowerCase() !== 'faqs').map((ctg: QuestionCategoryType) => (
                            <option key={ctg.id} value={ctg.id}>{ctg.name}</option>
                        ))}
                    </select>
                </div>
                <div className="tags-container w-50 d-inline-block">
                    <label className="form-label fs-7 fw-bold">Tags</label>
                    <Chips labels={tagsArray} readOnly={false} exportChips={(data) => settags(data)}></Chips>
                </div>
            </div>

            <div className="action-buttons d-flex align-items-center justify-content-end mt-5">
                {editOrCreate === "create" && <Button variant="secondary" className="fw-bold" onClick={handleCancelQuestion}> Cancel </Button>}
                {editOrCreate === "edit" && <Button variant="secondary" className="fw-bold" onClick={handleCancelQuestionEdit}> Cancel </Button>}
                {editOrCreate === "create" && <Button variant="primary" className="ms-3 fw-bold" onClick={handlePostQuestion} disabled={title.trim().length <= 0 || description.trim().length <= 0}> Post </Button>}
                {editOrCreate === "edit" && <Button variant="primary" className="ms-3 fw-bold" onClick={() => {
                    editQuestion()
                }} disabled={title.trim().length <= 0 || description.trim().length <= 0}> Update </Button>}
            </div>

        </div >
    )
}

export default QuestionForm