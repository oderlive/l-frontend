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
        const config = { ...getAuthHeaders() };
        const response = await axios.post(
            ENDPOINTS.GROUP,
            {
                ...groupData,
                institution_id: institutionId,
            },
            config
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};

export const addGroupsBatch = async (groupsData) => {
    try {
        const config = { ...getAuthHeaders() };
        const response = await axios.post(
            `${ENDPOINTS.GROUP}/batch`,
                groupsData,
            config
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};

export const getGroupsByInstitution = async (institution_id) => {
    try {
        const config = {
            ...getAuthHeaders(),
            params: { institution_id },
        };
        const response = await axios.get(
            `${ENDPOINTS.GROUP}/institution`,
            config
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};

export const deleteGroup = async (group_id) => {
    try {
        const config = {
            ...getAuthHeaders(),
            params: { group_id },
        };
        const response = await axios.delete(
            `${ENDPOINTS.GROUP}/id`,
            config
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};
