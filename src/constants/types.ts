import { IThread } from "./models"

export declare type QuestionCategoryType = {
    id: number,
    name: string,
    count: number
}

export declare type QuestionsTicketDataType = {
    id: number,
    status: string,
    count: number
}

export declare type DiscussionResponseType = {
    discussionData: IThread[],
    totalCount: number
}

// Service Types
export declare type SearchParamsType = {
    sort: string,
    offset: number,
    limit: number,
    categoryId?: string,
    filter?: string,
    status?: string,
    faqCategoryId?: string
}

export declare type ToastContent = {
    timestamp: number,
    type: string,
    header?: string,
    message: string,
    expireAt: number,
    show: boolean
}

export declare type IToastContext =  { 
    toastContent: ToastContent[]; 
    setToastContent: (content?: ToastContent) => void
}
