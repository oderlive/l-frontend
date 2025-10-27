import React from 'react';
import {
    Box,
    Typography,
    Switch,
    Button,
    FormControlLabel,
    Grid
} from '@mui/material';
//import { useTheme } from '@mui/material/styles';

const Settings = () => {
    //const theme = useTheme();

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
                            control={<Switch />}
                            label="Аккаунт активен"
                        />
                    </Box>
                </Grid>

                {/* Двухфакторная аутентификация */}
                <Grid item xs={12}>
                    <Box mb={3}>
                        <Typography variant="h6">Двухфакторная аутентификация</Typography>
                        <FormControlLabel
                            control={<Switch />}
                            label="Включить 2FA"
                        />
                        <Box mt={2} display="flex" gap={2}>
                            <Button
                                variant="contained"
                                sx={{ flexGrow: 1 }}
                            >
                                Верифицировать 2FA
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ flexGrow: 1 }}
                            >
                                Сбросить настройки 2FA
                            </Button>
                        </Box>
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
                            >
                                Сбросить пароль
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ flexGrow: 1 }}
                            >
                                Отправить ссылку на email
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
