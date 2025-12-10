import axios from 'axios';
import store from "./store";
import {logout} from "../auth/auth";

const axiosInstance = axios.create({
    baseURL: 'http://195.43.142.64:8080/logos-lms/api/v1',
    timeout: 10000,
    withCredentials: true, // если нужны куки
});

// Перехватчик ответов: обработка 403
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // if (error.response && error.response.status === 403) {
        //     console.log('[403] Пользователь разлогинен автоматически');
        //     localStorage.removeItem('user_id');
        //     localStorage.removeItem('access_token');
        //     localStorage.removeItem('refresh_token');
        //     localStorage.removeItem('is_tfa_enabled');
        //     store.dispatch(logout());
        // }
        return Promise.reject(error);
    }
);

export default axiosInstance;
