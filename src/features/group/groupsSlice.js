import { createSlice } from '@reduxjs/toolkit';
import {
    addGroup,
    addGroupsBatch,
    getGroupsByInstitution,
    deleteGroup
} from './groups';

const initialState = {
    groups: [],
    loading: false,
    error: null,
};

const groupsSlice = createSlice({
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
            state.groups = state.groups.filter(g => g.id !== action.payload);
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

// ---- THUNKS ----

export const fetchGroupsByInstitution = (institutionId) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const groups = await getGroupsByInstitution(institutionId);

        // 🔥 ДОБАВЛЕНИЕ ПОЛЯ institution_id
        const fixedGroups = groups.map(g => ({
            ...g,
            institution_id: institutionId,
        }));

        dispatch(setGroups(fixedGroups));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const createGroup = (institutionId, groupData) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const newGroup = await addGroup(institutionId, groupData);

        dispatch(addGroupSuccess({
            ...newGroup,
            institution_id: institutionId,
        }));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const createGroupsBatch = (institutionId, groupsData) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const newGroups = await addGroupsBatch(institutionId, groupsData);

        dispatch(addGroupsBatchSuccess(
            newGroups.map(g => ({
                ...g,
                institution_id: institutionId,
            }))
        ));
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

export default groupsSlice.reducer;

export const {
    setGroups,
    addGroupSuccess,
    addGroupsBatchSuccess,
    deleteGroupSuccess,
    setLoading,
    setError
} = groupsSlice.actions;
