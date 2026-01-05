import axios from 'axios';
import { ENDPOINTS } from '../api/endpoints';

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

// Функция для получения списка курсов пользователя по его ID
export const getCoursesByUser = async () => {
    try {
        const userId = localStorage.getItem('user_id');
        const config = {
            ...getAuthHeaders(),
            params: {
                userId: userId
            }
        };
        const response = await axios.get(
            `${ENDPOINTS.COURSES}/user/${userId}`,
            config
        );
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};


// Функция для добавления курса по списку ID учебных групп
export const addCourseByGroupIds = async (name, groupIdList) => {
    try {
        const config = { ...getAuthHeaders() }; // Используем заголовки с токеном
        const response = await axios.post(
            `${ENDPOINTS.COURSES}/group-id-list`,
            {
                name,
                group_id_list: groupIdList, // Массив ID групп
            },
            config
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};

export const deleteCourseById = async (courseId) => {
    try {
        const config = { ...getAuthHeaders() };
        const response = await axios.delete(
            `${ENDPOINTS.COURSES}/${courseId}`,
            config
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};

export const addUserToCourse = async (courseId, userId) => {
    try {
        const config = { ...getAuthHeaders() };
        const response = await axios.patch(
            `${ENDPOINTS.COURSES}/${courseId}/add-users/user-id-list`,
            [userId] , // Передаем ID пользователя
            config
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};

export const addUsersToCourseByIdList = async (courseId, groupIdList) => {
    try {
        const config = { ...getAuthHeaders() }; // Используем заголовки с токеном
        const response = await axios.patch(
            `${ENDPOINTS.COURSES}/${courseId}/add-users/group-id-list`,
            groupIdList , // Передаем массив ID групп
            config
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};

export const getCourseById = async (courseId) => {
    try {
        const config = { ...getAuthHeaders() }; // Используем заголовки с токеном
        const response = await axios.get(
            `${ENDPOINTS.COURSES}/${courseId}`,
            config
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};
