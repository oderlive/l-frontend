import React from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Divider,
    useTheme
} from '@mui/material';
import { useContext } from 'react';
import { MenuContext } from '../../context/MenuContext';
import { logout } from '../../features/auth/auth.js';
import { useDispatch } from 'react-redux';

const AccountManagement = () => {
    const { setIsProfileModalOpen } = useContext(MenuContext);
    const dispatch = useDispatch();
    const theme = useTheme();

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileModalOpen(false);
    };

    return (
        <Box
            sx={{
                padding: '24px',
                maxWidth: '400px',
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                borderRadius: 4,
                boxShadow: theme.shadows[2]
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3
                }}
            >
                <Avatar
                    sx={{
                        mr: 2,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.common.white
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
                    onClick={() => setIsProfileModalOpen(false)}
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
                    gap: 1
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
        </Box>
    );
};

export default AccountManagement;
