import axios from 'axios';
import { ENDPOINTS } from "../api/endpoints";

// Функция для получения user_id из localStorage
const getUserIdFromStorage = () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
        throw new Error('user_id не найден в localStorage');
    }
    return userId;
};

// Функция для получения информации об учреждении пользователя
export const getUserInstitution = async () => {
    try {
        const finalUserId = getUserIdFromStorage();

        const response = await axios.get(ENDPOINTS.USERS, {
            params: { user_id: finalUserId },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Ошибка при получении данных об учреждении: ${error.message}`);
    }
};
