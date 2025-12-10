import { createSlice } from '@reduxjs/toolkit';
import * as solutionsActions from './solutions';

const initialState = {
    solution: null, // текущее решение (по ID)
    solutions: [], // все решения (например, по заданию)
    loading: false,
    error: null,
    reviewedSolutions: [], // проверенные решения
    unreviewedSolutions: [], // непроверенные решения
    userSolutions: [], // решения пользователя
    batchSolutions: [], // решения всех студентов по заданию
    courseSolutions: [], // решения по курсу
};

const solutionsSlice = createSlice({
    name: 'solutions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Отзыв решения (POST /solutions/{id}/revoke)
        builder
            .addCase(solutionsActions.revokeSolution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.revokeSolution.fulfilled, (state, action) => {
                state.loading = false;
                const id = action.payload.id;
                state.solutions = state.solutions.filter((sol) => sol.id !== id);
                state.reviewedSolutions = state.reviewedSolutions.filter((sol) => sol.id !== id);
            })
            .addCase(solutionsActions.revokeSolution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Проверка решения (POST /solutions/{id}/review)
        builder
            .addCase(solutionsActions.reviewSolution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.reviewSolution.fulfilled, (state, action) => {
                state.loading = false;
                const reviewedSol = action.payload;
                // Обновляем в общем списке
                state.solutions = state.solutions.map((sol) =>
                    sol.id === reviewedSol.id ? reviewedSol : sol
                );
                // Добавляем в проверенные, если ещё нет
                if (!state.reviewedSolutions.some((sol) => sol.id === reviewedSol.id)) {
                    state.reviewedSolutions.push(reviewedSol);
                }
                // Удаляем из непроверенных
                state.unreviewedSolutions = state.unreviewedSolutions.filter(
                    (sol) => sol.id !== reviewedSol.id
                );
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
                const newSolution = action.payload;
                state.solution = newSolution;
                state.solutions.push(newSolution);
                state.unreviewedSolutions.push(newSolution); // новое решение — непроверенное
            })
            .addCase(solutionsActions.addSolution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Получение решения по ID (GET /solutions/{id})
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

        // Удаление решения (DELETE /solutions/{id})
        builder
            .addCase(solutionsActions.deleteSolution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.deleteSolution.fulfilled, (state, action) => {
                state.loading = false;
                const id = action.payload.id || action.meta.arg; // можно передать ID через arg
                state.solutions = state.solutions.filter((sol) => sol.id !== id);
                state.reviewedSolutions = state.reviewedSolutions.filter((sol) => sol.id !== id);
                state.unreviewedSolutions = state.unreviewedSolutions.filter((sol) => sol.id !== id);
                if (state.solution?.id === id) {
                    state.solution = null;
                }
            })
            .addCase(solutionsActions.deleteSolution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Обновление решения (PATCH /solutions/{id})
        builder
            .addCase(solutionsActions.updateSolution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(solutionsActions.updateSolution.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.solution = updated;
                state.solutions = state.solutions.map((sol) => (sol.id === updated.id ? updated : sol));

                // Перемещение между списками в зависимости от isReviewed
                const wasReviewed = state.reviewedSolutions.some((sol) => sol.id === updated.id);
                const isNowReviewed = updated.isReviewed;

                if (isNowReviewed && !wasReviewed) {
                    state.reviewedSolutions.push(updated);
                    state.unreviewedSolutions = state.unreviewedSolutions.filter(
                        (sol) => sol.id !== updated.id
                    );
                } else if (!isNowReviewed && wasReviewed) {
                    state.unreviewedSolutions.push(updated);
                    state.reviewedSolutions = state.reviewedSolutions.filter(
                        (sol) => sol.id !== updated.id
                    );
                }
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

        // Получение всех решений по заданию (GET /solutions/task/{taskId}/batch)
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

        // Получение НЕПРОВЕРЕННЫХ решений по заданию (GET /solutions/task/{taskId}/batch/unreviewed)
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

        // Получение ПРОВЕРЕННЫХ решений по заданию (GET /solutions/task/{taskId}/batch/reviewed)
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

        // Получение НЕПРОВЕРЕННЫХ решений пользователя в курсе
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

        // Получение ПРОВЕРЕННЫХ решений пользователя в курсе
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

        // Получение всех решений участников курса
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

        // Получение НЕПРОВЕРЕННЫХ решений участников курса
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

        // Получение ПРОВЕРЕННЫХ решений участников курса
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

// 🔽 СЕЛЕКТОРЫ — теперь экспортируются и доступны
export const selectSolutions = (state) => state.solutions.solutions;
export const selectReviewedSolutions = (state) => state.solutions.reviewedSolutions;
export const selectUnreviewedSolutions = (state) => state.solutions.unreviewedSolutions;
export const selectUserSolutions = (state) => state.solutions.userSolutions;
export const selectBatchSolutions = (state) => state.solutions.batchSolutions;
export const selectCourseSolutions = (state) => state.solutions.courseSolutions;
export const selectCurrentSolution = (state) => state.solutions.solution;
export const selectIsLoading = (state) => state.solutions.loading;
export const selectError = (state) => state.solutions.error;

// Экспорт редьюсера по умолчанию
export default solutionsSlice.reducer;
