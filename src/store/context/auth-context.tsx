import Auth0Lock from "auth0-lock";
import React, { ReactNode, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { IUserDetails } from "../../constants/models";
import storage from "../../utils/storage"
import { getAuth0Config } from '../../utils/config';
import { UserService } from "../../services/UserService";
import GlobalContext from "./global-context";
import { SET_LOGGED_OUT_TIMEOUT } from "../Types/GlobalTypes";

const auth0LockOptions = {
    theme: {
        logo: 'https://dashboard.sbsd.virginia.gov/assets/logo/sbsd_logo.png',
        primaryColor: '#3592E1'
    },
    allowedConnections: ['Username-Password-Authentication'],
    auth: {
        redirectUrl: `${window.location.origin}/callback`,
        responseType: 'token id_token',
        audience: getAuth0Config().audience,
        redirect: true,
        params: {
            scope: 'full_scope openid profile email roles'
        }
    },
    languageDictionary: {
        title: 'SBSD',
        error: {
            login: {
                blocked_user: 'Your account is disabled. Please contact the administrator.'
            }
        },
        forgotPasswordAction: "Reset your password?",
    },
    closable: false,
    rememberLastLogin: false,
    allowSignUp: false,
    autoclose: true,
    oidcConformant: true
};

const retriveStoredToken = () => {
    let storedToken = storage.getToken() || '';
    if(storedToken) {
        let expSeconds = JSON.parse(atob((storedToken as string).split('.')[1]))?.exp;
        let expirationCheckDate = new Date(0);
        expirationCheckDate.setSeconds(expirationCheckDate.getSeconds() + expSeconds);
        if(storedToken && (new Date()) > expirationCheckDate) {
            storedToken = '';
            storage.clearToken();
        } 
    }
    //write expiration logic
    return storedToken;
}
const AuthContext = React.createContext({
    token: '',
    userDetails: {} as IUserDetails,
    isAuthenticated: retriveStoredToken() ? true : false,
    login: () => { },
    logout: () => { },
    timeout: () => {}
})

const auth0Lock = new Auth0Lock(
    getAuth0Config().clientId,
    getAuth0Config().domain,
    auth0LockOptions
);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(retriveStoredToken() ? true : false);
    const navigate = useNavigate();
    const tokenData = retriveStoredToken();
    var tokenTimer: NodeJS.Timer | null = null;

    let initialToken;
    if (tokenData) {
        initialToken = tokenData;
    }  
    const {dispatch } = React.useContext(GlobalContext);
    const [token, settoken] = useState(initialToken);
    const [userDetails, setUserDetails] = useState<IUserDetails>();
    useEffect(() => {        
        if (isAuthenticated) {
            if(!userDetails)
            {
                setUserDetails(storage.getUser());
            }
            else 
            {
                UserService.getUser().then((user: IUserDetails) => {
                    storage.setUser(user);
                })
                if(storage.getUser().agency.length !== userDetails.agency.length || (JSON.stringify(storage.getUser().user) !== JSON.stringify(userDetails.user)))   
                {
                    setUserDetails(storage.getUser());
                }
            }
        }
    }, [isAuthenticated, userDetails])

    useEffect(() => {
        if(tokenData) {
            let expSeconds = JSON.parse(atob((tokenData as string).split('.')[1]))?.exp;
            let expirationCheckDate = new Date(0);
            expirationCheckDate.setSeconds(expirationCheckDate.getSeconds() + expSeconds);
            let timeDiff =  expirationCheckDate.valueOf() - (new Date()).valueOf();
            timeDiff > 0 && updateToken(Math.floor(timeDiff/1000));
        }
    }, []);

    //for logging out and showing session expired popup
    const timeoutHandler = () => {
        dispatch({ type: SET_LOGGED_OUT_TIMEOUT, payload: true })
        settoken(null);
        storage.clearToken();
        storage.clearUser();
        setIsAuthenticated(false);
    }

    const logoutHandler = useCallback(() => {
        settoken(null);
        storage.clearToken();
        storage.clearUser();
        setIsAuthenticated(false);
        auth0Lock.logout({ returnTo: window.location.origin });
    }, []);

    const loginHandler = () => {
        auth0Lock.show({
            allowedConnections: ['Username-Password-Authentication'],
            allowSignUp: false,
        });
    }

    const updateToken = (expirationTime: number) => {
        tokenTimer && clearInterval(tokenTimer);
        tokenTimer = setInterval(() => {
            auth0Lock.checkSession({}, function (error, authResult) {
                if (error || !authResult) {
                    loginHandler();
                } else {
                    settoken(authResult.accessToken);
                    storage.setToken(authResult.accessToken);
                    updateToken(authResult.expiresIn);
                }
              });
        }, expirationTime * 1000);
    }
    auth0Lock.on('authorization_error', error => {
        let errorDescription = error.errorDescription || '';
        if(errorDescription == 'Unable to configure verification page.') {
            errorDescription += `\n Please enable third-party cookies in browser and try again.`
        }
        navigate("/login");
        auth0Lock.show({
            flashMessage: {
                type: 'error',
                text: errorDescription
            }
        });
        setIsAuthenticated(false);
    });
    auth0Lock.on("authenticated", (authResult: any) => {
        setIsAuthenticated(authResult.accessToken ? true : false);
        settoken(authResult.accessToken);
        storage.setToken(authResult.accessToken);
        updateToken(authResult.expiresIn);
        UserService.getUser().then((user: IUserDetails) => {
            setUserDetails(user);
            storage.setUser(user);
        }).finally(() => {
            navigate("/forum");
        });
    });

    const AuthContextValue = {
        token: token,
        isAuthenticated: isAuthenticated,
        userDetails: userDetails!,
        login: loginHandler,
        logout: logoutHandler,
        timeout: timeoutHandler
    };

    return <AuthContext.Provider value={AuthContextValue}>
        {children}
    </AuthContext.Provider>
}

export default AuthContext;