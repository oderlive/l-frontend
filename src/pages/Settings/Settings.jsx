// src/components/Settings.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Switch,
    Button,
    FormControlLabel,
    Grid,
    TextField,
    Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    activateAccount,
    verifyTfaCode,
    sendMailForPasswordReset,
    resetTfa,
    enableTfa,
    disableTfa,
    sendMailForTfaSecretReset,
} from '../../features/auth/auth';
import { fetchUserInstitution, selectUserInstitution } from '../../features/users/usersSlice';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUserInstitution);

    // Состояние для активации аккаунта
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Состояние для 2FA
    const [isTfaEnabled, setIsTfaEnabled] = useState(false);
    const [tfaEnableLoading, setTfaEnableLoading] = useState(false);
    const [tfaEnableError, setTfaEnableError] = useState(null);

    // Состояние для верификации 2FA
    const [tfaVerificationLoading, setTfaVerificationLoading] = useState(false);
    const [tfaVerificationError, setTfaVerificationError] = useState(null);

    // Состояние для отправки ссылки на сброс пароля
    const [passwordResetEmail, setPasswordResetEmail] = useState('');
    const [passwordResetEmailLoading, setPasswordResetEmailLoading] = useState(false);
    const [passwordResetEmailError, setPasswordResetEmailError] = useState(null);
    const [passwordResetEmailSuccess, setPasswordResetEmailSuccess] = useState(false);

    // Состояние для сброса настроек 2FA (через учётную запись)
    const [tfaResetLoading, setTfaResetLoading] = useState(false);
    const [tfaResetError, setTfaResetError] = useState(null);

    // Состояния для email и токена активации
    const [userEmail, setUserEmail] = useState('');
    const [activationToken, setActivationToken] = useState('');

    // Состояние для сброса tfa_secret (если забыл 2FA-код)
    const [tfaResetEmailLoading, setTfaResetEmailLoading] = useState(false);
    const [tfaResetEmailError, setTfaResetEmailError] = useState(null);
    const [tfaResetEmailSuccess, setTfaResetEmailSuccess] = useState(false);

    // Обработчик активации аккаунта
    const handleAccountActivation = async () => {
        setLoading(true);
        setError(null);

        if (!userEmail || !activationToken) {
            setError('Заполните все поля');
            setLoading(false);
            return;
        }

        try {
            await dispatch(
                activateAccount({
                    email: userEmail,
                    token: activationToken,
                })
            ).unwrap();
            setError(null);
            setUserEmail('');
            setActivationToken('');
            alert('Аккаунт успешно активирован!');
        } catch (err) {
            setError(err.message || 'Ошибка при активации аккаунта');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Обработчик включения/отключения 2FA
    const handleTfaToggle = async () => {
        setTfaEnableLoading(true);
        setTfaEnableError(null);

        try {
            if (isTfaEnabled) {
                await dispatch(
                    disableTfa({
                        email: user.email,
                        password: user.password,
                    })
                ).unwrap();
            } else {
                if (!user || !user.email || !user.password) {
                    setTfaEnableError('Не удалось получить данные пользователя');
                    return;
                }

                await dispatch(
                    enableTfa({
                        email: user.email,
                        password: user.password,
                    })
                ).unwrap();
            }
            setIsTfaEnabled(!isTfaEnabled);
            setTfaEnableError(null);
        } catch (err) {
            setTfaEnableError(err.message || 'Ошибка при изменении статуса 2FA');
            console.error(err);
        } finally {
            setTfaEnableLoading(false);
        }
    };

    // Обработчик верификации 2FA
    const handleVerifyTfa = async () => {
        setTfaVerificationLoading(true);
        setTfaVerificationError(null);

        try {
            await dispatch(verifyTfaCode({ code: 'ВАШ_КОД_2FA' })).unwrap();
            setTfaVerificationError(null);
            alert('2FA верифицирован!');
        } catch (err) {
            setTfaVerificationError(err.message || 'Ошибка верификации 2FA');
            console.error(err);
        } finally {
            setTfaVerificationLoading(false);
        }
    };

    // Обработчик отправки ссылки для сброса пароля
    const handleSendPasswordResetEmail = async () => {
        setPasswordResetEmailLoading(true);
        setPasswordResetEmailError(null);
        setPasswordResetEmailSuccess(false);

        if (!passwordResetEmail) {
            setPasswordResetEmailError('Введите email');
            setPasswordResetEmailLoading(false);
            return;
        }

        try {
            await dispatch(
                sendMailForPasswordReset({ email: passwordResetEmail })
            ).unwrap();

            setPasswordResetEmailSuccess(true);
            setPasswordResetEmail('');
        } catch (err) {
            setPasswordResetEmailError(err.message || 'Не удалось отправить ссылку');
            console.error(err);
        } finally {
            setPasswordResetEmailLoading(false);
        }
    };

    // Обработчик сброса настроек 2FA (через учётку)
    const handleResetTfaSettings = async () => {
        setTfaResetLoading(true);
        setTfaResetError(null);

        try {
            await dispatch(resetTfa()).unwrap();
            setTfaResetError(null);
            alert('Настройки 2FA сброшены!');
        } catch (err) {
            setTfaResetError(err.message || 'Ошибка сброса настроек 2FA');
            console.error(err);
        } finally {
            setTfaResetLoading(false);
        }
    };

    // ✅ Обработчик отправки письма для сброса tfa_secret (без ввода email)
    const handleSendTfaResetEmail = async () => {
        setTfaResetEmailLoading(true);
        setTfaResetEmailError(null);
        setTfaResetEmailSuccess(false);

        if (!user?.email) {
            setTfaResetEmailError('Email не найден в профиле');
            setTfaResetEmailLoading(false);
            return;
        }

        try {
            await dispatch(sendMailForTfaSecretReset({ email: user.email })).unwrap();
            setTfaResetEmailSuccess(true);
        } catch (err) {
            setTfaResetEmailError(err.message || 'Не удалось отправить ссылку для сброса 2FA');
        } finally {
            setTfaResetEmailLoading(false);
        }
    };

    useEffect(() => {
        dispatch(fetchUserInstitution()).then((action) => {
            if (action.payload?.twoFactorEnabled !== undefined) {
                setIsTfaEnabled(action.payload.twoFactorEnabled);
            }
        });
    }, [dispatch]);

    return (
        <Box
            sx={{
                padding: '20px',
                maxWidth: '600px',
                margin: '0 auto',
            }}
        >
            <Typography variant="h2" align="center" mb={4}>
                Настройки безопасности
            </Typography>

            <Grid container spacing={4}>
                {/* Активация аккаунта */}
                <Grid item xs={12}>
                    <Box mb={3}>
                        <Typography variant="h6">Активация аккаунта</Typography>
                        <TextField
                            label="Email для активации"
                            variant="outlined"
                            fullWidth
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                            type="email"
                        />
                        <TextField
                            label="Активационный токен"
                            variant="outlined"
                            fullWidth
                            value={activationToken}
                            onChange={(e) => setActivationToken(e.target.value)}
                            required
                            type="text"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            onClick={handleAccountActivation}
                            sx={{ mt: 2 }}
                        >
                            Активировать аккаунт
                        </Button>
                        {loading && <Typography color="textSecondary" mt={1}>Идёт активация...</Typography>}
                        {error && <Typography color="error" mt={1}>{error}</Typography>}
                    </Box>
                </Grid>

                {/* Двухфакторная аутентификация */}
                <Grid item xs={12}>
                    <Box mb={3}>
                        <Typography variant="h6">Двухфакторная аутентификация</Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isTfaEnabled}
                                    onChange={handleTfaToggle}
                                    color="primary"
                                    disabled={tfaEnableLoading}
                                />
                            }
                            label={isTfaEnabled ? '2FA включён' : 'Включить 2FA'}
                        />
                        <Box mt={2} display="flex" gap={2}>
                            <Button
                                variant="contained"
                                sx={{ flexGrow: 1 }}
                                disabled={tfaVerificationLoading}
                                onClick={handleVerifyTfa}
                            >
                                {tfaVerificationLoading ? 'Верификация...' : 'Верифицировать 2FA'}
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ flexGrow: 1 }}
                                disabled={tfaResetLoading}
                                onClick={handleResetTfaSettings}
                            >
                                {tfaResetLoading ? 'Сброс...' : 'Сбросить настройки 2FA'}
                            </Button>
                        </Box>
                        {tfaVerificationError && (
                            <Alert severity="error" sx={{ mt: 1 }}>{tfaVerificationError}</Alert>
                        )}
                        {tfaResetError && (
                            <Alert severity="error" sx={{ mt: 1 }}>{tfaResetError}</Alert>
                        )}
                        {tfaEnableError && (
                            <Alert severity="error" sx={{ mt: 1 }}>{tfaEnableError}</Alert>
                        )}
                        {tfaEnableLoading && (
                            <Typography color="textSecondary" mt={1}>Идёт обработка...</Typography>
                        )}
                    </Box>
                </Grid>

                {/* Сброс пароля */}
                <Grid item xs={12}>
                    <Box mb={3}>
                        <Typography variant="h6">Сброс пароля</Typography>

                        <TextField
                            label="Email для сброса пароля"
                            variant="outlined"
                            fullWidth
                            value={passwordResetEmail}
                            onChange={(e) => setPasswordResetEmail(e.target.value)}
                            type="email"
                            sx={{ mb: 2 }}
                            placeholder="user@example.com"
                        />

                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                color="warning"
                                sx={{ flexGrow: 1 }}
                                onClick={() => navigate('/reset-password')}
                            >
                                Сбросить пароль
                            </Button>

                            <Button
                                variant="outlined"
                                sx={{ flexGrow: 1 }}
                                disabled={passwordResetEmailLoading}
                                onClick={handleSendPasswordResetEmail}
                            >
                                {passwordResetEmailLoading ? 'Отправка...' : 'Отправить ссылку'}
                            </Button>
                        </Box>

                        {passwordResetEmailSuccess && (
                            <Alert severity="success" sx={{ mt: 1 }}>
                                Ссылка для сброса пароля отправлена на {passwordResetEmail}
                            </Alert>
                        )}
                        {passwordResetEmailError && (
                            <Alert severity="error" sx={{ mt: 1 }}>{passwordResetEmailError}</Alert>
                        )}
                    </Box>
                </Grid>

                {/* ✅ Сброс 2FA (если забыл код) — улучшенная версия */}
                <Grid item xs={12}>
                    <Box mb={3}>
                        <Typography variant="h6">Забыли 2FA-код?</Typography>
                        <Typography variant="body2" color="textSecondary" mb={2}>
                            Если вы потеряли доступ к приложению для двухфакторной аутентификации, вы можете восстановить доступ.
                        </Typography>

                        <Box display="flex" gap={2} flexDirection="column">
                            <Button
                                variant="contained"
                                color="error"
                                disabled={tfaResetEmailLoading}
                                onClick={handleSendTfaResetEmail}
                                sx={{ alignSelf: 'flex-start' }}
                            >
                                {tfaResetEmailLoading ? 'Отправка...' : 'Выслать ссылку для сброса'}
                            </Button>

                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate('/reset-tfa')}
                                sx={{ alignSelf: 'flex-start' }}
                            >
                                Перейти к сбросу 2FA
                            </Button>
                        </Box>

                        {tfaResetEmailSuccess && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                Ссылка для сброса 2FA отправлена на <strong>{user.email}</strong>. Перейдите по ней, чтобы восстановить доступ.
                            </Alert>
                        )}
                        {tfaResetEmailError && (
                            <Alert severity="error" sx={{ mt: 2 }}>{tfaResetEmailError}</Alert>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
