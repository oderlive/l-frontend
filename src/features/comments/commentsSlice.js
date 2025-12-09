import { createSlice } from '@reduxjs/toolkit';

// Импорт асинхронных действий из comments.js
import {
    getTaskComments,
    addTaskComment,
    deleteTaskComment,
    getSolutionComments,
    addSolutionComment,
    deleteSolutionComment,
} from './comments';

const initialState = {
    taskComments: {}, // Комментарии к задачам, ключ — taskId
    solutionComments: {}, // Комментарии к решениям, ключ — solutionId
    loading: false, // Флаг загрузки
    error: null, // Сообщение об ошибке
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Получение комментариев к заданию — GET /tasks/{taskId}/comments
        builder.addCase(getTaskComments.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getTaskComments.fulfilled, (state, action) => {
            state.loading = false;
            state.taskComments[action.meta.arg] = action.payload;
        });
        builder.addCase(getTaskComments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Добавление комментария к заданию — POST /tasks/{taskId}/comments
        builder.addCase(addTaskComment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addTaskComment.fulfilled, (state, action) => {
            const { taskId } = action.meta.arg;
            if (!state.taskComments[taskId]) {
                state.taskComments[taskId] = [];
            }
            state.taskComments[taskId].push(action.payload);
            state.loading = false;
        });
        builder.addCase(addTaskComment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Удаление комментария к заданию — DELETE /tasks/{taskId}/comments/{commentId}
        builder.addCase(deleteTaskComment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteTaskComment.fulfilled, (state, action) => {
            const { taskId, commentId } = action.payload;
            state.taskComments[taskId] = state.taskComments[taskId].filter(
                (comment) => comment.id !== commentId
            );
            state.loading = false;
        });
        builder.addCase(deleteTaskComment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Получение комментариев к решению — GET /solutions/{solutionId}/comments
        builder.addCase(getSolutionComments.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getSolutionComments.fulfilled, (state, action) => {
            state.loading = false;
            state.solutionComments[action.meta.arg] = action.payload;
        });
        builder.addCase(getSolutionComments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Добавление комментария к решению — POST /solutions/{solutionId}/comments
        builder.addCase(addSolutionComment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addSolutionComment.fulfilled, (state, action) => {
            const { solutionId } = action.meta.arg;
            if (!state.solutionComments[solutionId]) {
                state.solutionComments[solutionId] = [];
            }
            state.solutionComments[solutionId].push(action.payload);
            state.loading = false;
        });
        builder.addCase(addSolutionComment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Удаление комментария к решению — DELETE /solutions/{solutionId}/comments/{commentId}
        builder.addCase(deleteSolutionComment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteSolutionComment.fulfilled, (state, action) => {
            const { solutionId, commentId } = action.payload;
            state.solutionComments[solutionId] = state.solutionComments[solutionId].filter(
                (comment) => comment.id !== commentId
            );
            state.loading = false;
        });
        builder.addCase(deleteSolutionComment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

// Экспорт селекторов
export const selectTaskComments = (state, taskId) => state.comments.taskComments[taskId] || [];
export const selectSolutionComments = (state, solutionId) => state.comments.solutionComments[solutionId] || [];
export const selectCommentsLoading = (state) => state.comments.loading;
export const selectCommentsError = (state) => state.comments.error;

// Экспорт редьюсера
export default commentsSlice.reducer;
