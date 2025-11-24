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
