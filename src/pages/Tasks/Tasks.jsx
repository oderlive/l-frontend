// components/Tasks.jsx

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {selectError, selectIsLoading, selectTasks} from "../../features/tasks/tasksSlice";
import * as tasksActions from "../../features/tasks/tasks";

const Tasks = ({ courseId }) => {
    const dispatch = useDispatch();

    // Получаем данные из Redux-стора
    const tasks = useSelector(selectTasks);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    // Локальное состояние для формы и диалогов
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // При изменении courseId загружаем задачи
    useEffect(() => {
        if (courseId) {
            dispatch(tasksActions.getTasksByCourseId(courseId));
        }
    }, [dispatch, courseId]);

    // Открытие диалога для добавления новой задачи
    const handleAddTask = () => {
        setCurrentTask(null);
        setTaskTitle('');
        setTaskDescription('');
        setOpenDialog(true);
    };

    // Сохранение новой или обновлённой задачи
    const handleSaveTask = () => {
        if (!taskTitle.trim()) {
            setSnackbar({
                open: true,
                message: 'Название задачи обязательно',
                severity: 'warning',
            });
            return;
        }

        if (currentTask) {
            // Обновление существующей задачи
            dispatch(
                tasksActions.updateTaskById({
                    taskId: currentTask.id,
                    updatedTaskData: { title: taskTitle, description: taskDescription },
                })
            )
                .unwrap()
                .then(() => {
                    setSnackbar({
                        open: true,
                        message: 'Задача успешно обновлена',
                        severity: 'success',
                    });
                    handleCloseDialog();
                })
                .catch((err) => {
                    setSnackbar({
                        open: true,
                        message: `Ошибка при обновлении: ${err}`,
                        severity: 'error',
                    });
                });
        } else {
            // Добавление новой задачи
            dispatch(
                tasksActions.addTaskToCourse({
                    courseId,
                    task: { title: taskTitle, description: taskDescription },
                })
            )
                .unwrap()
                .then(() => {
                    setSnackbar({
                        open: true,
                        message: 'Задача добавлена',
                        severity: 'success',
                    });
                    handleCloseDialog();
                })
                .catch((err) => {
                    setSnackbar({
                        open: true,
                        message: `Ошибка при добавлении: ${err}`,
                        severity: 'error',
                    });
                });
        }
    };

    // Открытие диалога для редактирования
    const handleEditTask = (task) => {
        setCurrentTask(task);
        setTaskTitle(task.title);
        setTaskDescription(task.description || '');
        setOpenDialog(true);
    };

    // Удаление задачи
    const handleDeleteTask = (taskId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
            dispatch(tasksActions.deleteTaskById(taskId))
                .unwrap()
                .then(() => {
                    setSnackbar({
                        open: true,
                        message: 'Задача удалена',
                        severity: 'success',
                    });
                })
                .catch((err) => {
                    setSnackbar({
                        open: true,
                        message: `Ошибка при удалении: ${err}`,
                        severity: 'error',
                    });
                });
        }
    };

    // Закрытие диалога
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentTask(null);
        setTaskTitle('');
        setTaskDescription('');
    };

    // Закрытие уведомления
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Card sx={{ mt: 3, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Задачи курса
                </Typography>

                {/* Кнопка добавления задачи */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTask}
                    sx={{ mb: 2 }}
                >
                    Добавить задачу
                </Button>

                {/* Индикатор загрузки */}
                {isLoading && <Typography color="textSecondary">Загрузка...</Typography>}

                {/* Ошибка */}
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        Ошибка: {error}
                    </Typography>
                )}

                {/* Таблица задач */}
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Название</strong></TableCell>
                                <TableCell><strong>Описание</strong></TableCell>
                                <TableCell align="right"><strong>Действия</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <TableRow key={task.id} hover>
                                        <TableCell>{task.id}</TableCell>
                                        <TableCell>{task.title}</TableCell>
                                        <TableCell>{task.description || '—'}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleEditTask(task)}
                                                sx={{ mr: 1 }}
                                            >
                                                Редактировать
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                Удалить
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary' }}>
                                        Нет задач для этого курса
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Диалог добавления/редактирования */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {currentTask ? 'Редактировать задачу' : 'Добавить новую задачу'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Название задачи"
                            fullWidth
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Описание"
                            fullWidth
                            multiline
                            rows={4}
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">
                            Отмена
                        </Button>
                        <Button onClick={handleSaveTask} variant="contained" color="primary">
                            {currentTask ? 'Сохранить' : 'Добавить'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Уведомление */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
};

export default Tasks;
