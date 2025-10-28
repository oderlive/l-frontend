import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {ENDPOINTS} from "../api/endpoints";

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        const response = await axios.post(ENDPOINTS.LOGOUT);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const activateAccount = createAsyncThunk(
    'auth/activateAccount', // имя действия (используется в редьюсерах)
    async (activationParams) => { // activationParams — параметры для активации (например, токен)
        try {
            const response = await axios.post(ENDPOINTS.ACTIVATE_ACCOUNT, activationParams);
            return response.data; // возвращаем данные ответа (например, статус активации)
        } catch (error) {
            throw error; // передаём ошибку дальше (можно обработать в редьюсере)
        }
    }
);


export const disableTfa = createAsyncThunk(
    'auth/disableTfa', // имя действия (используется в редьюсерах)
    async (disableTfaParams) => { // disableTfaParams — параметры для отключения TFA (например, токен или ID сессии)
        try {
            const response = await axios.post(ENDPOINTS.DISABLE_TFA, disableTfaParams);
            return response.data; // возвращаем данные ответа (например, статус отключения TFA)
        } catch (error) {
            throw error; // передаём ошибку дальше (можно обработать в редьюсере)
        }
    }
);


export const enableTfa = createAsyncThunk(
    'auth/enableTfa', // имя действия (используется в редьюсерах)
    async (enableTfaParams) => { // enableTfaParams — параметры для включения TFA (например, токен или код подтверждения)
        try {
            const response = await axios.post(ENDPOINTS.ENABLE_TFA, enableTfaParams, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data; // возвращаем данные ответа (например, статус включения TFA)
        } catch (error) {
            throw error; // передаём ошибку дальше (можно обработать в редьюсере)
        }
    }
);


// Верификация 2FA кода
export const verifyTfaCode = createAsyncThunk(
    'auth/verifyTfaCode',
    async (tfaCode) => {
        try {
            const response = await axios.post(ENDPOINTS.VERIFY_TFA_CODE, { code: tfaCode });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Отправка сообщения для сброса 2FA secret
export const sendMailForTfaSecretReset = createAsyncThunk(
    'auth/sendMailForTfaSecretReset',
    async (email) => {
        try {
            const response = await axios.post(ENDPOINTS.SEND_MAIL_FOR_TFA_SECRET_RESET, { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Отправка сообщения для сброса пароля
export const sendMailForPasswordReset = createAsyncThunk(
    'auth/sendMailForPasswordReset',
    async (email) => {
        try {
            const response = await axios.post(ENDPOINTS.SEND_MAIL_FOR_PASSWORD_RESET, { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Сброс 2FA secret
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
            const response = await axios.post(ENDPOINTS.RESET_PASSWORD, passwordResetParams);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Обновление токена доступа
export const refreshAccessToken = createAsyncThunk(
    'auth/refreshAccessToken',
    async (refreshToken) => {
        try {
            const response = await axios.post(ENDPOINTS.REFRESH_ACCESS_TOKEN, { refreshToken });
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

