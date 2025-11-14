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

export const addGroup = async (institutionId, groupData) => {
    try {
        const config = {
            ...getAuthHeaders(),
            params: { institutionId },
        };
        const response = await axios.post(
            ENDPOINTS.GROUP,
            {
                ...groupData,
            },
            config
        );
        console.log('[addGroup] Группа добавлена:', response.data);
        return response.data;
    } catch (error) {
        console.error('[addGroup] Ошибка при добавлении группы:', error);
        throw error.response?.data || error.message || error;
    }
};

export const addGroupsBatch = async (institutionId, groupsData) => {
    try {
        const config = {
            ...getAuthHeaders(),
            params: { institutionId },
        };
        const response = await axios.post(
            `${ENDPOINTS.GROUP}/batch`,
            {
                groups: groupsData,
            },
            config
        );
        console.log('[addGroupsBatch] Группы добавлены:', response.data);
        return response.data;
    } catch (error) {
        console.error('[addGroupsBatch] Ошибка при массовом добавлении групп:', error);
        throw error.response?.data || error.message || error;
    }
};

export const getGroupsByInstitution = async (institutionId) => {
    try {
        const config = {
            ...getAuthHeaders(),
            params: { institutionId },
        };
        const response = await axios.get(
            `${ENDPOINTS.GROUP}/institution`,
            config
        );
        console.log('[getGroupsByInstitution] Группы получены:', response.data);
        return response.data;
    } catch (error) {
        console.error('[getGroupsByInstitution] Ошибка при получении групп:', error);
        throw error.response?.data || error.message || error;
    }
};

export const deleteGroup = async (groupId) => {
    try {
        const config = {
            ...getAuthHeaders(),
            params: { groupId },
        };
        const response = await axios.delete(
            `${ENDPOINTS.GROUP}/groups/id`,
            config
        );
        console.log('[deleteGroup] Группа удалена:', groupId);
        return response.data;
    } catch (error) {
        console.error('[deleteGroup] Ошибка при удалении группы:', error);
        throw error.response?.data || error.message || error;
    }
};
