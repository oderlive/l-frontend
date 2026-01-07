// usersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    institution: null,
    users: [],
    totalUsers: 0,
    currentPage: 1,
    loading: false,
    error: null,
    searchResults: [],
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        resetUsers: (state) => {
            state.users = [];
            state.totalUsers = 0;
        }
    },
    extraReducers: (builder) => {
        // Обработчики для getUserInstitution через строковые типы
        builder
            .addCase('users/getUserInstitution/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('users/getUserInstitution/fulfilled', (state, action) => {
                state.loading = false;
                state.institution = action.payload;
            })
            .addCase('users/getUserInstitution/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // addUsersBatch
        builder
            .addCase('users/addUsersBatch/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('users/addUsersBatch/fulfilled', (state, action) => {
                state.loading = false;
                console.log('Пользователи добавлены:', action.payload);
            })
            // usersSlice.js (продолжение)
            .addCase('users/addUsersBatch/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // updateUser
        builder
            .addCase('users/updateUser/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('users/updateUser/fulfilled', (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                // Обновляем institution, если это текущий пользователь
                if (state.institution?.user?.id === action.payload.id) {
                    state.institution.user = action.payload;
                }
            })
            .addCase('users/updateUser/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // getAllUsers
        builder
            .addCase('users/getAllUsers/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('users/getAllUsers/fulfilled', (state, action) => {
                state.loading = false;
                state.users = action.payload.data || [];
                state.totalUsers = action.payload.total || 0;
                state.currentPage = action.payload.page || 1;
            })
            .addCase('users/getAllUsers/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // searchUsers
        builder
            .addCase('users/searchUsers/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('users/searchUsers/fulfilled', (state, action) => {
                console.log('1. Получен action:', action);
                console.log('2. action.payload:', action.payload);
                console.log('3. action.payload.data:', action.payload.data);

                state.loading = false;
                state.searchResults = action.payload || [];

                console.log('4. Записано в state.searchResults:', state.searchResults);
            })
            .addCase('users/searchUsers/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // deleteSearchUsers
        builder
            .addCase('users/deleteSearchUsers/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('users/deleteSearchUsers/fulfilled', (state, action) => {
                state.loading = false;
                state.searchResults = action.payload.data || [];
            })
            .addCase('users/deleteSearchUsers/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // importUsersCSVInstitution
        builder
            .addCase('users/importUsersCSVInstitution/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('users/importUsersCSVInstitution/fulfilled', (state, action) => {
                state.loading = false;
                console.log('CSV импорт выполнен:', action.payload);
            })
            .addCase('users/importUsersCSVInstitution/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // partialUpdateUser
        builder
            .addCase('users/partialUpdateUser/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('users/partialUpdateUser/fulfilled', (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = {
                        ...state.users[index],
                        ...action.payload
                    };
                }
                // Обновляем institution, если затронуты данные пользователя
                if (state.institution?.user?.id === action.payload.id) {
                    state.institution.user = {
                        ...state.institution.user,
                        ...action.payload
                    };
                }
            })
            .addCase('users/partialUpdateUser/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Селекторы
export const selectUserInstitution = (state) => state.users.institution;
export const selectAllUsers = (state) => state.users.users;
export const selectTotalUsers = (state) => state.users.totalUsers;
export const selectCurrentPage = (state) => state.users.currentPage;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectSearchResults = (state) => state.users.searchResults;

// Экспорт действий и редьюсера
export const {
    clearSearchResults,
    resetUsers
} = usersSlice.actions;

export default usersSlice.reducer;
