import React, { createContext, ReactNode, useReducer } from 'react'
import { GlobalReducer } from '../Actions/GlobalReducer';

// const GlobalContext = React.createContext({
//     isAppLoading: false,
//     toggleAppLoader: (isLoading: boolean): void => { }
// })

const initialState = {
    isAppLoading: false,
    isContinue: false,
    category:[],
    loggedOutThroughTimeout: false
}

const GlobalContext = createContext<any>(initialState);

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(GlobalReducer, initialState)
    // const [isAppLoading, setisAppLoading] = useState(false);

    // const toggleGlobalAppLoader = (isLoading: boolean) => {
    //     console.log(isLoading, '[Loader]');

    //     setisAppLoading(isLoading);
    // }
    // const GlobalContextValue = {
    //     isAppLoading: isAppLoading,
    //     toggleAppLoader: toggleGlobalAppLoader
    // }

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContext;