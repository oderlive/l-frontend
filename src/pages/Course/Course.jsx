import React, { useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    TextField,
    Select,
    MenuItem,
    Typography,
    FormControl,
    FormHelperText,
    Box,
    Divider,
    Grid,
} from '@mui/material';
import styles from './Course.module.css';
import axios from 'axios';

// Моковые данные
const mockCourses = [
    { id: '1', name: 'Основы React' },
    { id: '2', name: 'Продвинутый JavaScript' },
    { id: '3', name: 'TypeScript для веб-разработки' },
];

const mockTasks = [
    { id: '101', courseId: '1', title: 'Создать компонент', description: 'Разработать простой компонент на React' },
    { id: '102', courseId: '1', title: 'Обработать события', description: 'Добавить обработчики кликов' },
    { id: '201', courseId: '2', title: 'Изучить Promise', description: 'Проработать примеры с Promise' },
];

const Course = () => {
    const [courseId, setCourseId] = useState('');
    const [taskId, setTaskId] = useState('');
    const [userId, setUserId] = useState('');
    const [taskData, setTaskData] = useState({ title: '', description: '' });
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [tasksList, setTasksList] = useState([]);

    // Инициализация списка задач при выборе курса
    const loadTasksForCourse = async (courseId) => {
        try {
            const response = await axios.get(`/tasks/course/${courseId}`);
            setTasksList(response.data);
            console.log('Задания курса:', response.data);
        } catch (error) {
            console.error('Ошибка при получении заданий курса:', error);
        }
    };

    // Методы для работы с API
    const addTask = async () => {
        try {
            const response = await axios.post(`/tasks/${courseId}`, taskData);
            setTasksList([...tasksList, response.data]); // Добавляем новую задачу в список
            setTaskData({ title: '', description: '' }); // Очищаем форму
            console.log('Задание добавлено:', response.data);
        } catch (error) {
            console.error('Ошибка при добавлении задания:', error);
        }
    };

    const getTaskById = async () => {
        try {
            const response = await axios.get(`/tasks/${taskId}`);
            console.log('Информация о задании:', response.data);
            // Можно отобразить детали задачи в модальном окне
        } catch (error) {
            console.error('Ошибка при получении задания:', error);
        }
    };

    const deleteTask = async () => {
        try {
            await axios.delete(`/tasks/${taskId}`);
            setTasksList(tasksList.filter(task => task.id !== taskId)); // Удаляем задачу из списка
            console.log('Задание удалено');
        } catch (error) {
            console.error('Ошибка при удалении задания:', error);
        }
    };

    const updateTask = async () => {
        try {
            await axios.patch(`/tasks/${taskId}`, taskData);
            // Обновляем список задач или конкретную задачу в списке
            console.log('Задание обновлено');
        } catch (error) {
            console.error('Ошибка при обновлении задания:', error);
        }
    };

    const getTasksByCourseAndUser = async () => {
        try {
            const response = await axios.get(`/tasks/course/${courseId}/user/${userId}`);
            console.log('Задания курса для пользователя:', response.data);
        } catch (error) {
            console.error('Ошибка при получении заданий для пользователя:', error);
        }
    };

    // Обработчик выбора курса из списка
    const handleCourseSelect = (event) => {
        setCourseId(event.target.value);
        setSelectedCourse(event.target.value);
        loadTasksForCourse(event.target.value); // Загружаем задачи для выбранного курса
    };

    return (
        <div className={styles.container}>
            <Typography variant="h4">Управление курсами и заданиями</Typography>

            <Grid container spacing={2}>
                {/* Выбор курса */}
                <Grid item xs={12} md={4}>
                    <Box mt={2}>
                        <Typography variant="h6">Выберите курс</Typography>
                        <FormControl fullWidth>
                            <Select
                                value={courseId}
                                onChange={handleCourseSelect}
                                label="Выберите курс"
                            >
                                {mockCourses.map(course => (
                                    <MenuItem key={course.id} value={course.id}>
                                        {course.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

                {/* Добавление задания */}
                <Grid item xs={12} md={8}>
                    <Box mt={2}>
                        <Typography variant="h6">Добавить задание к курсу</Typography>
                        <TextField
                            label="Название задания"
                            value={taskData.title}
                            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Описание задания"
                            value={taskData.description}
                            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                            multiline
                            rows={3}
                            fullWidth
                            margin="dense"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={addTask}
                            fullWidth
                        >
                            Добавить задание
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Divider mt={2} mb={2} />

            {/* Список задач для выбранного курса */}
            <Box mt={2}>
                <Typography variant="h6">Задания курса {selectedCourse ? mockCourses.find(c => c.id === selectedCourse)?.name : 'Не выбран'}</Typography>
                <Grid container spacing={2}>
                    {tasksList.map(task => (
                        <Grid item xs={12} sm={6} md={4} key={task.id}>
                            <Card elevation={3} style={{ padding: '16px' }}>
                                <Typography variant="body1" gutterBottom>
                                    {task.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {task.description}
                                </Typography>
                                <Box mt={1}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            setTaskId(task.id);
                                            getTaskById();
                                        }}
                                    >
                                        Подробнее
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="primary"
                                        onClick={() => {
                                            setTaskId(task.id);
                                            setTaskData({ title: task.title, description: task.description });
                                        }}
                                        sx={{ ml: 1 }}
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        onClick={deleteTask}
                                        sx={{ ml: 1 }}
                                    >
                                        Удалить
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Divider mt={2} mb={2} />

            {/* Получение заданий для пользователя */}
            <Box mt={2}>
                <Typography variant="h6">Получить задания для пользователя</Typography>
                <TextField
                    label="ID пользователя"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    fullWidth
                    margin="dense"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={getTasksByCourseAndUser}
                    fullWidth
                    mt={1}
                >
                    Получить задания
                </Button>
            </Box>
        </div>
    );
};

export default Course;
