import { createSlice } from '@reduxjs/toolkit';
import {
    logout,
    makeAuth,
    refreshAccessToken,
    enableTfa,
    disableTfa,
    verifyTfaCode,
    resetTfa,
    resetPassword
} from './auth.js';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        user: null,
        user_id: null,
        access_token: null,
        refresh_token: null,
        is_tfa_enabled: false,
        loading: false,
        error: null,
    },
    reducers: {
        // Дополнительный редьюсер для ручного обновления состояния (опционально)
        updateAuthState: (state, action) => {
            Object.assign(state, action.payload);
        },

        // Редьюсер для очистки ошибок
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Обработка makeAuth (авторизация)
            .addCase(makeAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(makeAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.user = action.payload.user || null;
                state.user_id = action.payload.user_id;
                state.access_token = action.payload.access_token;
                state.refresh_token = action.payload.refresh_token;
                state.is_tfa_enabled = action.payload.is_tfa_enabled;

                // Сохраняем в localStorage
                localStorage.setItem('user_id', action.payload.user_id);
                localStorage.setItem('access_token', action.payload.access_token);
                localStorage.setItem('refresh_token', action.payload.refresh_token);
                localStorage.setItem('is_tfa_enabled', String(action.payload.is_tfa_enabled));
            })
            .addCase(makeAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Обработка logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.user = null;
                state.user_id = null;
                state.access_token = null;
                state.refresh_token = null;
                state.is_tfa_enabled = false;

                // Очищаем localStorage
                localStorage.removeItem('user_id');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('is_tfa_enabled');
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.error = action.error.message;
            })

            // Обработка refreshAccessToken
            .addCase(refreshAccessToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.loading = false;
                state.access_token = action.payload.access_token;

                // Обновляем в localStorage
                localStorage.setItem('access_token', action.payload.access_token);
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Обработка enableTfa
            .addCase(enableTfa.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(enableTfa.fulfilled, (state, action) => {
                state.loading = false;
                state.is_tfa_enabled = true;

                // Обновляем в localStorage
                localStorage.setItem('is_tfa_enabled', 'true');
            })
            .addCase(enableTfa.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Обработка disableTfa
            .addCase(disableTfa.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(disableTfa.fulfilled, (state) => {
                state.loading = false;
                state.is_tfa_enabled = false;

                // Обновляем в localStorage
                localStorage.setItem('is_tfa_enabled', 'false');
            })
            .addCase(disableTfa.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Обработка verifyTfaCode
            .addCase(verifyTfaCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyTfaCode.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verifyTfaCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Обработка resetTfa
            .addCase(resetTfa.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetTfa.fulfilled, (state) => {
                state.loading = false;
                state.is_tfa_enabled = false;

                // Обновляем в localStorage
                localStorage.setItem('is_tfa_enabled', 'false');
            })
            .addCase(resetTfa.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Обработка resetPassword
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Экспортируем редьюсеры
export const { updateAuthState, clearError } = authSlice.actions;

// Экспортируем редуктор
export default authSlice.reducer;
