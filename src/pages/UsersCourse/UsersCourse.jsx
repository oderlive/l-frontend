import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import {
    fetchCourseById,
    addUsersToCourseByIdListThunk, addUserToCourseThunk
} from '../../features/course/coursesSlice';

const UsersCourse = ({ courseId }) => {
    const dispatch = useDispatch();
    const [courseData, setCourseData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [inputUserIds, setInputUserIds] = useState('');

    // Загрузка данных о курсе
    useEffect(() => {
        if (!courseId) return;

        const fetchCourse = async () => {
            setIsLoading(true);
            try {
                const result = await dispatch(fetchCourseById(courseId));
                if (result.meta.requestStatus === 'fulfilled') {
                    setCourseData(result.payload);
                } else {
                    setError(result.error || 'Failed to fetch course');
                }
            } catch (err) {
                setError(err.message || 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, dispatch]);

    // Открытие модального окна
    const openAddDialog = () => {
        setOpenDialog(true);
        setInputUserIds('');
    };

    // Закрытие модального окна
    const closeDialog = () => {
        setOpenDialog(false);
        setInputUserIds('');
    };

    // Обработка ввода ID пользователей
    const handleInputChange = (e) => {
        setInputUserIds(e.target.value);
    };

    // Парсинг введённой строки в массив строк (UUID)
    const parseUserIds = (input) => {
        return input
            .split(',')
            .map(id => id.trim())
            .filter(id => id !== ''); // Оставляем только непустые строки
    };

    // Добавление списка пользователей в курс
    const handleAddUsers = async () => {
        const userIdList = parseUserIds(inputUserIds);

        // Валидация: хотя бы один ID
        if (userIdList.length === 0) {
            setError('Введите хотя бы один корректный ID пользователя');
            return;
        }

        setIsLoading(true);
        try {
            let result;
            // Логика выбора API в зависимости от количества ID
            if (userIdList.length === 1) {
                // Одиночное добавление
                result = await dispatch(
                    addUserToCourseThunk(courseId, userIdList[0])
                );
            } else {
                // Массовое добавление
                result = await dispatch(
                    addUsersToCourseByIdListThunk(courseId, userIdList)
                );
            }

            // Перезагружаем данные курса после успешного добавления
            const refreshResult = await dispatch(fetchCourseById(courseId));
            if (refreshResult.meta.requestStatus === 'fulfilled') {
                setCourseData(refreshResult.payload);
            } else {
                setError(refreshResult.error || 'Failed to refresh course data');
            }

            closeDialog(); // Закрываем диалог после успеха
        } catch (err) {
            setError(err.message || 'Unknown error during user addition');
        } finally {
            setIsLoading(false);
        }
    };


    const currentCourseUsers = courseData?.members?.users || [];

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Управление участниками курса
            </Typography>

            {isLoading && <Typography>Загрузка данных о курсе...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {courseData && (
                <Paper sx={{ padding: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Текущие участники курса ({currentCourseUsers.length}):
                    </Typography>

                    <List>
                        {currentCourseUsers.map(user => (
                            <ListItem key={user.id} dense>
                                <ListItemText
                                    primary={`${user.name} ${user.surname}`}
                                    secondary={`ID: ${user.id}, Группа: ${user.group}, Роль: ${user.role}`}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={openAddDialog}
                        sx={{ mt: 2 }}
                    >
                        Добавить пользователей в курс
                    </Button>
                </Paper>
            )}

            {/* Модальное окно для ввода ID */}
            <Dialog open={openDialog} onClose={closeDialog}>
                <DialogTitle>Добавить пользователей в курс</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="ID пользователей (через запятую)"
                        value={inputUserIds}
                        onChange={handleInputChange}
                        placeholder="Пример: 6643d0e6-3263-4125-804b-2671a164fb87, a1b2c3d4-e5f6-7890-1234-567890abcdef"
                        helperText="Введите ID пользователей через запятую"
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Отмена</Button>
                    <Button
                        onClick={handleAddUsers}
                        color="primary"
                        disabled={isLoading || !inputUserIds.trim()}
                    >
                        {isLoading ? 'Добавление...' : 'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersCourse;
