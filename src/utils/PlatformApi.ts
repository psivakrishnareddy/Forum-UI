import axios from "axios";
import { SERVICE_BACKEND_URL} from "../constants/urlConstants"


export const getHeaders = (): any => {
    let headers, token;
    if (sessionStorage.getItem('dash_forum_token')) {
        token = JSON.parse(sessionStorage.getItem('dash_forum_token') || '');
    }
    headers = {
        'content-type': 'application/json',
        'authorization': `Bearer ${token? token : ''}`,
    };
    return headers;
};

const PlatformApi = axios.create({
    baseURL: SERVICE_BACKEND_URL,
    timeout: 20000,
});

PlatformApi.interceptors.request.use(function (config) {
    config.headers = getHeaders();    
    return config;
});

PlatformApi.interceptors.response.use(
    (response): any => {
        return {
            data: response.data,
            message: response.statusText,
            status: response.status
        }
    },
    (error) => {
        const { response } = error;
        if (response.status === 401) {
            // storage.clearToken();
        }
        return Promise.reject(error);
    }
);

export default PlatformApi;