import { createSlice } from '@reduxjs/toolkit';
import {
    addCourseByGroupIds,
    addUsersToCourseByGroupIdList,
    addUsersToCourseByIdList,
    deleteCourseById,
    getCourseById,
    getCoursesByUser,
    addUserToCourse // Добавляем импорт
} from './courses';


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
        // Дополнительный редуктор для обновления одного курса
        updateCourse(state, action) {
            const index = state.courses.findIndex(course => course.id === action.payload.id);
            if (index !== -1) {
                state.courses[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        }
    },
});

// Thunk для получения списка курсов пользователя
export const fetchCoursesByUser = () => async (dispatch) => {
    dispatch(setLoading());
    try {
        const courses = await getCoursesByUser();
        dispatch(setCourses(courses));
        return { meta: { requestStatus: 'fulfilled' }, payload: courses };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        dispatch(setError(errorMessage));
        return { meta: { requestStatus: 'rejected' }, error: errorMessage, payload: [] };
    }
};

// Thunk для добавления курса по списку групп
export const addCourseByGroupIdsThunk = (name, groupIdList) => async (dispatch) => {
    dispatch(setLoading());
    try {
        await addCourseByGroupIds(name, groupIdList);
        // Перезагружаем список курсов
        const updatedCourses = await getCoursesByUser();
        dispatch(setCourses(updatedCourses));
        return { meta: { requestStatus: 'fulfilled' }, payload: updatedCourses };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        dispatch(setError(errorMessage));
        return { meta: { requestStatus: 'rejected' }, error: errorMessage, payload: [] };
    }
};

// Thunk для удаления курса
export const deleteCourseByIdThunk = (courseId) => async (dispatch) => {
    dispatch(setLoading());
    try {
        await deleteCourseById(courseId);
        // Перезагружаем список курсов
        const updatedCourses = await getCoursesByUser();
        dispatch(setCourses(updatedCourses));
        return {
            meta: { requestStatus: 'fulfilled' },
            payload: updatedCourses
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        dispatch(setError(errorMessage));
        return {
            meta: { requestStatus: 'rejected' },
            error: errorMessage,
            payload: []
        };
    }
};

// Thunk для получения курса по ID (с сохранением в состояние)
export const fetchCourseById = (courseId) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const course = await getCourseById(courseId);
        // Сохраняем курс в состояние (если нужно)
        // dispatch(updateCourse(course)); // Если хотите обновлять конкретный курс в списке
        return {
            meta: { requestStatus: 'fulfilled' },
            payload: course
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        dispatch(setError(errorMessage));
        return {
            meta: { requestStatus: 'rejected' },
            error: errorMessage,
            payload: null
        };
    }
};

// Thunk для добавления ОДНОГО пользователя в курс
export const addUserToCourseThunk = (courseId, userId) => async (dispatch) => {
    dispatch(setLoading());
    try {
        await addUserToCourse(courseId, userId);
        // Перезагружаем курс для обновления данных
        const result = await dispatch(fetchCourseById(courseId));
        // Если нужно обновить в общем списке курсов:
        // const updatedCourses = await getCoursesByUser();
        // dispatch(setCourses(updatedCourses));
        return {
            meta: { requestStatus: 'fulfilled' },
            payload: result.payload
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        dispatch(setError(errorMessage));
        return {
            meta: { requestStatus: 'rejected' },
            error: errorMessage,
            payload: null
        };
    }
};

// Thunk для добавления пользователей по списку ID
export const addUsersToCourseByIdListThunk = (courseId, userIdList) => async (dispatch) => {
    dispatch(setLoading());
    try {
        await addUsersToCourseByIdList(courseId, userIdList);
        // Перезагружаем курс
        const result = await dispatch(fetchCourseById(courseId));
        return {
            meta: { requestStatus: 'fulfilled' },
            payload: result.payload
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        dispatch(setError(errorMessage));
        return {
            meta: { requestStatus: 'rejected' },
            error: errorMessage,
            payload: null
        };
    }
};



// Экспорт редьюсеров и редуктора слайса
export const {
    setCourses,
    setLoading,
    setError,
    updateCourse
} = coursesSlice.actions;

export default coursesSlice.reducer;
