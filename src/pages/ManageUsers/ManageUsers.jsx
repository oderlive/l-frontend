import React, { useState } from 'react';
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
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import {addUsersBatch} from "../../features/users/usersSlice";

const ManageUsers = () => {
    const dispatch = useDispatch();

    // Начальное состояние одного пользователя
    const initialUser = {
        surname: '',
        name: '',
        patronymic: '',
        role: 'STUDENT',
        email: '',
        age: '',
        group_name: '',
    };

    // Состояние массива пользователей
    const [users, setUsers] = useState([initialUser]);
    const [submitStatus, setSubmitStatus] = useState(null); // success | error
    const [errorMessage, setErrorMessage] = useState('');

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
            .filter((user) => user.name || user.surname || user.email); // фильтр по непустым

        if (preparedUsers.length === 0) {
            setSubmitStatus('error');
            setErrorMessage('Нет данных для отправки.');
            return;
        }

        try {
            await dispatch(addUsersBatch(preparedUsers)).unwrap();
            setSubmitStatus('success');
            setErrorMessage('');
            // Опционально: сбросить форму после успешной отправки
            // setUsers([initialUser]);
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage(
                typeof error === 'string' ? error : 'Ошибка при добавлении пользователей'
            );
        }
    };

    return (
        <Box sx={{ padding: 3, maxWidth: '900px' }}>
            <Typography variant="h5" gutterBottom>
                Управление пользователями
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Добавьте несколько пользователей за один раз. Заполните поля и нажмите "Отправить".
            </Typography>

            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
                {users.map((user, userIndex) => (
                    <Box
                        key={userIndex}
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            padding: 2,
                            marginBottom: 2,
                            position: 'relative',
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
                                    label="Фамилия"
                                    value={user.surname}
                                    onChange={(e) =>
                                        handleUserChange(userIndex, 'surname', e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Имя"
                                    value={user.name}
                                    onChange={(e) =>
                                        handleUserChange(userIndex, 'name', e.target.value)
                                    }
                                    fullWidth
                                    size="small"
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
                                    <InputLabel>Роль</InputLabel>
                                    <Select
                                        value={user.role}
                                        label="Роль"
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
                                    label="Email"
                                    type="email"
                                    value={user.email}
                                    onChange={(e) =>
                                        handleUserChange(userIndex, 'email', e.target.value)
                                    }
                                    fullWidth
                                    size="small"
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
                                    value={user.group_name}
                                    onChange={(e) =>
                                        handleUserChange(userIndex, 'group_name', e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                    placeholder="Например: 8А, Математики-2025"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}

                <Button
                    startIcon={<AddIcon />}
                    onClick={addUser}
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                >
                    Добавить пользователя
                </Button>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        disabled={users.every(
                            (u) => !u.name && !u.surname && !u.email
                        )}
                    >
                        Отправить
                    </Button>

                    {submitStatus === 'success' && (
                        <Chip label="Успешно добавлено!" color="success" variant="outlined" />
                    )}
                    {submitStatus === 'error' && (
                        <Chip label={errorMessage} color="error" variant="outlined" />
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default ManageUsers;
