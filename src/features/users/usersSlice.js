// usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS } from '../api/endpoints';
import { getUserInstitution } from './users'; // оставляем только getUserInstitution

// Переносим addUsersBatch сюда
export const addUsersBatch = createAsyncThunk(
    'users/addUsersBatch',
    async (usersData, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                return rejectWithValue('access_token не найден в localStorage');
            }

            const getAuthHeaders = () => ({
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const config = getAuthHeaders();

            const response = await axios.post(
                `${ENDPOINTS.USERS}/batch`,
                usersData,
                config
            );

            console.log('Ответ от API (добавление пользователей):', response.data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при добавлении пользователей:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchUserInstitution = createAsyncThunk(
    'users/fetchUserInstitution',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            // Вызываем getUserInstitution через dispatch
            const institution = await dispatch(getUserInstitution()).unwrap();
            console.log('Данные об учреждении:', institution);
            return institution;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const initialState = {
    institution: null,
    loading: false,
    error: null,
};

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
            })
            // Теперь addUsersBatch гарантированно инициализирован
            .addCase(addUsersBatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUsersBatch.fulfilled, (state, action) => {
                state.loading = false;
                console.log('Пользователи добавлены:', action.payload);
            })
            .addCase(addUsersBatch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error('Ошибка при добавлении пользователей:', action.payload);
            });
    },
});

export const selectUserInstitution = (state) => state.users.institution;
export default usersSlice.reducer;
