// ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Paper,
    IconButton,
    Grid,
    Chip,
    Snackbar,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, Divider,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Search as SearchIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

// Импорты из нашего Redux
import {
    addUsersBatch,
    getAllUsers,
    searchUsers,
    deleteSearchUsers
} from '../../features/users/users';
import {
    selectAllUsers,
    selectTotalUsers,
    selectUsersLoading,
    selectUsersError,
    selectSearchResults
} from '../../features/users/usersSlice';

const ManageUsers = () => {
    const dispatch = useDispatch();

    // Состояние для формы добавления
    const initialUser = {
        surname: '',
        name: '',
        patronymic: '',
        role: 'STUDENT',
        email: '',
        age: '',
        group: '', // исправлено: было group_name
    };

    const [users, setUsers] = useState([initialUser]);
    const [submitStatus, setSubmitStatus] = useState(null); // success | error
    const [errorMessage, setErrorMessage] = useState('');

    // Состояние для поиска
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Состояние для удаления
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Состояние загрузки
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Селекторы из Redux
    const allUsers = useSelector(selectAllUsers);
    const totalUsers = useSelector(selectTotalUsers);
    const isLoading = useSelector(selectUsersLoading);
    const error = useSelector(selectUsersError);
    const searchResults = useSelector(selectSearchResults);

    // Эффект для отображения ошибок из Redux
    useEffect(() => {
        if (error) {
            setSubmitStatus('error');
            setErrorMessage(error);
        }
    }, [error]);

    // Эффект для сброса статуса после успешной операции
    useEffect(() => {
        if (submitStatus === 'success') {
            const timer = setTimeout(() => setSubmitStatus(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [submitStatus]);

    // Добавить нового пользователя
    const addUser = () => {
        setUsers([...users, { ...initialUser }]);
    };

    // Удалить пользователя по индексу
    const removeUser = (index) => {
        if (users.length === 1) return; // Нельзя удалить последнего
        setUsers(users.filter((_, i) => i !== index));
    };

    // Обновить поле конкретного пользователя
    const handleUserChange = (index, field, value) => {
        const updatedUsers = [...users];
        updatedUsers[index][field] = value;
        setUsers(updatedUsers);
    };

    // Отправить данные на сервер
    const handleSubmit = async () => {
        // Преобразуем age в число и фильтруем пустые поля
        const preparedUsers = users
            .map((user) => ({
                ...user,
                age: user.age ? Number(user.age) : null,
            }))
            .filter((user) => user.name || user.surname || user.email);

        if (preparedUsers.length === 0) {
            setSubmitStatus('error');
            setErrorMessage('Нет данных для отправки.');
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(addUsersBatch(preparedUsers)).unwrap();
            setSubmitStatus('success');
            setErrorMessage('');
            // Сбрасываем форму после успешной отправки
            setUsers([initialUser]);
            // Обновляем список пользователей
            await dispatch(getAllUsers({ page: 1, limit: 20 }));
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage(
                typeof error === 'string' ? error : 'Ошибка при добавлении пользователей'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Поиск пользователей
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSubmitStatus('error');
            setErrorMessage('Введите запрос для поиска');
            return;
        }

        setIsSearching(true);
        try {
            const result = await dispatch(searchUsers({
                user_email: searchQuery.trim()
            })).unwrap();

            console.log('Полный ответ от searchUsers:', result);

        } catch (error) {
            console.error('Ошибка поиска:', error);
            setSubmitStatus('error');
            setErrorMessage('Ошибка при поиске пользователей');
        } finally {
            setIsSearching(false);
        }
    };



    // Открытие диалога удаления
    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    // Подтверждение удаления
    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            await dispatch(deleteSearchUsers({
                user_email: userToDelete.email
            })).unwrap();

            setSubmitStatus('success');
            setErrorMessage(`Пользователь ${userToDelete.surname} ${userToDelete.name} успешно удалён`);

            // Закрываем диалог
            setDeleteDialogOpen(false);
            setUserToDelete(null);

            // Обновляем списки
            await dispatch(getAllUsers({ page: 1, limit: 20 }));
            await dispatch(searchUsers({ user_email: searchQuery.trim() }));
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage('Ошибка при удалении пользователя');
        } finally {
            setIsDeleting(false);
        }
    };

    // Отмена удаления
    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    // Обработчик нажатия Enter в поиске
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        console.log('searchResults обновлены:', searchResults);
    }, [searchResults]);


    return (
        <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Управление пользователями
            </Typography>

            {/* Секция добавления пользователей */}
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Добавить пользователей
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Заполните данные и отправьте форму для массового добавления.
                </Typography>

                {users.map((user, userIndex) => (
                    <Box
                        key={userIndex}
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            padding: 2,
                            marginBottom: 2,
                            position: 'relative',
                            backgroundColor: userIndex % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
                        }}
                    >
                        {users.length > 1 && (
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeUser(userIndex)}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}

                        <Typography variant="subtitle1" gutterBottom>
                            Пользователь {userIndex + 1}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Фамилия*"
                                    value={user.surname}
                                    onChange={(e) =>
                                        handleUserChange(userIndex, 'surname', e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Имя*"
                                    value={user.name}
                                    onChange={(e) =>
                                        handleUserChange(userIndex, 'name', e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Отчество"
                                    value={user.patronymic}
                                    onChange={(e) =>
                                        handleUserChange(userIndex, 'patronymic', e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Роль*</InputLabel>
                                    <Select
                                        value={user.role}
                                        label="Роль*"
                                        onChange={(e) =>
                                            handleUserChange(userIndex, 'role', e.target.value)
                                        }
                                    >
                                        <MenuItem value="STUDENT">Учащийся</MenuItem>
                                        <MenuItem value="TEACHER">Преподаватель</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Email*"
                                    type="email"
                                    value={user.email}
                                    onChange={(e) =>
                                        handleUserChange(userIndex, 'email', e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Возраст"
                                    type="number"
                                    value={user.age}
                                    onChange={(e) =>
                                        handleUserChange(userIndex, 'age', e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                    inputProps={{ min: 1, max: 120 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Группа"
                                    value={user.group} // исправлено: было group_name
                                    onChange={(e) =>
                                        handleUserChange(userIndex, 'group', e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                    placeholder="Например: ИВТ-Б21"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={addUser}
                        variant="outlined"
                        color="primary"
                        size="small"
                    >
                        Добавить пользователя
                    </Button>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                            disabled={
                                isSubmitting ||
                                users.every((u) => !u.name && !u.surname && !u.email)
                            }
                            startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                        >
                            {isSubmitting ? 'Отправка...' : 'Отправить'}
                        </Button>

                        {submitStatus === 'success' && (
                            <Chip label="Успешно добавлено!" color="success" variant="outlined" />
                        )}
                        {submitStatus === 'error' && (
                            <Chip label={errorMessage} color="error" variant="outlined" />
                        )}
                    </Box>
                </Box>
            </Paper>

            {/* Секция поиска пользователей */}
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Поиск пользователей по email
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Введите email пользователя"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            size="small"
                            placeholder="testov111@mail.ru"
                            InputProps={{
                                endAdornment: (
                                    <SearchIcon sx={{ color: 'action.disabled', mr: 1 }} fontSize="small" />
                                )
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                            disabled={isSearching || !searchQuery.trim()}
                            startIcon={isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
                        >
                            {isSearching ? 'Поиск...' : 'Найти'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Секция результатов поиска — отображается только после поиска и при наличии данных */}
            {!isSearching && searchResults && (
                <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Найденный пользователь
                    </Typography>

                    <Box sx={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: 2,
                        padding: 3
                    }}>
                        {/* Основная информация */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Персональные данные
                            </Typography>
                            <Box sx={{ pl: 2 }}>
                                <Typography><strong>ФИО:</strong> {searchResults.surname} {searchResults.name} {searchResults.patronymic || '—'}</Typography>
                                <Typography><strong>Email:</strong> {searchResults.email}</Typography>
                                <Typography><strong>Возраст:</strong> {searchResults.age || '—'}</Typography>
                            </Box>
                        </Box>

                        {/* Учреждение */}
                        {searchResults.institution && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    Учреждение
                                </Typography>
                                <Box sx={{ pl: 2 }}>
                                    <Typography><strong>Название:</strong> {searchResults.institution.short_name}</Typography>
                                    <Typography><strong>Тип:</strong> {searchResults.institution.type}</Typography>
                                    <Typography><strong>ID:</strong> {searchResults.institution.id}</Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Роль и статус */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                            <Chip
                                label={searchResults.role === 'STUDENT' ? 'Учащийся' : 'Преподаватель'}
                                color={searchResults.role === 'STUDENT' ? 'primary' : 'secondary'}
                            />
                            <Chip
                                label={searchResults.is_enabled ? 'Активен' : 'Неактивен'}
                                color={searchResults.is_enabled ? 'success' : 'error'}
                            />
                        </Box>

                        {/* Группа */}
                        {searchResults.group && (
                            <Box sx={{ mb: 2 }}>
                                <Typography><strong>Группа:</strong> {searchResults.group}</Typography>
                            </Box>
                        )}

                        {/* Технические данные */}
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                            </Typography>
                            <Box sx={{ pl: 2, mt: 1 }}>
                                <Typography variant="body2" color="text.secondary"><strong>ID пользователя:</strong> {searchResults.id}</Typography>
                                <Typography variant="body2" color="text.secondary"><strong>Пароль:</strong> {searchResults.password}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Кнопка удаления */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(searchResults)}
                        >
                            Удалить
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Сообщение, если поиск выполнен, но результатов нет */}
            {!isSearching && !searchResults && searchQuery && (
                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        По запросу "{searchQuery}" ничего не найдено. Попробуйте изменить критерии поиска.
                    </Typography>
                </Paper>
            )}


            {/* Секция списка всех пользователей */}
            <Paper elevation={3} sx={{ padding: 3, mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Все пользователи ({totalUsers})
                </Typography>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {allUsers.length > 0 ? (
                            <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {allUsers.map((user) => (
                                    <Box
                                        key={user.id}
                                        sx={{
                                            padding: 2,
                                            borderBottom: '1px solid #f0f0f0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body1">
                                                {user.surname} {user.name} {user.patronymic || ''}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Email:</strong> {user.email || '—'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Группа:</strong> {user.group || '—'}, <strong>Возраст:</strong> {user.age || '—'}
                                            </Typography>
                                            {user.institution && (
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Учреждение:</strong> {user.institution.short_name || '—'}
                                                    {user.institution.type && (
                                                        <span> ({user.institution.type})</span>
                                                    )}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                                label={user.role === 'STUDENT' ? 'Учащийся' : 'Преподаватель'}
                                                color={user.role === 'STUDENT' ? 'primary' : 'secondary'}
                                                size="small"
                                            />
                                            <Chip
                                                label={user.is_enabled ? 'Активен' : 'Неактивен'}
                                                color={user.is_enabled ? 'success' : 'error'}
                                                size="small"
                                            />
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => console.log('Редактировать:', user.id)}
                                            >
                                                Редактировать
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                startIcon={<DeleteIcon fontSize="small" />}
                                                onClick={() => handleDeleteClick(user)}
                                            >
                                                Удалить
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                Пользователи не найдены
                            </Typography>
                        )}
                    </>
                )}
            </Paper>

            {/* Диалог подтверждения удаления */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'error.main'
                }}>
                    <WarningIcon />
                    Подтверждение удаления
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Вы уверены, что хотите удалить пользователя:
                    </Typography>
                    {userToDelete && (
                        <Box sx={{
                            backgroundColor: 'rgba(255,0,0,0.04)',
                            border: '1px solid rgba(255,0,0,0.1)',
                            borderRadius: 1,
                            padding: 2,
                            mb: 2
                        }}>
                            <Typography fontWeight="600">
                                {userToDelete.surname} {userToDelete.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email: {userToDelete.email}
                            </Typography>
                            {userToDelete.group && (
                                <Typography variant="body2" color="text.secondary">
                                    Группа: {userToDelete.group}
                                </Typography>
                            )}
                        </Box>
                    )}
                    <Typography color="error" variant="body2">
                        Это действие нельзя отменить. Пользователь будет удалён из системы.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={20} /> : null}
                    >
                        {isDeleting ? 'Удаление...' : 'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Уведомления */}
            <Snackbar
                open={submitStatus !== null}
                autoHideDuration={6000}
                onClose={() => setSubmitStatus(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={submitStatus === 'success' ? 'success' : 'error'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {errorMessage || 'Операция выполнена успешно'}
                </Alert>
            </Snackbar>

            {/* Индикатор загрузки страницы */}
            {isLoading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                    }}
                >
                    <CircularProgress size={60} />
                </Box>
            )}
        </Box>
    );
};

export default ManageUsers;
