// src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Container,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../features/auth/auth';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        if (!email || !token || !newPassword || !confirmPassword) {
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
                    email,
                    reset_password_token: token,
                    new_password: newPassword,
                })
            ).unwrap();

            setSuccess(true);
            setEmail('');
            setToken('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.message || 'Не удалось сбросить пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    p: 4,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                }}
            >
                <Typography variant="h4" align="center" mb={3}>
                    Сброс пароля
                </Typography>

                {success ? (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Пароль успешно изменён Теперь можно войти.
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Токен из письма"
                            fullWidth
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Новый пароль"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Подтвердите пароль"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                            required
                        />

                        {error && <Alert severity="error" sx={{ mt: 3, mb: 2 }}>{error}</Alert>}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3 }}
                        >
                            {loading ? 'Сохранение...' : 'Сбросить пароль'}
                        </Button>
                    </form>
                )}

                <Box mt={3} textAlign="center">
                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => navigate('/login')}
                    >
                        Войти
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ResetPasswordPage;
