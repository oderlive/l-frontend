import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS } from '../api/endpoints';

// Лог аут
export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        const response = await axios.post(ENDPOINTS.LOGOUT);
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
            const response = await axios.post(ENDPOINTS.ACTIVATE_ACCOUNT, {
                user_email: activationParams.email,
                account_activation_token: activationParams.token,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Отключение TFA
export const disableTfa = createAsyncThunk(
    'auth/disableTfa',
    async (disableTfaParams) => {
        try {
            const response = await axios.post(ENDPOINTS.DISABLE_TFA, disableTfaParams);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Включение TFA
export const enableTfa = createAsyncThunk(
    'auth/enableTfa',
    async (enableTfaParams) => {
        try {
            const response = await axios.post(
                ENDPOINTS.ENABLE_TFA,
                enableTfaParams,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
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
            const response = await axios.post(ENDPOINTS.VERIFY_TFA_CODE, {
                code: tfaCode,
            });
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
            const response = await axios.post(
                ENDPOINTS.SEND_MAIL_FOR_TFA_SECRET_RESET,
                { email }
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
            const response = await axios.post(
                ENDPOINTS.SEND_MAIL_FOR_PASSWORD_RESET,
                { email }
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
            const response = await axios.post(ENDPOINTS.RESET_TFA, resetParams);
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
            const response = await axios.post(
                ENDPOINTS.RESET_PASSWORD,
                passwordResetParams
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
            const response = await axios.post(ENDPOINTS.MAKE_AUTH, authParams);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);
