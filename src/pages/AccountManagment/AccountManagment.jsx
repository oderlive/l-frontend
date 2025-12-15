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
    Modal,
    Alert,
} from '@mui/material';
import { useContext } from 'react';
import { MenuContext } from '../../context/MenuContext';
import { logout, makeAuth, sendMailForPasswordReset, resetPassword } from '../../features/auth/auth.js';
import { useDispatch } from 'react-redux';

const AccountManagement = () => {
    const { setIsProfileModalOpen } = useContext(MenuContext);
    const dispatch = useDispatch();
    const theme = useTheme();

    // Состояние для формы входа
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Состояние для модалки сброса пароля
    const [isPasswordResetModalOpen, setPasswordResetModalOpen] = useState(false);
    const [resetStep, setResetStep] = useState(1); // 1: email, 2: token + password
    const [resetEmail, setResetEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Ошибки и статусы
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileModalOpen(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const authParams = { email, password };
            await dispatch(makeAuth(authParams)).unwrap();
            setIsProfileModalOpen(false);
            setShowLoginForm(false);
            setLoginError('');
        } catch (err) {
            setLoginError('Ошибка аутентификации. Проверьте логин и пароль.');
        }
    };

    // --- Сброс пароля: Шаг 1 — Отправка email ---
    const handleSendResetEmail = async () => {
        setError('');
        setLoading(true);

        if (!resetEmail) {
            setError('Введите email');
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(resetEmail)) {
            setError('Введите корректный email');
            setLoading(false);
            return;
        }

        try {
            await dispatch(sendMailForPasswordReset({ email: resetEmail })).unwrap();
            setResetStep(2); // Переход к шагу 2
            setError('');
        } catch (err) {
            setError(err.message || 'Не удалось отправить письмо. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    // --- Сброс пароля: Шаг 2 — Ввод токена и пароля ---
    const handleResetPassword = async () => {
        setError('');
        setLoading(true);

        if (!resetEmail || !token || !newPassword || !confirmPassword) {
            setError('Заполните все поля');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Пароль должен быть не менее 6 символов');
            setLoading(false);
            return;
        }

        try {
            await dispatch(
                resetPassword({
                    email: resetEmail,
                    reset_password_token: token,
                    new_password: newPassword,
                })
            ).unwrap();

            setSuccess(true);
            // Можно оставить модалку открытой, чтобы показать успех
        } catch (err) {
            setError(err.message || 'Не удалось сбросить пароль');
        } finally {
            setLoading(false);
        }
    };

    // --- Закрытие модалки и сброс состояния ---
    const closeResetModal = () => {
        setPasswordResetModalOpen(false);
        setResetStep(1);
        setResetEmail('');
        setToken('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess(false);
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

            {/* Основное меню */}
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
                // Форма входа
                <Box component="form" onSubmit={handleLogin}>
                    <Typography variant="h6" gutterBottom>
                        Вход в систему
                    </Typography>

                    <FormControl fullWidth>
                        <FormLabel>Логин</FormLabel>
                        <TextField
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            type="email"
                            placeholder="user@example.com"
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel>Пароль</FormLabel>
                        <TextField
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                    </FormControl>

                    {/* Ссылка "Забыли пароль?" */}
                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                            setPasswordResetModalOpen(true);
                            setResetEmail(email); // Подставляем, если уже ввели
                        }}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            p: 0,
                            mb: 2,
                            '&:hover': { bgcolor: 'transparent' },
                        }}
                    >
                        Забыли пароль?
                    </Button>

                    {loginError && (
                        <FormHelperText sx={{ color: 'error.main', mt: 1, mb: 2 }}>
                            {loginError}
                        </FormHelperText>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                            type="button"
                            variant="text"
                            onClick={() => {
                                setShowLoginForm(false);
                                setLoginError('');
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

            {/* 🪄 Модалка: двухшаговый сброс пароля */}
            <Modal open={isPasswordResetModalOpen} onClose={closeResetModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 400 },
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    {success ? (
                        <>
                            <Typography variant="h6" mb={2}>
                                Готово!
                            </Typography>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                Пароль успешно изменён. Теперь можно войти.
                            </Alert>
                            <Box display="flex" justifyContent="flex-end">
                                <Button variant="contained" color="primary" onClick={closeResetModal}>
                                    Закрыть
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            {resetStep === 1 && (
                                <>
                                    <Typography variant="h6" mb={2}>
                                        Восстановление пароля
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mb={3}>
                                        Введите email, на который придёт ссылка для восстановления.
                                    </Typography>

                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        type="email"
                                        placeholder="user@example.com"
                                        autoFocus
                                        error={!!error}
                                        helperText={error}
                                        sx={{ mb: 2 }}
                                    />

                                    <Box display="flex" gap={2} justifyContent="flex-end">
                                        <Button variant="outlined" onClick={closeResetModal}>
                                            Отмена
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={loading}
                                            onClick={handleSendResetEmail}
                                        >
                                            {loading ? 'Отправка...' : 'Отправить'}
                                        </Button>
                                    </Box>
                                </>
                            )}

                            {resetStep === 2 && (
                                <>
                                    <Typography variant="h6" mb={2}>
                                        Сброс пароля
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mb={3}>
                                        Введите токен из письма и новый пароль.
                                    </Typography>

                                    <TextField
                                        label="Токен из письма"
                                        fullWidth
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        margin="normal"
                                        required
                                        error={!!error && !token}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        label="Новый пароль"
                                        type="password"
                                        fullWidth
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        margin="normal"
                                        required
                                        error={!!error && !newPassword}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        label="Подтвердите пароль"
                                        type="password"
                                        fullWidth
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        margin="normal"
                                        required
                                        error={!!error && !confirmPassword}
                                        helperText={error}
                                        sx={{ mb: 2 }}
                                    />

                                    <Box display="flex" gap={2} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            onClick={() => setResetStep(1)}
                                            disabled={loading}
                                        >
                                            Назад
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={loading}
                                            onClick={handleResetPassword}
                                        >
                                            {loading ? 'Сохранение...' : 'Сбросить'}
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default AccountManagement;
