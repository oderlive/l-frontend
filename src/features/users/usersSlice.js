import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserInstitution } from './users';

// Асинхронное действие для получения учреждения пользователя
// Теперь не требует передачи userId — функция сама его получит
export const fetchUserInstitution = createAsyncThunk(
    'users/fetchUserInstitution',
    async (_, { rejectWithValue }) => { // _ — пустой аргумент, т.к. ID берётся изнутри
        try {
            const institution = await getUserInstitution();
            console.log('Данные об учреждении получены:', institution);
            return institution;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Инициализация начального состояния
const initialState = {
    institution: null,
    loading: false,
    error: null,
};

// Создание slice
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

export default usersSlice.reducer;
