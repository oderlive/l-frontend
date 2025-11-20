import { createSlice } from '@reduxjs/toolkit';
import {addCourseByGroupIds, getCoursesByUser} from './course';

// Инициалиальное состояние слайса
const initialState = {
    courses: [],
    loading: false,
    error: null,
};

// Создание слайса для курсов
const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setCourses(state, action) {
            state.courses = action.payload;
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

// Thunk для получения курсов пользователя
export const fetchCoursesByUser = () => async (dispatch) => {
    dispatch(setLoading());
    try {
        const courses = await getCoursesByUser();

        // Отправляем данные в store
        dispatch(setCourses(courses));

        // Возвращаем результат для await dispatch()
        return {
            meta: { requestStatus: 'fulfilled' },
            payload: courses,
        };
    } catch (error) {
        dispatch(setError(error.message));

        // Возвращаем ошибку для await dispatch()
        return {
            meta: { requestStatus: 'rejected' },
            error: error.message,
            payload: [],
        };
    }
};

export const addCourseByGroupIdsThunk = (name, groupIdList) => async (dispatch) => {
    dispatch(setLoading()); // Устанавливаем состояние загрузки
    try {
        const response = await addCourseByGroupIds(name, groupIdList); // Вызываем API

        // Логика после успешного добавления курса (например, обновление списка курсов)
        const courses = await getCoursesByUser(); // Перезагружаем список курсов
        dispatch(setCourses(courses));

        return {
            meta: { requestStatus: 'fulfilled' },
            payload: response,
        };
    } catch (error) {
        dispatch(setError(error.message));
        return {
            meta: { requestStatus: 'rejected' },
            error: error.message,
            payload: [],
        };
    }
};


// Экспорт редьюсеров и редуктора слайса
export const {
    setCourses,
    setLoading,
    setError,
} = coursesSlice.actions;

export default coursesSlice.reducer;
