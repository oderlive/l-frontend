// users.js
import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from '../api/endpoints';
import { createAsyncThunk } from "@reduxjs/toolkit";

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('access_token не найден в localStorage');
    }
    return {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };
};

const getUserIdFromStorage = () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) throw new Error('user_id не найден в localStorage');
    return userId;
};

// Явные строковые типы для действий
const GET_USER_INSTITUTION_PENDING = 'users/getUserInstitution/pending';
const GET_USER_INSTITUTION_FULFILLED = 'users/getUserInstitution/fulfilled';
const GET_USER_INSTITUTION_REJECTED = 'users/getUserInstitution/rejected';

// Базовый thunk — прямой запрос к API
export const getUserInstitution = createAsyncThunk(
    'users/getUserInstitution',
    async (_, { rejectWithValue }) => {
        try {
            const userId = getUserIdFromStorage();
            const response = await axiosInstance.get(`${ENDPOINTS.USERS}/id`, {
                params: { user_id: userId },
                ...getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Обёртка‑диспетчер — для удобного вызова из компонентов
export const fetchUserInstitution = createAsyncThunk(
    'users/fetchUserInstitution',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const result = await dispatch(getUserInstitution()).unwrap();
            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Добавление пользователей пакетом
export const addUsersBatch = createAsyncThunk(
    'users/addUsersBatch',
    async (usersData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${ENDPOINTS.USERS}/batch`,
                usersData,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Обновление пользователя (полное)
export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${ENDPOINTS.USERS}/${userId}`,
                userData,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение всех пользователей с пагинацией
export const getAllUsers = createAsyncThunk(
    'users/getAllUsers',
    async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(ENDPOINTS.USERS, {
                params: { page, limit },
                ...getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Поиск пользователей по критериям
export const searchUsers = createAsyncThunk(
    'users/searchUsers',
    async (searchParams, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${ENDPOINTS.USERS}/email`, {
                params: searchParams,
                ...getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
// Поиск пользователей по критериям
export const deleteSearchUsers = createAsyncThunk(
    'users/deleteSearchUsers',
    async (searchParams, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`${ENDPOINTS.USERS}/email`, {
                params: searchParams,
                ...getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Импорт CSV для учебного заведения (PUT)
export const importUsersCSVInstitution = createAsyncThunk(
    'users/importUsersCSVInstitution',
    async ({ institutionId, csvFile }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('csv_file', csvFile);

            const response = await axiosInstance.put(
                `${ENDPOINTS.USERS}/csv/institution/${institutionId}`,
                formData,
                {
                    ...getAuthHeaders(),
                    headers: {
                        ...getAuthHeaders().headers,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Частичное обновление пользователя (PATCH)
export const partialUpdateUser = createAsyncThunk(
    'users/partialUpdateUser',
    async ({ userId, updates }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `${ENDPOINTS.USERS}/${userId}`,
                updates,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
