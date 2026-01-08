import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as tasksActions from './tasks';

const initialState = {
    task: null, // текущее задание (для операций GET/UPDATE/DELETE по ID)
    tasks: [], // список заданий (для операций LIST)
    loading: false, // флаг загрузки
    error: null, // ошибка при выполнении операций
    fileBlob: null,       // для просмотра файла
    zipBlob: null,        // архив задания
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Добавление задания к курсу (POST /tasks/{courseId})
        builder
            .addCase(tasksActions.addTaskToCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(tasksActions.addTaskToCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.task = action.payload; // сохраняем добавленное задание
                state.tasks = [...state.tasks, action.payload]; // добавляем в список
            })
            .addCase(tasksActions.addTaskToCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение информации о задании по ID (GET /tasks/{taskId})
        builder
            .addCase(tasksActions.getTaskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(tasksActions.getTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.task = action.payload;
            })
            .addCase(tasksActions.getTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Удаление задания по ID (DELETE /tasks/{taskId})
        builder
            .addCase(tasksActions.deleteTaskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(tasksActions.deleteTaskById.fulfilled, (state, action) => {
                state.loading = false;
                // Удаляем задание из списка задач
                state.tasks = state.tasks.filter(
                    (task) => task.id !== action.payload.id
                );
                state.task = null; // сбрасываем текущее задание
            })
            .addCase(tasksActions.deleteTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Обновление задания по ID (PATCH /tasks/{taskId})
        builder
            .addCase(tasksActions.updateTaskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(tasksActions.updateTaskById.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTask = action.payload;
                // Обновляем задание в списке
                state.tasks = state.tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                );
                state.task = updatedTask;
            })
            .addCase(tasksActions.updateTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение информации о заданиях по ID курса (GET /tasks/course/{courseId})
        builder
            .addCase(tasksActions.getTasksByCourseId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(tasksActions.getTasksByCourseId.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload; // перезаписываем список задач
            })
            .addCase(tasksActions.getTasksByCourseId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение информации о заданиях по ID курса и ID пользователя
        // (GET /tasks/course/{courseId}/user/{userId})
        builder
            .addCase(tasksActions.getTasksByCourseAndUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(tasksActions.getTasksByCourseAndUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload; // перезаписываем список задач
            })
            .addCase(tasksActions.getTasksByCourseAndUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // ===== ZIP архива =====
        builder
            .addCase(tasksActions.downloadTaskZip.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(tasksActions.downloadTaskZip.fulfilled, (state, action) => {
                state.loading = false;
                state.zipBlob = action.payload.data;
            })
            .addCase(tasksActions.downloadTaskZip.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

// ===== Файл задания =====
        builder
            .addCase(tasksActions.getTaskFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(tasksActions.getTaskFile.fulfilled, (state, action) => {
                state.loading = false;
                state.fileBlob = action.payload.data;
            })
            .addCase(tasksActions.getTaskFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export const selectTask = (state) => state.tasks.task;
export const selectTasks = (state) => state.tasks.tasks;
export const selectIsLoading = (state) => state.tasks.loading;
export const selectError = (state) => state.tasks.error;
export const selectTaskFile = (state) => state.tasks.fileBlob;
export const selectTaskZip = (state) => state.tasks.zipBlob;


export default tasksSlice.reducer;
