import PlatformApi from "../utils/PlatformApi";
import { ADD_COMMENT, ADD_TO_FAQ, BOOKMARK_QUESTION, CLOSE_THREAD_DISCUSSION, 
     CREATE_THREAD_DISCUSSION, DELETE_COMMENT, EDIT_THREAD_DISCUSSION, GET_ALL_DISCUSSIONS, GET_CATEGORY_DATA,
     GET_DISCUSSION_BYID, GET_SAVED_DISCUSSION, GET_TICKET_STATUS, 
     GET_TICKET_STATUS_BY_CATEGORY, 
     GET_TRENDING_DISCUSSIONS, GET_USER_DISCUSSION, UPDATE_COMMENT, VOTE_DISCUSSION} from "../constants/urlConstants"
import { SearchParamsType } from "../constants/types";
import { IQuestionData } from "../constants/models";

export class DiscussionService {

    static getAllDiscussions({sort,offset,limit,categoryId ,filter = '', status = '0',faqCategoryId}: SearchParamsType) {
        let options = {params:{sort:sort, offset:offset, limit: limit,categoryId:categoryId, filter: filter, statusId: status,faqCategoryId: faqCategoryId} }
        return PlatformApi.get(GET_ALL_DISCUSSIONS,options).then((response)=> response.data);
    }

    static getQuestionCategories() {
        return PlatformApi.get(GET_CATEGORY_DATA).then((response)=> response.data);
    }

    static getTrendingQuestions() {
        return PlatformApi.get(GET_TRENDING_DISCUSSIONS).then((response)=> response.data);
    }

    static getUserDiscussions({sort,offset,limit,categoryId ,filter = ''}: SearchParamsType) {
        let options = {params:{sort:sort, offset:offset, limit: limit,categoryId:categoryId, filter: filter} }
        return PlatformApi.get(GET_USER_DISCUSSION,options).then((response)=> response.data);
    }

    static getSavedDiscussions({sort,offset,limit ,filter = ''}: SearchParamsType) {
        let options = {params:{sort:sort, offset:offset, limit: limit, filter: filter} }
        return PlatformApi.get(GET_SAVED_DISCUSSION,options).then((response)=> response.data);
    }

    static getDiscussionById(postId: string) {
        return PlatformApi.get(GET_DISCUSSION_BYID + `?discussionId=${postId}`).then((response)=> response.data)
    }

    static postVoteHandle(postId: number, action: boolean) {
        return PlatformApi.post(VOTE_DISCUSSION,{ postId, action }).then((response)=>response.data);
    }

    static postBookmark(postId: number, action: boolean) {
        return PlatformApi.post(BOOKMARK_QUESTION,{ postId, action }).then((response)=>response.data);
    }

    static postDiscussion(questionData: IQuestionData) {
        return PlatformApi.post(CREATE_THREAD_DISCUSSION,questionData).then((response)=>response.data);
    }

    static updateDiscussion(questionData: IQuestionData) {
        return PlatformApi.post(EDIT_THREAD_DISCUSSION,questionData).then((response)=>response.data);
    }

    static postComment(postId: number, description: string) {
        return PlatformApi.post(ADD_COMMENT,{postId, description}).then((response)=>response.data);
    }

    static UpdateComment(postId: number, commentId: number , description : string) {
        return PlatformApi.post(UPDATE_COMMENT,{postId, commentId, description}).then((response)=>response.data);
    }

    static postCloseConversation(postId: number) {
        return PlatformApi.post(CLOSE_THREAD_DISCUSSION + `?postId=${postId}`).then((response)=> response.data);
    }

    static postAddToFAQs(postId: number, action: boolean) {
        return PlatformApi.post(ADD_TO_FAQ, { postId, action }).then((response)=> response.data);
    }

    static getTicketStatusData() {
        return PlatformApi.get(GET_TICKET_STATUS).then((response)=>response.data);
    }

    static getTicketStatusDataByCategory(categoryId : number) {
        return PlatformApi.get(GET_TICKET_STATUS_BY_CATEGORY + `?categoryId=${categoryId}`).then((response)=>response.data);
    }
    
    static deleteCommentOfAuthor(commentId: number, postId : number){
        return PlatformApi.post(DELETE_COMMENT, {commentId, postId}).then((response) => response.data);
    }
}