import { createSlice } from '@reduxjs/toolkit';
import * as solutionsActions from './solutions';

const initialState = {
    solution: null, // текущее решение (для операций GET/UPDATE/DELETE по ID)
    solutions: [], // список решений (для операций LIST)
    loading: false, // флаг загрузки
    error: null, // ошибка при выполнении операций
    reviewedSolutions: [], // проверенные решения
    unreviewedSolutions: [], // непроверенные решения
    userSolutions: [], // решения текущего пользователя
    batchSolutions: [], // пакетные решения (всех студентов)
    courseSolutions: [], // решения по курсу
};

const solutionsSlice = createSlice({
    name: 'solutions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Отзыв решения (POST /solutions/{solutionId}/revoke)
        builder
            .addCase(solutionsActions.revokeSolution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.revokeSolution.fulfilled, (state, action) => {
                state.loading = false;
                // Логика обновления состояния после отзыва решения (при необходимости)
                state.solutions = state.solutions.filter(
                    (solution) => solution.id !== action.payload.id
                );
            })
            .addCase(solutionsActions.revokeSolution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Проверка решения (POST /solutions/{solutionId}/review)
        builder
            .addCase(solutionsActions.reviewSolution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.reviewSolution.fulfilled, (state, action) => {
                state.loading = false;
                // Обновление статуса решения после проверки
                const reviewedSolution = action.payload;
                state.solutions = state.solutions.map((solution) =>
                    solution.id === reviewedSolution.id ? reviewedSolution : solution
                );
                // Перемещение решения в список проверенных
                state.reviewedSolutions.push(reviewedSolution);
            })
            .addCase(solutionsActions.reviewSolution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Добавление решения (POST /solutions/task/{taskId})
        builder
            .addCase(solutionsActions.addSolution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.addSolution.fulfilled, (state, action) => {
                state.loading = false;
                state.solution = action.payload;
                state.solutions.push(action.payload);
                state.unreviewedSolutions.push(action.payload); // новое решение по умолчанию непроверенное
            })
            .addCase(solutionsActions.addSolution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение информации о решении (GET /solutions/{solutionId})
        builder
            .addCase(solutionsActions.getSolutionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.getSolutionById.fulfilled, (state, action) => {
                state.loading = false;
                state.solution = action.payload;
            })
            .addCase(solutionsActions.getSolutionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Удаление решения (DELETE /solutions/{solutionId})
        builder
            .addCase(solutionsActions.deleteSolution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.deleteSolution.fulfilled, (state, action) => {
                state.loading = false;
                state.solutions = state.solutions.filter(
                    (solution) => solution.id !== action.payload.id
                );
                state.reviewedSolutions = state.reviewedSolutions.filter(
                    (solution) => solution.id !== action.payload.id
                );
                state.unreviewedSolutions = state.unreviewedSolutions.filter(
                    (solution) => solution.id !== action.payload.id
                );
                state.solution = null;
            })
            .addCase(solutionsActions.deleteSolution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Обновление решения (PATCH /solutions/{solutionId})
        builder
            .addCase(solutionsActions.updateSolution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.updateSolution.fulfilled, (state, action) => {
                state.loading = false;
                const updatedSolution = action.payload;
                state.solutions = state.solutions.map((solution) =>
                    solution.id === updatedSolution.id ? updatedSolution : solution
                );
                state.solution = updatedSolution;
            })
            .addCase(solutionsActions.updateSolution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение решений пользователя для задания (GET /solutions/task/{taskId}/user/{userId})
        builder
            .addCase(solutionsActions.getUserSolutionsForTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.getUserSolutionsForTask.fulfilled, (state, action) => {
                state.loading = false;
                state.userSolutions = action.payload;
            })
            .addCase(solutionsActions.getUserSolutionsForTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение решений всех студентов для задания (GET /solutions/task/{taskId}/batch)
        builder
            .addCase(solutionsActions.getBatchSolutionsForTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.getBatchSolutionsForTask.fulfilled, (state, action) => {
                state.loading = false;
                state.batchSolutions = action.payload;
            })
            .addCase(solutionsActions.getBatchSolutionsForTask.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Получение НЕПРОВЕРЕННЫХ решений для задания (GET /solutions/task/{taskId}/batch/unreviewed)
        builder
            .addCase(solutionsActions.getUnreviewedBatchSolutionsForTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.getUnreviewedBatchSolutionsForTask.fulfilled, (state, action) => {
                state.loading = false;
                state.unreviewedSolutions = action.payload;
            })
            .addCase(solutionsActions.getUnreviewedBatchSolutionsForTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение ПРОВЕРЕННЫХ решений для задания (GET /solutions/task/{taskId}/batch/reviewed)
        builder
            .addCase(solutionsActions.getReviewedBatchSolutionsForTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.getReviewedBatchSolutionsForTask.fulfilled, (state, action) => {
                state.loading = false;
                state.reviewedSolutions = action.payload;
            })
            .addCase(solutionsActions.getReviewedBatchSolutionsForTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение решений пользователя в курсе (GET /solutions/course/{courseId}/user/{userId}/batch)
        builder
            .addCase(solutionsActions.getUserSolutionsForCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.getUserSolutionsForCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.userSolutions = action.payload;
            })
            .addCase(solutionsActions.getUserSolutionsForCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение НЕПРОВЕРЕННЫХ решений пользователя в курсе (GET /solutions/course/{courseId}/user/{userId}/batch/unreviewed)
        builder
            .addCase(solutionsActions.getUnreviewedUserSolutionsForCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.getUnreviewedUserSolutionsForCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.unreviewedSolutions = action.payload;
            })
            .addCase(solutionsActions.getUnreviewedUserSolutionsForCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение ПРОВЕРЕННЫХ решений пользователя в курсе (GET /solutions/course/{courseId}/user/{userId}/batch/reviewed)
        builder
            .addCase(solutionsActions.getReviewedUserSolutionsForCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.getReviewedUserSolutionsForCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.reviewedSolutions = action.payload;
            })
            .addCase(solutionsActions.getReviewedUserSolutionsForCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение решений участников курса (GET /solutions/course/{courseId}/batch)
        builder
            .addCase(solutionsActions.getBatchSolutionsForCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.getBatchSolutionsForCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courseSolutions = action.payload;
            })
            .addCase(solutionsActions.getBatchSolutionsForCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение НЕПРОВЕРЕННЫХ решений участников курса (GET /solutions/course/{courseId}/batch/unreviewed)
        builder
            .addCase(solutionsActions.getUnreviewedBatchSolutionsForCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.getUnreviewedBatchSolutionsForCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.unreviewedSolutions = action.payload;
            })
            .addCase(solutionsActions.getUnreviewedBatchSolutionsForCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение ПРОВЕРЕННЫХ решений участников курса (GET /solutions/course/{courseId}/batch/reviewed)
        builder
            .addCase(solutionsActions.getReviewedBatchSolutionsForCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.getReviewedBatchSolutionsForCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.reviewedSolutions = action.payload;
            })
            .addCase(solutionsActions.getReviewedBatchSolutionsForCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Экспорт селекторов
export const selectSolution = (state) => state.solutions.solution;
export const selectSolutions = (state) => state.solutions.solutions;
export const selectIsLoading = (state) => state.solutions.loading;
export const selectError = (state) => state.solutions.error;
export const selectReviewedSolutions = (state) => state.solutions.reviewedSolutions;
export const selectUnreviewedSolutions = (state) => state.solutions.unreviewedSolutions;
export const selectUserSolutions = (state) => state.solutions.userSolutions;
export const selectBatchSolutions = (state) => state.solutions.batchSolutions;
export const selectCourseSolutions = (state) => state.solutions.courseSolutions;

// Экспорт редьюсера
export default solutionsSlice.reducer;
