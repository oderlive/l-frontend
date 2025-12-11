import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    TextField,
    InputAdornment,
} from '@mui/material';
import { AddComment as AddCommentIcon, ExpandMore, ExpandLess, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import * as tasksActions from '../../features/tasks/tasks';
import * as solutionsActions from '../../features/solution/solutions';
import { v4 as uuidv4 } from 'uuid';
import { getTasksByCourseAndUserId, getTasksByCourseId } from '../../features/tasks/tasks';
import { fetchUserInstitution } from '../../features/users/usersSlice';
import { selectTasks, selectIsLoading, selectError } from '../../features/tasks/tasksSlice';
import TaskItem from './TaskItem'; // ✅ Импорт компонента с комментариями

const Tasks = ({ courseId }) => {
    const dispatch = useDispatch();

    // Состояние из Redux
    const tasks = useSelector(selectTasks);
    const isLoadingTasks = useSelector(selectIsLoading);
    const errorTasks = useSelector(selectError);

    // Локальное состояние
    const [openTaskDialog, setOpenTaskDialog] = useState(false);
    const [openSolutionDialog, setOpenSolutionDialog] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const userId = useMemo(() => localStorage.getItem('user_id'), []);

    // Загрузка задач
    useEffect(() => {
        if (!courseId) return;

        const loadTasks = async () => {
            try {
                const institution = await dispatch(fetchUserInstitution()).unwrap();
                const userRole = institution?.role;

                if (userRole === 'STUDENT') {
                    await dispatch(getTasksByCourseAndUserId(courseId)).unwrap();
                } else {
                    await dispatch(getTasksByCourseId(courseId)).unwrap();
                }
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: `Не удалось загрузить задачи: ${error.message || error}`,
                    severity: 'error',
                });
            }
        };

        loadTasks();
    }, [dispatch, courseId]);

    // === Управление задачами ===
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

        const savePromise = currentTask
            ? dispatch(
                tasksActions.updateTaskById({
                    taskId: currentTask.id,
                    updatedTaskData: { newTitle: taskTitle, newDescription: taskDescription, taskId: currentTask.id },
                })
            )
            : dispatch(
                tasksActions.addTaskToCourse({
                    courseId,
                    task: { title: taskTitle, description: taskDescription },
                })
            );

        savePromise
            .unwrap()
            .then(() => {
                setSnackbar({
                    open: true,
                    message: currentTask ? 'Задача обновлена' : 'Задача добавлена',
                    severity: 'success',
                });
                handleCloseTaskDialog();
            })
            .catch((err) => {
                setSnackbar({
                    open: true,
                    message: `Ошибка: ${err.message || err}`,
                    severity: 'error',
                });
            });
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
                        message: `Ошибка при удалении: ${err.message || err}`,
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

    // === Управление решением ===
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
                message: 'Выберите хотя бы один файл',
                severity: 'warning',
            });
            return;
        }

        try {
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

                {isLoadingTasks && <Typography color="textSecondary">Загрузка задач...</Typography>}
                {errorTasks && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        Ошибка загрузки задач: {errorTasks}
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
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        onAddSolution={handleOpenSolutionDialog}
                                    />
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

                {/* Диалог: редактирование/добавление задачи */}
                <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>{currentTask ? 'Редактировать задачу' : 'Добавить новую задачу'}</DialogTitle>
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

                {/* Диалог: отправка решения */}
                <Dialog open={openSolutionDialog} onClose={handleCloseSolutionDialog} maxWidth="md" fullWidth>
                    <DialogTitle>Отправить решение</DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Задача: {currentTask?.title}
                        </Typography>
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
                                <Button variant="contained" component="span" color="primary">
                                    Выбрать файлы
                                </Button>
                            </label>
                            {selectedFiles.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                                        Выбранные файлы:
                                    </Typography>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {selectedFiles.map((file, index) => (
                                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <span>{file.name}</span>
                                                <span style={{ color: '#666', fontSize: 12 }}>
                                                    {(file.size / 1024).toFixed(1)} КБ
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(index)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: 'red',
                                                        cursor: 'pointer',
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseSolutionDialog} color="secondary">
                            Отмена
                        </Button>
                        <Button onClick={handleAddSolution} variant="contained" color="success">
                            Отправить
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                        elevation={6}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
};

export default Tasks;
