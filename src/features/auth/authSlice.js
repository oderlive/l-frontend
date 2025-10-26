import { createSlice } from '@reduxjs/toolkit';
import { logout } from './auth.js';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        user: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(logout.pending, (state) => {
                // Обработка состояния ожидания
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(logout.rejected, (state, action) => {
                // Обработка ошибок
            });
    },
});

export default authSlice.reducer;
