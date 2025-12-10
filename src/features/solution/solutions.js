import { ENDPOINTS } from "../api/endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Отзыв решения по ID (POST /solutions/{solutionId}/revoke)
export const revokeSolution = createAsyncThunk(
    "solutions/revoke",
    async (solutionId, { rejectWithValue }) => {
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

            const response = await axios.post(
                `${ENDPOINTS.SOLUTIONS}/${solutionId}/revoke`,
                null,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Проверка решения по ID (POST /solutions/{solutionId}/review)
export const reviewSolution = createAsyncThunk(
    "solutions/review",
    async (solutionId, { rejectWithValue }) => {
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

            const response = await axios.post(
                `${ENDPOINTS.SOLUTIONS}/${solutionId}/review`,
                null,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Добавление решения к заданию (POST /solutions/task/{taskId})
export const addSolution = createAsyncThunk(
    "solutions/add",
    async ({ taskId, solutionData }, { rejectWithValue }) => {
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

            const response = await axios.post(
                `${ENDPOINTS.SOLUTIONS}/task/${taskId}`,
                solutionData,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение информации о решении по ID (GET /solutions/{solutionId})
export const getSolutionById = createAsyncThunk(
    "solutions/getById",
    async (solutionId, { rejectWithValue }) => {
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

            const response = await axios.get(
                `${ENDPOINTS.SOLUTIONS}/${solutionId}`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Удаление решения по ID (DELETE /solutions/{solutionId})
export const deleteSolution = createAsyncThunk(
    "solutions/delete",
    async (solutionId, { rejectWithValue }) => {
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

            const response = await axios.delete(
                `${ENDPOINTS.SOLUTIONS}/${solutionId}`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Обновление решения по ID (PATCH /solutions/{solutionId})
export const updateSolution = createAsyncThunk(
    "solutions/update",
    async ({ solutionId, updatedSolutionData }, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                return rejectWithValue("access_token не найден в localStorage");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            };

            const response = await axios.patch(
                `${ENDPOINTS.SOLUTIONS}/${solutionId}`,
                updatedSolutionData,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение решений пользователя для задания (GET /solutions/task/{taskId}/user/{userId})
export const getUserSolutionsForTask = createAsyncThunk(
    "solutions/getUserSolutionsForTask",
    async ({ taskId, userId }, { rejectWithValue }) => {
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

            const response = await axios.get(
                `${ENDPOINTS.SOLUTIONS}/task/${taskId}/user/${userId}`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение решений всех студентов для задания (GET /solutions/task/{taskId}/batch)
export const getBatchSolutionsForTask = createAsyncThunk(
    "solutions/getBatchSolutionsForTask",
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

            const response = await axios.get(
                `${ENDPOINTS.SOLUTIONS}/task/${taskId}/batch`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение НЕПРОВЕРЕННЫХ решений для задания (GET /solutions/task/{taskId}/batch/unreviewed)
export const getUnreviewedBatchSolutionsForTask = createAsyncThunk(
    "solutions/getUnreviewedBatchSolutionsForTask",
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

            const response = await axios.get(
                `${ENDPOINTS.SOLUTIONS}/task/${taskId}/batch/unreviewed`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение ПРОВЕРЕННЫХ решений для задания (GET /solutions/task/{taskId}/batch/reviewed)
export const getReviewedBatchSolutionsForTask = createAsyncThunk(
    "solutions/getReviewedBatchSolutionsForTask",
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

            const response = await axios.get(
                `${ENDPOINTS.SOLUTIONS}/task/${taskId}/batch/reviewed`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение решений пользователя в курсе (GET /solutions/course/{courseId}/user/{userId}/batch)
export const getUserSolutionsForCourse = createAsyncThunk(
    "solutions/getUserSolutionsForCourse",
    async ({ courseId, userId }, { rejectWithValue }) => {
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

            const response = await axios.get(
                `${ENDPOINTS.SOLUTIONS}/course/${courseId}/user/${userId}/batch`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение НЕПРОВЕРЕННЫХ решений пользователя в курсе (GET /solutions/course/{courseId}/user/{userId}/batch/unreviewed)
export const getUnreviewedUserSolutionsForCourse = createAsyncThunk(
    "solutions/getUnreviewedUserSolutionsForCourse",
    async ({ courseId, userId }, { rejectWithValue }) => {
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

            const response = await axios.get(
                `${ENDPOINTS.SOLUTIONS}/course/${courseId}/user/${userId}/batch/unreviewed`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение ПРОВЕРЕННЫХ решений пользователя в курсе (GET /solutions/course/{courseId}/user/{userId}/batch/reviewed)
export const getReviewedUserSolutionsForCourse = createAsyncThunk(
    "solutions/getReviewedUserSolutionsForCourse",
    async ({ courseId, userId }, { rejectWithValue }) => {
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

            const response = await axios.get(
                `${ENDPOINTS.SOLUTIONS}/course/${courseId}/user/${userId}/batch/reviewed`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение решений участников курса (GET /solutions/course/{courseId}/batch)
export const getBatchSolutionsForCourse = createAsyncThunk(
    "solutions/getBatchSolutionsForCourse",
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

            const response = await axios.get(
                `${ENDPOINTS.SOLUTIONS}/course/${courseId}/batch`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение НЕПРОВЕРЕННЫХ решений участников курса (GET /solutions/course/{courseId}/batch/unreviewed)
export const getUnreviewedBatchSolutionsForCourse = createAsyncThunk(
    "solutions/getUnreviewedBatchSolutionsForCourse",
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

            const response = await axios.get(
                `${ENDPOINTS.SOLUTIONS}/course/${courseId}/batch/unreviewed`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение ПРОВЕРЕННЫХ решений участников курса (GET /solutions/course/{courseId}/batch/reviewed)
export const getReviewedBatchSolutionsForCourse = createAsyncThunk(
    "solutions/getReviewedBatchSolutionsForCourse",
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

            const response = await axios.get(
                `${ENDPOINTS.SOLUTIONS}/course/${courseId}/batch/reviewed`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
