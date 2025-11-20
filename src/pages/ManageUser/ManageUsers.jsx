import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import styles from './ManageUsers.module.css';
import {addUsersBatch} from "../../features/users/users";

const AddUsersForm = () => {
    const dispatch = useDispatch();

    // Состояние для формы (один пользователь, но можно расширить для множественного ввода)
    const [user, setUser] = useState({
        surname: '',
        name: '',
        patronymic: '',
        role: 'STUDENT',
        email: '',
        age: '',
        group_name: '',
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Валидация
        if (!user.surname || !user.name || !user.email || !user.age) {
            setError('Заполните все обязательные поля');
            return;
        }

        try {
            // Отправляем массив пользователей (даже если один)
            await dispatch(addUsersBatch([user]));
            setSuccess(true);
            setUser({
                surname: '',
                name: '',
                patronymic: '',
                role: 'STUDENT',
                email: '',
                age: '',
                group_name: '',
            });
        } catch (err) {
            setError(err.message || 'Ошибка при добавлении пользователя');
        }
    };

    return (
        <Box className={styles.container}>
            <Typography variant="h5" className={styles.title}>
                Добавить нового пользователя
            </Typography>

            {success && (
                <Typography color="success" className={styles.successMsg}>
                    Пользователь успешно добавлен!
                </Typography>
            )}

            {error && (
                <Typography color="error" className={styles.errorMsg}>
                    {error}
                </Typography>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Фамилия"
                            name="surname"
                            value={user.surname}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Имя"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Отчество"
                            name="patronymic"
                            value={user.patronymic}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Роль</InputLabel>
                            <Select
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                            >
                                <MenuItem value="STUDENT">Студент</MenuItem>
                                <MenuItem value="TUTOR">Преподаватель</MenuItem>
                                <MenuItem value="ADMIN">Администратор</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Электронная почта"
                            name="email"
                            type="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Возраст"
                            name="age"
                            type="number"
                            value={user.age}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Название группы"
                            name="group_name"
                            value={user.group_name}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.submitButton}
                >
                    Добавить пользователя
                </Button>
            </form>
        </Box>
    );
};

export default AddUsersForm;
