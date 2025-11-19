import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice.js';
import groupReducer from '../group/groupsSlice.js';
import institutionsReducer from '../institutions/institutionsSlice.js';

// Функция для загрузки начального состояния из localStorage
const loadState = () => {
    try {
        const user_id = localStorage.getItem('user_id');
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');
        const is_tfa_enabled = localStorage.getItem('is_tfa_enabled');

        if (user_id) {
            return {
                auth: {
                    isLoggedIn: true,
                    user_id,
                    access_token,
                    refresh_token,
                    is_tfa_enabled: is_tfa_enabled === 'true',
                    loading: false,
                    error: null,
                },
            };
        }
    } catch (err) {
        console.error('Ошибка при загрузке состояния из localStorage:', err);
    }
    return undefined; // Если данных нет — используем initialState из slice
};

const store = configureStore({
    reducer: {
        auth: authReducer,
        groups: groupReducer,
        institution: institutionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
            immutableCheck: false,
            serializableCheck: false,
        }),
    preloadedState: loadState(), // Подгружаем состояние при старте
});

export default store;
