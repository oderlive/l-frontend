import React, { useState, useEffect } from 'react';

// Импорт компонентов Material UI
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Typography,
    Alert,
    Box,
    Divider,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Course = () => {
    const [tasks, setTasks] = useState([]);
    const [solutions, setSolutions] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_BASE = 'https://api.example.com'; // Замените на ваш API
    const courseId = '123';
    const userId = '456';
    const taskId = '789';
    const solutionId = '101';

    // Универсальная функция для запросов
    const apiRequest = async (method, endpoint, data = null) => {
        setLoading(true);
        setError('');
        try {
            const config = {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: data ? JSON.stringify(data) : undefined,
            };
            const response = await fetch(`${API_BASE}${endpoint}`, config);
            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
            const result = await response.json();
            setLoading(false);
            return result;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return null;
        }
    };

    // === Задания ===
    const fetchTasksByCourse = async () => {
        const data = await apiRequest('GET', `/tasks/course/${courseId}`);
        if (data) setTasks(Array.isArray(data) ? data : [data]);
    };

    const addTask = async () => {
        const newTask = {
            title: 'Новое задание',
            description: 'Описание задания',
            deadline: '2025-12-15T23:59:59Z',
        };
        const data = await apiRequest('POST', `/tasks/${courseId}`, newTask);
        if (data) setTasks(prev => [...prev, data]);
    };

    const updateTask = async () => {
        const updates = { title: 'Обновлённое задание' };
        await apiRequest('PATCH', `/tasks/${taskId}`, updates);
        fetchTasksByCourse();
    };

    const deleteTask = async () => {
        await apiRequest('DELETE', `/tasks/${taskId}`);
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    // === Решения ===
    const submitSolution = async () => {
        const solutionData = { code: 'console.log("Hello");', taskId };
        const data = await apiRequest('POST', `/solutions/task/${taskId}`, solutionData);
        if (data) setSolutions(prev => [...prev, data]);
    };

    const fetchUserSolutions = async () => {
        const data = await apiRequest('GET', `/solutions/task/${taskId}/user/${userId}`);
        if (data) setSolutions(Array.isArray(data) ? data : [data]);
    };

    const reviewSolution = async () => {
        await apiRequest('POST', `/solutions/${solutionId}/review`);
    };

    const deleteSolution = async () => {
        await apiRequest('DELETE', `/solutions/${solutionId}`);
        setSolutions(prev => prev.filter(s => s.id !== solutionId));
    };

    // === Комментарии ===
    const fetchTaskComments = async () => {
        const data = await apiRequest('GET', `/tasks/${taskId}/comments`);
        if (data) setComments(Array.isArray(data) ? data : [data]);
    };

    const addCommentToTask = async () => {
        const comment = { text: 'Хорошее задание!', userId };
        const data = await apiRequest('POST', `/tasks/${taskId}/comments`, comment);
        if (data) setComments(prev => [...prev, data]);
    };

    const deleteComment = async (commentId) => {
        await apiRequest('DELETE', `/tasks/${taskId}/comments/${commentId}`);
        setComments(prev => prev.filter(c => c.id !== commentId));
    };

    useEffect(() => {
        fetchTasksByCourse();
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom color="primary">
                Менеджер заданий и решений
            </Typography>

            {loading && (
                <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* === Блок Задания === */}
            <Card variant="outlined" sx={{ mb: 4 }}>
                <CardHeader title="Задания" titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Button variant="contained" color="primary" onClick={fetchTasksByCourse}>
                            Загрузить задания курса
                        </Button>
                        <Button variant="outlined" color="success" onClick={addTask}>
                            Добавить задание
                        </Button>
                        <Button variant="outlined" color="warning" onClick={updateTask}>
                            Обновить задание
                        </Button>
                        <Button variant="outlined" color="error" onClick={deleteTask}>
                            Удалить задание
                        </Button>
                    </Box>

                    <List>
                        {tasks.length === 0 ? (
                            <Typography color="textSecondary">Нет заданий</Typography>
                        ) : (
                            tasks.map(task => (
                                <React.Fragment key={task.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={task.title}
                                            secondary={task.description || 'Без описания'}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </CardContent>
            </Card>

            {/* === Блок Решения === */}
            <Card variant="outlined" sx={{ mb: 4 }}>
                <CardHeader title="Решения" titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Button variant="contained" color="secondary" onClick={submitSolution}>
                            Отправить решение
                        </Button>
                        <Button variant="outlined" onClick={fetchUserSolutions}>
                            Мои решения
                        </Button>
                        <Button variant="outlined" color="info" onClick={reviewSolution}>
                            На проверку
                        </Button>
                        <Button variant="outlined" color="error" onClick={deleteSolution}>
                            Удалить решение
                        </Button>
                    </Box>

                    <List>
                        {solutions.length === 0 ? (
                            <Typography color="textSecondary">Нет решений</Typography>
                        ) : (
                            solutions.map(sol => (
                                <React.Fragment key={sol.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`Решение #${sol.id}`}
                                            secondary={`Статус: ${sol.status || 'неизвестно'}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </CardContent>
            </Card>

            {/* === Блок Комментарии === */}
            <Card variant="outlined">
                <CardHeader title="Комментарии" titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Button variant="contained" color="info" onClick={fetchTaskComments}>
                            Загрузить комментарии
                        </Button>
                        <Button variant="outlined" color="success" onClick={addCommentToTask}>
                            Добавить комментарий
                        </Button>
                    </Box>

                    <List>
                        {comments.length === 0 ? (
                            <Typography color="textSecondary">Нет комментариев</Typography>
                        ) : (
                            comments.map(comment => (
                                <React.Fragment key={comment.id}>
                                    <ListItem
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={() => deleteComment(comment.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={comment.text}
                                            secondary={`Пользователь: ${comment.userId}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Course;
