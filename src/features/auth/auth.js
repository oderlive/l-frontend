import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../baseApi'

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        const response = await axios.post(`http://195.43.142.64:8080/logos-lms/api/v1/auth/logout`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const login = createAsyncThunk('auth/login', async (credentials) => {
    try {
        const response = await axios.post('/api/login', credentials);
        return response.data.user;
    } catch (error) {
        throw error;
    }
});

export const register = createAsyncThunk('auth/register', async (userData) => {
    try {
        const response = await axios.post('/api/register', userData);
        return response.data.user;
    } catch (error) {
        throw error;
    }
});
