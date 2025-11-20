import axios from 'axios';
import { ENDPOINTS } from '../api/endpoints';
import { createAsyncThunk } from "@reduxjs/toolkit";

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

// Thunk для получения информации об учреждении пользователя
export const getUserInstitution = createAsyncThunk(
    'users/getUserInstitution',
    async (_, { rejectWithValue }) => {
        try {
            const userId = getUserIdFromStorage();
            console.log('Получен user_id из localStorage:', userId);

            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                return rejectWithValue('access_token не найден в localStorage');
            }

            const url = `${ENDPOINTS.USERS}/id`;

            const response = await axios.get(url, {
                params: { user_id: userId },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Ответ от API:', response.data);
            return response.data;

        } catch (error) {
            console.error('Ошибка при запросе к API:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addUsersBatch = createAsyncThunk(
    'users/addUsersBatch',
    async (usersData, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                return rejectWithValue('access_token не найден в localStorage');
            }
            const config = { ...getAuthHeaders() };

            const response = await axios.post(
                `${ENDPOINTS.USERS}/batch`, // URL эндпоинта
                usersData, // Массив объектов пользователей (request body)
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
