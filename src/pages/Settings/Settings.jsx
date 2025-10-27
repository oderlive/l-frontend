import React, { useState } from 'react';
import {
    Box,
    Typography,
    Switch,
    Button,
    FormControlLabel,
    Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    activateAccount,
    verifyTfaCode,
    resetPassword,
    sendMailForPasswordReset,
    resetTfa,
    enableTfa,
    disableTfa
} from '../../features/auth/auth';

const Settings = () => {
    const dispatch = useDispatch();

    // Состояние для активации аккаунта
    const [isAccountActive, setIsAccountActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Состояние для 2FA
    const [isTfaEnabled, setIsTfaEnabled] = useState(false);
    const [tfaEnableLoading, setTfaEnableLoading] = useState(false);
    const [tfaEnableError, setTfaEnableError] = useState(null);

    // Состояние для верификации 2FA
    const [tfaVerificationLoading, setTfaVerificationLoading] = useState(false);
    const [tfaVerificationError, setTfaVerificationError] = useState(null);

    // Состояние для сброса пароля
    const [passwordResetLoading, setPasswordResetLoading] = useState(false);
    const [passwordResetError, setPasswordResetError] = useState(null);

    // Состояние для отправки ссылки на email
    const [passwordResetEmailLoading, setPasswordResetEmailLoading] = useState(false);
    const [passwordResetEmailError, setPasswordResetEmailError] = useState(null);

    // Состояние для сброса настроек 2FA
    const [tfaResetLoading, setTfaResetLoading] = useState(false);
    const [tfaResetError, setTfaResetError] = useState(null);

    // Обработчик активации аккаунта
    const handleAccountActivation = async () => {
        setLoading(true);
        setError(null);

        try {
            await dispatch(activateAccount({ isActive: !isAccountActive }));
            setIsAccountActive(!isAccountActive);
            setError(null);
        } catch (err) {
            setError('Ошибка при активации аккаунта');
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
                await dispatch(disableTfa());
            } else {
                await dispatch(enableTfa());
            }
            setIsTfaEnabled(!isTfaEnabled);
            setTfaEnableError(null);
        } catch (err) {
            setTfaEnableError('Ошибка при изменении статуса 2FA');
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
            await dispatch(verifyTfaCode({ code: 'ВАШ_КОД_2FA' }));
            setTfaVerificationError(null);
            alert('2FA верифицирован!');
        } catch (err) {
            setTfaVerificationError('Ошибка верификации 2FA');
            console.error(err);
        } finally {
            setTfaVerificationLoading(false);
        }
    };

    // Обработчик сброса пароля
    const handleResetPassword = async () => {
        setPasswordResetLoading(true);
        setPasswordResetError(null);

        try {
            await dispatch(resetPassword({ password: 'НОВЫЙ_ПАРОЛЬ' }));
            setPasswordResetError(null);
            alert('Пароль сброшен!');
        } catch (err) {
            setPasswordResetError('Ошибка сброса пароля');
            console.error(err);
        } finally {
            setPasswordResetLoading(false);
        }
    };

// Обработчик отправки ссылки на email
    const handleSendPasswordResetEmail = async () => {
        setPasswordResetEmailLoading(true);
        setPasswordResetEmailError(null);

        try {
            await dispatch(sendMailForPasswordReset({ email: 'EMAIL_ПОЛЬЗОВАТЕЛЯ' }));
            setPasswordResetEmailError(null);
            alert('Ссылка для сброса пароля отправлена на email!');
        } catch (err) {
            setPasswordResetEmailError('Ошибка отправки ссылки');
            console.error(err);
        } finally {
            setPasswordResetEmailLoading(false);
        }
    };

// Обработчик сброса настроек 2FA
    const handleResetTfaSettings = async () => {
        setTfaResetLoading(true);
        setTfaResetError(null);

        try {
            await dispatch(resetTfa());
            setTfaResetError(null);
            alert('Настройки 2FA сброшены!');
        } catch (err) {
            setTfaResetError('Ошибка сброса настроек 2FA');
            console.error(err);
        } finally {
            setTfaResetLoading(false);
        }
    };

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
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isAccountActive}
                                    onChange={() => handleAccountActivation()}
                                    color="primary"
                                    disabled={loading}
                                />
                            }
                            label="Аккаунт активен"
                        />
                        <Box mt={1}>
                            {loading && <Typography color="gray">Идет активация...</Typography>}
                            {error && <Typography color="error">{error}</Typography>}
                            {isAccountActive && !error && (
                                <Typography color="success">Аккаунт активен</Typography>
                            )}
                            {!isAccountActive && !error && (
                                <Typography color="warning">Аккаунт деактивирован</Typography>
                            )}
                        </Box>
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
                            label="Включить 2FA"
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
                            <Typography color="error" mt={1}>{tfaVerificationError}</Typography>
                        )}
                        {tfaResetError && (
                            <Typography color="error" mt={1}>{tfaResetError}</Typography>
                        )}
                        {tfaEnableError && (
                            <Typography color="error" mt={1}>{tfaEnableError}</Typography>
                        )}
                        {tfaEnableLoading && (
                            <Typography color="gray" mt={1}>Идет обработка...</Typography>
                        )}
                    </Box>
                </Grid>

                {/* Сброс пароля */}
                <Grid item xs={12}>
                    <Box mb={3}>
                        <Typography variant="h6">Сброс пароля</Typography>
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                sx={{ flexGrow: 1 }}
                                disabled={passwordResetLoading}
                                onClick={handleResetPassword}
                            >
                                {passwordResetLoading ? 'Сброс...' : 'Сбросить пароль'}
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ flexGrow: 1 }}
                                disabled={passwordResetEmailLoading}
                                onClick={handleSendPasswordResetEmail}
                            >
                                {passwordResetEmailLoading ? 'Отправка...' : 'Отправить ссылку на email'}
                            </Button>
                        </Box>
                        {passwordResetError && (
                            <Typography color="error" mt={1}>{passwordResetError}</Typography>
                        )}
                        {passwordResetEmailError && (
                            <Typography color="error" mt={1}>{passwordResetEmailError}</Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
