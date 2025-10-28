import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Divider,
    useTheme,
    Modal,
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

    // Состояние для модального окна
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileModalOpen(false);
    };

    // Обработчик отправки формы входа
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const authParams = { email, password };
            await dispatch(makeAuth(authParams));
            setOpenLoginModal(false); // Закрываем модальное окно после успешной аутентификации
            setError('');
        } catch (err) {
            setError('Ошибка аутентификации. Проверьте логин и пароль.');
        }
    };

    // Обработчики ввода
    const handleLoginChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    // Стили для модального окна
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #000',
        boxShadow: theme.shadows[5],
        padding: '20px',
    };

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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                }}
            >
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

            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    sx={{ mb: 2, width: '100%' }}
                    onClick={() => setOpenLoginModal(true)} // Открываем модальное окно
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

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
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

            {/* Модальное окно входа */}
            <Modal
                open={openLoginModal}
                onClose={() => setOpenLoginModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" gutterBottom>
                        Вход в систему
                    </Typography>
                    <form onSubmit={handleLogin}>
                        <FormControl>
                            <FormLabel>Логин</FormLabel>
                            <TextField
                                value={email}
                                onChange={handleLoginChange}
                                required
                                fullWidth
                            />
                        </FormControl>
                        <FormControl sx={{ mt: 2 }}>
                            <FormLabel>Пароль</FormLabel>
                            <TextField
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                fullWidth
                            />
                        </FormControl>
                        {error && (
                            <FormHelperText sx={{ color: 'error.main' }}>{error}</FormHelperText>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2, width: '100%' }}
                        >
                            Войти
                        </Button>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
};

export default AccountManagement;
