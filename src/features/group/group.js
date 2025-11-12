import axios from 'axios';
import {BASE_URL} from "../api/endpoints";

const GROUP_API = `${BASE_URL}/groups`;

export const addGroup = async (institutionId, groupData) => {
    try {
        const response = await axios.post(`${GROUP_API}`, {
            ...groupData,
            institutionId,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addGroupsBatch = async (institutionId, groupsData) => {
    try {
        const response = await axios.post(`${GROUP_API}/batch`, {
            institutionId,
            groups: groupsData,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getGroupsByInstitution = async (institutionId) => {
    try {
        const response = await axios.get(`${GROUP_API}/institution/${institutionId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteGroup = async (groupId) => {
    try {
        const response = await axios.delete(`${GROUP_API}/${groupId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
