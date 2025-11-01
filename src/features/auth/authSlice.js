import { createSlice } from '@reduxjs/toolkit';
import { logout, makeAuth } from './auth.js'; // Импортируем makeAuth для обработки

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
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Обработчик для makeAuth
            .addCase(makeAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(makeAuth.fulfilled, (state, action) => {
                state.loading = false;

                // Сохраняем данные в state
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

            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
                state.user_id = null;
                state.access_token = null;
                state.refresh_token = null;
                state.is_tfa_enabled = false;

                localStorage.removeItem('user_id');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('is_tfa_enabled');
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default authSlice.reducer;
