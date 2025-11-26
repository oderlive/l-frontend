import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS } from '../api/endpoints';

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('Access token not found');
    }
    return {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };
};

// Получение user_id из localStorage
const getUserIdFromStorage = () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) throw new Error('user_id не найден в localStorage');
    return userId;
};

// Лог аут
export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        const config = getAuthHeaders(); // Добавляем заголовки с токеном
        const response = await axios.post(ENDPOINTS.LOGOUT, {}, config);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// Активация аккаунта
export const activateAccount = createAsyncThunk(
    'auth/activateAccount',
    async (activationParams) => {
        try {
            const config = getAuthHeaders(); // Добавляем заголовки с токеном
            const response = await axios.post(
                ENDPOINTS.ACTIVATE_ACCOUNT,
                {
                    user_email: activationParams.email,
                    account_activation_token: activationParams.token,
                },
                config
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Отключение TFA
export const disableTfa = createAsyncThunk(
    'auth/disableTfa',
    async (disableTfaParams, { rejectWithValue }) => {
        try {
            const config = getAuthHeaders(); // Добавляем заголовки с токеном

            const response = await axios.post(
                ENDPOINTS.DISABLE_TFA,
                disableTfaParams,
                config
            );

            return response.data;
        } catch (error) {
            console.error('Ошибка при отключении 2FA:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// Включение TFA
export const enableTfa = createAsyncThunk(
    'auth/enableTfa',
    async (enableTfaParams) => {
        try {
            const config = getAuthHeaders();

            const requestBody = {
                ...enableTfaParams,
                email: enableTfaParams.email,
                password: enableTfaParams.password
            };

            const response = await axios.post(
                ENDPOINTS.ENABLE_TFA,
                requestBody,
                config
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    }
);


// Верификация TFA кода
export const verifyTfaCode = createAsyncThunk(
    'auth/verifyTfaCode',
    async (tfaCode) => {
        try {
            const config = getAuthHeaders(); // Добавляем заголовки с токеном
            const response = await axios.post(
                ENDPOINTS.VERIFY_TFA_CODE,
                { code: tfaCode },
                config
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Отправка письма для сброса TFA secret
export const sendMailForTfaSecretReset = createAsyncThunk(
    'auth/sendMailForTfaSecretReset',
    async (email) => {
        try {
            const config = getAuthHeaders(); // Добавляем заголовки с токеном
            const response = await axios.post(
                ENDPOINTS.SEND_MAIL_FOR_TFA_SECRET_RESET,
                { email },
                config
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Отправка письма для сброса пароля
export const sendMailForPasswordReset = createAsyncThunk(
    'auth/sendMailForPasswordReset',
    async (email) => {
        try {
            const config = getAuthHeaders(); // Добавляем заголовки с токеном
            const response = await axios.post(
                ENDPOINTS.SEND_MAIL_FOR_PASSWORD_RESET,
                { email },
                config
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Сброс TFA
export const resetTfa = createAsyncThunk(
    'auth/resetTfa',
    async (resetParams) => {
        try {
            const config = getAuthHeaders(); // Добавляем заголовки с токеном
            const response = await axios.post(
                ENDPOINTS.RESET_TFA,
                resetParams,
                config
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Сброс пароля
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (passwordResetParams) => {
        try {
            const config = getAuthHeaders(); // Добавляем заголовки с токеном
            const response = await axios.post(
                ENDPOINTS.RESET_PASSWORD,
                passwordResetParams,
                config
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Получение refresh_token из localStorage
const getRefreshToken = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error('refresh_token не найден в localStorage');
    }
    return refreshToken;
};

// Обновление access_token
export const refreshAccessToken = createAsyncThunk(
    'auth/refreshAccessToken',
    async () => {
        const refresh_token = getRefreshToken();
        try {
            // Для refresh обычно не нужен access_token, поэтому оставляем как есть
            const response = await axios.post(ENDPOINTS.REFRESH_ACCESS_TOKEN, {
                refresh_token,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Аутентификация пользователя
export const makeAuth = createAsyncThunk(
    'auth/makeAuth',
    async (authParams) => {
        try {
            // Для логина access_token не нужен, оставляем без изменений
            const response = await axios.post(ENDPOINTS.MAKE_AUTH, authParams);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);
