import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Функция для получения user_id из localStorage
const getUserIdFromStorage = () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) throw new Error("user_id не найден в localStorage");
    return userId;
};

// Получение комментариев к заданию
export const getTaskComments = createAsyncThunk(
    "comments/getTaskComments",
    async (taskId, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` },
            };
            const response = await axiosInstance.get(
                `${ENDPOINTS.COMMENTS}/tasks/${taskId}/comments`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Добавление комментария к заданию
export const addTaskComment = createAsyncThunk(
    "comments/addTaskComment",
    async ({ taskId, commentData }, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await axiosInstance.post(
                `${ENDPOINTS.COMMENTS}/tasks/${taskId}/comments`,
                commentData,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Удаление комментария к заданию
export const deleteTaskComment = createAsyncThunk(
    "comments/deleteTaskComment",
    async ({ taskId, commentId }, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` },
            };
            await axiosInstance.delete(
                `${ENDPOINTS.COMMENTS}/tasks/${taskId}/comments/${commentId}`,
                config
            );
            return { taskId, commentId };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение комментариев к решению
export const getSolutionComments = createAsyncThunk(
    "comments/getSolutionComments",
    async (solutionId, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` },
            };
            const response = await axiosInstance.get(
                `${ENDPOINTS.COMMENTS}/solutions/${solutionId}/comments`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Добавление комментария к решению
export const addSolutionComment = createAsyncThunk(
    "comments/addSolutionComment",
    async ({ solutionId, commentData }, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await axiosInstance.post(
                `${ENDPOINTS.COMMENTS}/solutions/${solutionId}/comments`,
                commentData,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Удаление комментария к решению
export const deleteSolutionComment = createAsyncThunk(
    "comments/deleteSolutionComment",
    async ({ solutionId, commentId }, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` },
            };
            await axiosInstance.delete(
                `${ENDPOINTS.COMMENTS}/solutions/${solutionId}/comments/${commentId}`,
                config
            );
            return { solutionId, commentId };
        } catch( error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
