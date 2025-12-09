import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    addTaskToCourse,
    getTaskById,
    deleteTaskById,
    updateTaskById,
    getTasksByCourseId,
    getTasksByCourseAndUserId,
} from '../../features/tasks/tasks'; // путь к вашим thunks
import styles from './ManageUsers.module.css';

const TasksManager = ({ courseId, userId }) => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks.tasks);
    const task = useSelector(state => state.tasks.task);
    const isLoading = useSelector(state => state.tasks.loading);
    const error = useSelector(state => state.tasks.error);

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        deadline: '',
    });

    const [selectedTaskId, setSelectedTaskId] = useState(null);

    useEffect(() => {
        // Загружаем задачи при монтировании компонента
        dispatch(getTasksByCourseId(courseId));
    }, [dispatch, courseId]);

    // Добавление новой задачи
    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await dispatch(addTaskToCourse({
                courseId,
                taskBody: taskData,
            }));
            setTaskData({ title: '', description: '', deadline: '' }); // Сброс формы
        } catch (err) {
            console.error('Ошибка при добавлении задачи:', err);
        }
    };

    // Получение задачи по ID
    const handleViewTask = async (taskId) => {
        setSelectedTaskId(taskId);
        await dispatch(getTaskById(taskId));
    };

    // Удаление задачи
    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Вы уверены, что хотите удалить задачу?')) {
            await dispatch(deleteTaskById(taskId));
        }
    };

    // Обновление задачи
    const handleUpdateTask = async (e) => {
        e.preventDefault();
        await dispatch(updateTaskById({
            taskId: selectedTaskId,
            taskUpdates: taskData,
        }));
        setSelectedTaskId(null); // Сброс после обновления
    };

    // Обработка изменения полей задачи
    const handleTaskChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    return (
        <Box className={styles.container}>
            <Typography variant="h5" className={styles.title}>
                Управление заданиями
            </Typography>

            {error && (
                <Typography color="error" className={styles.errorMsg}>
                    {error}
                </Typography>
            )}

            {isLoading && <Typography>Загрузка...</Typography>}

            {/* Форма добавления задачи */}
            <form onSubmit={handleAddTask} className={styles.form}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Название задачи"
                            name="title"
                            value={taskData.title}
                            onChange={handleTaskChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Описание"
                            name="description"
                            value={taskData.description}
                            onChange={handleTaskChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Срок выполнения"
                            name="deadline"
                            type="date"
                            value={taskData.deadline}
                            onChange={handleTaskChange}
                            required
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.submitButton}
                >
                    Добавить задание
                </Button>
            </form>

            {/* Список задач */}
            <Typography variant="h6" mt={3}>
                Список заданий
            </Typography>
            {tasks.map(task => (
                <Box key={task.id} mt={1} p={1} border="1px solid #ddd">
                    <Typography>
                        {task.title} (срок: {task.deadline})
                    </Typography>
                    <Typography variant="body2">
                        {task.description}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewTask(task.id)}
                    >
                        Просмотреть
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="warning"
                        onClick={() => handleDeleteTask(task.id)}
                    >
                        Удалить
                    </Button>
                </Box>
            ))}

            {/* Форма редактирования задачи */}
            {selectedTaskId && (
                <Box mt={3}>
                    <Typography variant="h6">Редактирование задания</Typography>
                    <form onSubmit={handleUpdateTask}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Название задачи"
                                    name="title"
                                    value={taskData.title}
                                    onChange={handleTaskChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Описание"
                                    name="description"
                                    value={taskData.description}
                                    onChange={handleTaskChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Срок выполнения"
                                    name="deadline"
                                    type="date"
                                    value={taskData.deadline}
                                    onChange={handleTaskChange}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={styles.submitButton}
                        >
                            Обновить задание
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setSelectedTaskId(null)}
                        >
                            Отмена
                        </Button>
                    </form>
                </Box>
            )}
        </Box>
    );
};

export default TasksManager;
