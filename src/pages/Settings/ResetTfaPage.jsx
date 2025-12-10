// src/pages/ResetTfaPage.jsx
import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Alert,
    Container,
    CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {resetTfa} from "../../features/auth/auth";
import {selectAuth} from "../../features/auth/authSlice";

const ResetTfaPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // ✅ Используем селектор из authSlice
    const { loading: resetTfaLoading, error: resetTfaError, isLoggedIn } = useSelector(selectAuth);

    // Извлекаем параметры из URL
    const email = searchParams.get('user_email');
    const token = searchParams.get('token');

    // ✅ Устанавливаем флаг успеха вручную, так как в слайсе нет отдельного поля
    const resetTfaSuccess = !resetTfaLoading && !resetTfaError && !isLoggedIn;

    useEffect(() => {
        // Если email и token есть — отправляем запрос
        if (email && token) {
            dispatch(resetTfa({ email, token }));
        }
    }, [dispatch, email, token]);

    // Если параметры отсутствуют
    if (!email || !token) {
        return (
            <Container maxWidth="sm">
                <Alert severity="error" sx={{ mt: 4 }}>
                    Неверная ссылка. Отсутствуют параметры <code>user_email</code> или <code>token</code>.
                </Alert>
            </Container>
        );
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
                <Typography variant="h5" mb={3}>
                    Сброс 2FA
                </Typography>

                {/* Загрузка */}
                {resetTfaLoading && (
                    <Box display="flex" justifyContent="center" alignItems="center" mt={2} mb={2}>
                        <CircularProgress size={28} />
                        <Typography variant="body1" ml={2}>
                            Сбрасываем 2FA...
                        </Typography>
                    </Box>
                )}

                {/* Успех */}
                {resetTfaSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        <Typography>
                            <strong>Успешно!</strong> Двухфакторная аутентификация была сброшена.
                        </Typography>
                        <Typography variant="body2" mt={1}>
                            Теперь можно{' '}
                            <strong
                                onClick={() => navigate('/login')}
                                style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
                            >
                                войти
                            </strong>
                            .
                        </Typography>
                    </Alert>
                )}

                {/* Ошибка */}
                {resetTfaError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        <Typography>
                            <strong>Ошибка:</strong> {resetTfaError}
                        </Typography>
                        <Typography variant="body2" mt={1}>
                            Попробуйте запросить новую ссылку или обратитесь в поддержку.
                        </Typography>
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default ResetTfaPage;
