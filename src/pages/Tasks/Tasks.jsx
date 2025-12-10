import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
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
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton, TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectError, selectIsLoading, selectTasks } from '../../features/tasks/tasksSlice';
import * as tasksActions from '../../features/tasks/tasks';
import * as solutionsActions from '../../features/solution/solutions';
import { v4 as uuidv4 } from 'uuid'; // для генерации UUID

const Tasks = ({ courseId }) => {
    const dispatch = useDispatch();

    // Получаем данные из Redux-стора
    const tasks = useSelector(selectTasks);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    // Локальное состояние
    const [openTaskDialog, setOpenTaskDialog] = useState(false);
    const [openSolutionDialog, setOpenSolutionDialog] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]); // массив файлов
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // При изменении courseId загружаем задачи
    useEffect(() => {
        if (courseId) {
            dispatch(tasksActions.getTasksByCourseId(courseId));
        }
    }, [dispatch, courseId]);

    // === Управление задачами (без изменений) ===
    const handleAddTask = () => {
        setCurrentTask(null);
        setTaskTitle('');
        setTaskDescription('');
        setOpenTaskDialog(true);
    };

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setTaskTitle(task.title);
        setTaskDescription(task.description || '');
        setOpenTaskDialog(true);
    };

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
            dispatch(
                tasksActions.updateTaskById({
                    taskId: currentTask.id,
                    updatedTaskData: { newTitle: taskTitle, newDescription: taskDescription, taskId: currentTask.id },
                })
            )
                .unwrap()
                .then(() => {
                    setSnackbar({
                        open: true,
                        message: 'Задача успешно обновлена',
                        severity: 'success',
                    });
                    handleCloseTaskDialog();
                })
                .catch((err) => {
                    setSnackbar({
                        open: true,
                        message: `Ошибка при обновлении: ${err}`,
                        severity: 'error',
                    });
                });
        } else {
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
                    handleCloseTaskDialog();
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

    const handleCloseTaskDialog = () => {
        setOpenTaskDialog(false);
        setCurrentTask(null);
        setTaskTitle('');
        setTaskDescription('');
    };

    // === Отправка решения: теперь с несколькими файлами ===
    const handleOpenSolutionDialog = (task) => {
        setCurrentTask(task);
        setSelectedFiles([]);
        setOpenSolutionDialog(true);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddSolution = async () => {
        if (selectedFiles.length === 0) {
            setSnackbar({
                open: true,
                message: 'Пожалуйста, выберите хотя бы один файл',
                severity: 'warning',
            });
            return;
        }

        try {
            // Формируем массив content: [{ id, original_file_name }, ...]
            const content = selectedFiles.map((file) => ({
                id: uuidv4(),
                original_file_name: file.name,
            }));

            await dispatch(
                solutionsActions.addSolution({
                    taskId: currentTask.id,
                    content,
                })
            ).unwrap();

            setSnackbar({
                open: true,
                message: 'Решение отправлено!',
                severity: 'success',
            });
            handleCloseSolutionDialog();
        } catch (err) {
            setSnackbar({
                open: true,
                message: `Ошибка при отправке: ${err.message || 'Неизвестная ошибка'}`,
                severity: 'error',
            });
            console.error('Ошибка при отправке решения:', err);
        }
    };

    const handleCloseSolutionDialog = () => {
        setOpenSolutionDialog(false);
        setCurrentTask(null);
        setSelectedFiles([]);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Card sx={{ mt: 3, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Задачи курса
                </Typography>

                <Button variant="contained" color="primary" onClick={handleAddTask} sx={{ mb: 2 }}>
                    Добавить задачу
                </Button>

                {isLoading && <Typography color="textSecondary">Загрузка...</Typography>}

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        Ошибка: {error}
                    </Typography>
                )}

                <TableContainer component={Paper} elevation={1}>
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
                                                sx={{ mr: 1 }}
                                            >
                                                Удалить
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleOpenSolutionDialog(task)}
                                            >
                                                Добавить решение
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

                {/* Диалог: Добавление/редактирование задачи */}
                <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog} maxWidth="sm" fullWidth>
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
                        <Button onClick={handleCloseTaskDialog} color="secondary">
                            Отмена
                        </Button>
                        <Button onClick={handleSaveTask} variant="contained" color="primary">
                            {currentTask ? 'Сохранить' : 'Добавить'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Диалог: Отправка решения (несколько файлов) */}
                <Dialog open={openSolutionDialog} onClose={handleCloseSolutionDialog} maxWidth="md" fullWidth>
                    <DialogTitle>Отправить решение</DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Задача: {currentTask?.title}
                        </Typography>

                        {/* Выбор файлов */}
                        <Box sx={{ mb: 2 }}>
                            <input
                                type="file"
                                accept="*/*"
                                id="multiple-files"
                                multiple
                                hidden
                                onChange={handleFileChange}
                            />
                            <label htmlFor="multiple-files">
                                <Button variant="contained" component="span">
                                    Выбрать файлы
                                </Button>
                            </label>

                            {/* Список выбранных файлов */}
                            {selectedFiles.length > 0 && (
                                <List dense sx={{ mt: 2 }}>
                                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                                        Выбранные файлы:
                                    </Typography>
                                    {selectedFiles.map((file, index) => (
                                        <ListItem
                                            key={index}
                                            secondaryAction={
                                                <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                                                    ✕
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={file.name}
                                                secondary={`${Math.round(file.size / 1024)} КБ`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseSolutionDialog} color="error">
                            Отмена
                        </Button>
                        <Button onClick={handleAddSolution} variant="contained" color="primary">
                            Отправить решение
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
