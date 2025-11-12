import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice.js';
import groupReducer from '../group/groupSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        groups: groupReducer,
    },
});

export default store;
