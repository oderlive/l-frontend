import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS } from '../api/endpoints';

// Получение списка учебных заведений
export const fetchInstitutions = createAsyncThunk(
    'institutions/fetchInstitutions',
    async (institutionId, { rejectWithValue }) => {
        try {
            console.log('[fetchInstitutions] Получен institutionId:', institutionId);
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get(`${ENDPOINTS.INSTITUTIONS}/${institutionId}`, {
                params: { institution_id: institutionId },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('[fetchInstitutions] Ответ от API:', response.data);
            return response.data;
        } catch (error) {
            console.error('[fetchInstitutions] Ошибка запроса:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createInstitution = createAsyncThunk(
    '/institutions',
    async (institutionData, { rejectWithValue }) => {
        try {
            // Получаем токен из localStorage
            const accessToken = localStorage.getItem('access_token');

            // Проверяем, что токен существует
            if (!accessToken) {
                return rejectWithValue('Access token not found');
            }

            // Отправляем запрос с заголовком Authorization
            const response = await axios.post(
                ENDPOINTS.INSTITUTIONS,
                institutionData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
