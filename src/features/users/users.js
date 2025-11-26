// users.js
import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from '../api/endpoints';
import {createAsyncThunk} from "@reduxjs/toolkit";


const getUserIdFromStorage = () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) throw new Error('user_id не найден в localStorage');
    return userId;
};

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

            const response = await axiosInstance.get(url, {
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
