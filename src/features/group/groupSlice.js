import { createSlice } from '@reduxjs/toolkit';
import { addGroup, addGroupsBatch, getGroupsByInstitution, deleteGroup } from './group'; // импорт функций из group.js

const initialState = {
    groups: [],
    loading: false,
    error: null,
};

const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        setGroups(state, action) {
            state.groups = action.payload;
            state.loading = false;
            state.error = null;
        },
        addGroupSuccess(state, action) {
            state.groups.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        addGroupsBatchSuccess(state, action) {
            state.groups = [...state.groups, ...action.payload];
            state.loading = false;
            state.error = null;
        },
        deleteGroupSuccess(state, action) {
            state.groups = state.groups.filter(group => group.id !== action.payload);
            state.loading = false;
            state.error = null;
        },
        setLoading(state) {
            state.loading = true;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

// Асинхронные действия (thunks)
export const fetchGroupsByInstitution = (institutionId) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const groups = await getGroupsByInstitution(institutionId);
        dispatch(setGroups(groups));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const createGroup = (institutionId, groupData) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const newGroup = await addGroup(institutionId, groupData);
        dispatch(addGroupSuccess(newGroup));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const createGroupsBatch = (institutionId, groupsData) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const newGroups = await addGroupsBatch(institutionId, groupsData);
        dispatch(addGroupsBatchSuccess(newGroups));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const removeGroup = (groupId) => async (dispatch) => {
    dispatch(setLoading());
    try {
        await deleteGroup(groupId);
        dispatch(deleteGroupSuccess(groupId));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export default groupSlice.reducer;
export const { setGroups, addGroupSuccess, addGroupsBatchSuccess, deleteGroupSuccess, setLoading, setError } = groupSlice.actions;
