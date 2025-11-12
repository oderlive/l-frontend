import axios from 'axios';

// Базовая конфигурация axios с использованием BASE_URL
const BASE_URL = 'https://ваш-базовый-URL'; // замените на актуальный URL
const api = axios.create({
    baseURL: `${BASE_URL}/users`, // используем указанный путь
    timeout: 10000,
});

// Функция для получения информации об учреждении пользователя
export const getUserInstitution = async (userId) => {
    try {
        const response = await api.get('/institution', {
            params: { user_id: userId }, // передаём user_id как параметр запроса (query)
        });
        return response.data; // возвращаем данные из ответа
    } catch (error) {
        throw new Error(`Ошибка при получении данных об учреждении: ${error.message}`);
    }
};
