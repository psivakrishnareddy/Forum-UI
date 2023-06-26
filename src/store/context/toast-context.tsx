import React, { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { IToastContext, ToastContent } from '../../constants/types';

const ToastContext = React.createContext<IToastContext>({ toastContent: [], setToastContent: () => { } });

export const ToastContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toastContent, setToastContent] = useState<ToastContent[]>([]);

    useEffect(() => {
        toastContent.forEach((content) => setExpiration(content, content.expireAt - Date.now()))
    }, [toastContent]);

    let setExpiration = (item: ToastContent, delay: number) => {
        setTimeout(() => { setToastContent([...toastContent.filter(content => content !== item)]) }, delay)
    }

    let addToToast = (content?: ToastContent) => {
        let toastObj = [...toastContent]
        content && toastObj.push(content);
        setToastContent(toastObj);
    }
    let providerValue = {
        toastContent: toastContent,
        setToastContent: addToToast
    }
    return <ToastContext.Provider value={providerValue}>
        {children}
    </ToastContext.Provider>
};

export default ToastContext;