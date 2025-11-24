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

export const fetchCoursesByUser = () => async (dispatch) => {
    dispatch(setLoading());
    try {
        const courses = await getCoursesByUser(); // Вызов API
        dispatch(setCourses(courses));
        return { meta: { requestStatus: 'fulfilled' }, payload: courses };
    } catch (error) {
        dispatch(setError(error.message));
        return { meta: { requestStatus: 'rejected' }, error: error.message, payload: [] };
    }
};

export const addCourseByGroupIdsThunk = (name, groupIdList) => async (dispatch) => {
    dispatch(setLoading());
    try {
        await addCourseByGroupIds(name, groupIdList);

        const updatedCourses = await getCoursesByUser(); // Перезагрузка через API
        dispatch(setCourses(updatedCourses));

        return { meta: { requestStatus: 'fulfilled' }, payload: updatedCourses };
    } catch (error) {
        dispatch(setError(error.message));
        return { meta: { requestStatus: 'rejected' }, error: error.message, payload: [] };
    }
};



// Экспорт редьюсеров и редуктора слайса
export const {
    setCourses,
    setLoading,
    setError,
} = coursesSlice.actions;

export default coursesSlice.reducer;
