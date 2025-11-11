import { createSlice } from '@reduxjs/toolkit';
import {
    fetchInstitutions,
    createInstitution,
} from './institutions.js';

const institutionSlice = createSlice({
    name: 'institutions',
    initialState: {
        items: [], // список учреждений
        loading: false,
        error: null,
        totalCount: 0, // можно использовать для пагинации
    },
    reducers: {
        // Можно добавить локальные редукеры, если нужно
    },
    extraReducers: (builder) => {
        builder
            // fetchInstitutions
            .addCase(fetchInstitutions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInstitutions.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || action.payload; // зависит от структуры ответа API
                state.totalCount = action.payload.totalCount || state.items.length;
            })
            .addCase(fetchInstitutions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // createInstitution
            .addCase(createInstitution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createInstitution.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload); // добавляем новое учреждение в список
                state.totalCount += 1;
            })
            .addCase(createInstitution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

    },
});

export default institutionSlice.reducer;

// Селекторы (опционально, для удобства)
export const selectInstitutions = (state) => state.institutions.items;
export const selectInstitutionsLoading = (state) => state.institutions.loading;
export const selectInstitutionsError = (state) => state.institutions.error;
export const selectInstitutionsTotalCount = (state) => state.institutions.totalCount;
