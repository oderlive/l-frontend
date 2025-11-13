import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS } from '../api/endpoints';

// Получение списка учебных заведений
export const fetchInstitutions = createAsyncThunk(
    '/institutions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(ENDPOINTS.INSTITUTIONS);
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Создание нового учебного заведения
export const createInstitution = createAsyncThunk(
    '/institutions',
    async (institutionData, { rejectWithValue }) => {
        try {
            const response = await axios.post(ENDPOINTS.INSTITUTIONS, institutionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);