import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserInstitution } from './users'; // импортируем функцию из users.js

// Асинхронное действие для получения учреждения пользователя
export const fetchUserInstitution = createAsyncThunk(
    'users/fetchUserInstitution',
    async (userId, { rejectWithValue }) => {
        try {
            const institution = await getUserInstitution(userId);
            return institution;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

// Инициализация начального состояния
const initialState = {
    institution: null,    // данные об учреждении
    loading: false,       // флаг загрузки
    error: null,          // сообщение об ошибке
};

// Создание slice с помощью createSlice
const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInstitution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserInstitution.fulfilled, (state, action) => {
                state.loading = false;
                state.institution = action.payload;
            })
            .addCase(fetchUserInstitution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { } = usersSlice.actions;
export default usersSlice.reducer;
