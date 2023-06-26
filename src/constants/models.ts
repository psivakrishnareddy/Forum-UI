export interface Tags {
    deleted:boolean
    id: number
    postId: number
    tagName: string
}

export interface Comment {
    createdAt: string,
    deleted: boolean
    description: string,
    feedback: string,
    feedbackData: string[]
    id: number
    isUseful: boolean,
    postId: number,
    userId: number,
    userName:string
}
export interface IThread {
    id: number,
    title: string,
    description: string,
    categoryId: number,
    category: {id: number, name: string},
    tags: Tags[],
    status?: string,
    comments: Comment[],
    commentCount: number,
    voteCount: number,
    userId: number,
    userName: string,
    createdAt?: Date,
    timestamp: string,
    voted: boolean,
    bookmarked?: boolean,
    closed?: boolean,
    faq?:boolean,
    reported?: boolean
}

export interface IQuestionData {
    title: string,
    description: string,
    categoryId: number,
    tags: string[]
}


interface IUser {
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    createdAt: string,
    lastLogin: string,
    updatedAt: string,
    status: string,
    isDeleted: boolean,
    active: boolean
}

interface IRole {
    roleId: number,
    roleName: string,
    rolePriority: number,
    description: string
} 

export interface IAgency {
    [x: string]: any
    agencyId: number,
    agencyName: string,
    updatedAt: string,
    createdAt: string,
    agencyType: string,
    leaf: boolean,
    agencyCode: string | number,
    agencyGroupId: string,
    streetaddress: string,
    city: string,
    state: string,
    zipcode: string,
    active: boolean,
    self: boolean

}
export interface IUserDetails {
    user: IUser,
    role: IRole,
    agency: IAgency
}

export interface IAuth0Config {
    domain: string, 
    clientId: string, 
    redirectUri: string, 
    audience: string
}

export interface INotification {
    description: string,
    id: number,
    postId: number,
    read: boolean
    triggerTime: string
    userId: number
}