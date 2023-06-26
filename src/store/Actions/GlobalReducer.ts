import { SET_CONTINUE, SET_DISCUSSION_CATEGORY, SET_GLOBAL_LOADER,SET_LOGGED_OUT_TIMEOUT } from "../Types/GlobalTypes";

export const GlobalReducer = (state: any, action: {type: string, payload: any}) => {
    switch (action.type) {
        case SET_GLOBAL_LOADER:
            return {...state, isAppLoading: action.payload}
            
        case SET_DISCUSSION_CATEGORY:
            return {...state,category:action.payload}
            
        case SET_CONTINUE:
            return {...state,isContinue:action.payload}

        case SET_LOGGED_OUT_TIMEOUT:
            return {...state,loggedOutThroughTimeout:action.payload}
            
        default:
            return state;
    }
}