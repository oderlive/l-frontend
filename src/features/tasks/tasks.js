import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getUserIdFromStorage = () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) throw new Error("user_id не найден в localStorage");
    return userId;
};

// Добавление задания к курсу
export const addTaskToCourse = createAsyncThunk(
    "tasks/addTaskToCourse",
    async (taskData, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                return rejectWithValue("access_token не найден в localStorage");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            const response = await axiosInstance.post(
                `${ENDPOINTS.TASKS}/${taskData.courseId}`,
                taskData.task,
                config
            );

            console.log("Задание добавлено:", response.data);
            return response.data;
        } catch (error) {
            console.error("Ошибка при добавлении задания:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение информации о задании по id
export const getTaskById = createAsyncThunk(
    "tasks/getTaskById",
    async (taskId, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                return rejectWithValue("access_token не найден в localStorage");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const response = await axiosInstance.get(
                `${ENDPOINTS.TASKS}/${taskId}`,
                config
            );

            console.log("Информация о задании:", response.data);
            return response.data;
        } catch (error) {
            console.error("Ошибка при получении информации о задании:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Удаление задания по id
export const deleteTaskById = createAsyncThunk(
    "tasks/deleteTaskById",
    async (taskId, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                return rejectWithValue("access_token не найден в localStorage");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const response = await axiosInstance.delete(
                `${ENDPOINTS.TASKS}/${taskId}`,
                config
            );

            console.log("Задание удалено:", response.data);
            return response.data;
        } catch (error) {
            console.error("Ошибка при удалении задания:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Обновление задания по id
export const updateTaskById = createAsyncThunk(
    "tasks/updateTaskById",
    async ({ taskId, updatedTaskData }, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                return rejectWithValue("access_token не найден в localStorage");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            const response = await axios.patch(
                `${ENDPOINTS.TASKS}/${taskId}`,
                updatedTaskData,
                config
            );

            console.log("Задание обновлено:", response.data);
            return response.data;
        } catch (error) {
            console.error("Ошибка при обновлении задания:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение информации о заданиях по id курса
export const getTasksByCourseId = createAsyncThunk(
    "tasks/getTasksByCourseId",
    async (courseId, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                return rejectWithValue("access_token не найден в localStorage");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const response = await axiosInstance.get(
                `${ENDPOINTS.TASKS}/course/${courseId}`,
                config
            );

            console.log("Задания по курсу:", response.data);
            return response.data;
        } catch (error) {
            console.error("Ошибка при получении заданий по курсу:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение информации о заданиях по id курса и id пользователя
export const getTasksByCourseAndUserId = createAsyncThunk(
    "tasks/getTasksByCourseAndUserId",
    async (courseId, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const userId = getUserIdFromStorage();
            if (!accessToken) {
                return rejectWithValue("access_token не найден в localStorage");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const response = await axiosInstance.get(
                `${ENDPOINTS.TASKS}/course/${courseId}/user/${userId}`,
                config
            );

            console.log("Задания по курсу и пользователю:", response.data);
            return response.data;
        } catch (error) {
            console.error("Ошибка при получении заданий по курсу и пользователю:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const downloadTaskZip = createAsyncThunk(
    "tasks/downloadTaskZip",
    async (taskId, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                return rejectWithValue("access_token не найден");
            }

            const response = await axiosInstance.get(
                `${ENDPOINTS.TASKS}/${taskId}/zip`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    responseType: "blob", // ВАЖНО
                }
            );

            return { data: response.data, taskId };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Просмотр или скачивание файла задания
export const getTaskFile = createAsyncThunk(
    "tasks/getTaskFile",
    async ({ taskId, fileId, download = false }, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                return rejectWithValue("access_token не найден");
            }

            const response = await axiosInstance.get(
                `${ENDPOINTS.TASKS}/${taskId}/files/${fileId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: { download },
                    responseType: "blob", // ВАЖНО
                }
            );

            return { data: response.data, fileId, download };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

