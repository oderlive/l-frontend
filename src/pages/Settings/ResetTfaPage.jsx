
// src/pages/ResetTfaFormPage.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Alert,
    Container,
    Button,
    CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetTfa } from '../../features/auth/auth';
import { selectAuth } from '../../features/auth/authSlice';

const ResetTfaPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Получаем данные из предыдущей страницы
    const { email, code } = location.state || {};
    const { loading: resetLoading, error: resetError } = useSelector(selectAuth);

    const [submitAttempted, setSubmitAttempted] = useState(false);

    // Проверка, что данные переданы
    useEffect(() => {
        if (!email || !code) {
            navigate('/settings', { replace: true });
        }
    }, [email, code, navigate]);

    const handleSubmit = async () => {
        setSubmitAttempted(true);

        if (!email || !code) return;

        try {
            // Шаг 1: Сброс 2FA по коду
            await dispatch(resetTfa({ code })).unwrap();


            alert('2FA успешно сброшен. Теперь можно войти.');
            navigate('/login');
        } catch (err) {
            console.error('Ошибка сброса 2FA:', err);
        }
    };

    if (!email || !code) {
        return null; // Редирект уже произошёл
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    p: 4,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" mb={2}>
                    Подтверждение сброса 2FA
                </Typography>

                <Typography variant="body1" color="textSecondary" mb={3}>
                    Вы уверены, что хотите сбросить двухфакторную аутентификацию для:
                </Typography>

                <Typography variant="body1">
                    <strong>Email:</strong> {email}
                </Typography>

                <Typography variant="body2" color="textSecondary" mt={1}>
                    Код уже введён и проверен.
                </Typography>

                <Box mt={3}>
                    <Button
                        variant="contained"
                        color="error"
                        disabled={resetLoading}
                        onClick={handleSubmit}
                        sx={{ mr: 2 }}
                    >
                        {resetLoading ? <CircularProgress size={24} /> : 'Да, сбросить'}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate('/settings')}
                    >
                        Назад
                    </Button>
                </Box>

                {resetError && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                        <strong>Ошибка:</strong> {resetError}
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default ResetTfaPage;
