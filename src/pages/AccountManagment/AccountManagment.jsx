import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Divider,
    useTheme,
    TextField,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@mui/material';
import { useContext } from 'react';
import { MenuContext } from '../../context/MenuContext';
import { logout, makeAuth } from '../../features/auth/auth.js';
import { useDispatch } from 'react-redux';

const AccountManagement = () => {
    const { setIsProfileModalOpen } = useContext(MenuContext);
    const dispatch = useDispatch();
    const theme = useTheme();

    // Состояние для показа формы входа
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileModalOpen(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const authParams = { email, password };
            await dispatch(makeAuth(authParams)).unwrap(); // Убедись, что makeAuth — async thunk
            setIsProfileModalOpen(false); // Закрываем всё окно после входа
            setShowLoginForm(false);
            setError('');
        } catch (err) {
            setError('Ошибка аутентификации. Проверьте логин и пароль.');
        }
    };

    const handleLoginChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    return (
        <Box
            sx={{
                padding: '24px',
                maxWidth: '400px',
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                borderRadius: 4,
                boxShadow: theme.shadows[2],
            }}
        >
            {/* Заголовок */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                    sx={{
                        mr: 2,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.common.white,
                    }}
                >
                    A
                </Avatar>
                <Typography variant="h5">Авторизация</Typography>
            </Box>

            {/* Основное меню (показываем, если НЕ в режиме формы входа) */}
            {!showLoginForm ? (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Button
                            variant="contained"
                            sx={{ mb: 2, width: '100%' }}
                            onClick={() => setShowLoginForm(true)}
                        >
                            Войти
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ width: '100%' }}
                            onClick={handleLogout}
                        >
                            Выйти
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none' }}
                            onClick={(e) => e.preventDefault()}
                        >
                            Политика конфиденциальности
                        </Button>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none' }}
                            onClick={(e) => e.preventDefault()}
                        >
                            Условия использования
                        </Button>
                    </Box>
                </>
            ) : (
                // Форма входа (вместо основного меню)
                <Box component="form" onSubmit={handleLogin}>
                    <Typography variant="h6" gutterBottom>
                        Вход в систему
                    </Typography>

                    <FormControl fullWidth>
                        <FormLabel>Логин</FormLabel>
                        <TextField
                            value={email}
                            onChange={handleLoginChange}
                            required
                            fullWidth
                            margin="normal"
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel>Пароль</FormLabel>
                        <TextField
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            fullWidth
                            margin="normal"
                        />
                    </FormControl>

                    {error && (
                        <FormHelperText sx={{ color: 'error.main', mt: 1, mb: 2 }}>
                            {error}
                        </FormHelperText>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                            type="button"
                            variant="text"
                            onClick={() => {
                                setShowLoginForm(false);
                                setError('');
                            }}
                            sx={{ flex: 1 }}
                        >
                            Назад
                        </Button>
                        <Button type="submit" variant="contained" sx={{ flex: 1 }}>
                            Войти
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default AccountManagement;
