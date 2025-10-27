import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Avatar,
    Typography,
    Grid,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalJoin = ({ isOpen, onClose }) => {
    const [courseCode, setCourseCode] = useState('');

    const handleJoin = () => {
        if (courseCode.length >= 5 && courseCode.length <= 8) {
            console.log('Код курса принят:', courseCode);
            onClose();
        } else {
            alert('Код курса должен быть от 5 до 8 символов.');
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="sm"
            PaperProps={{
                style: {
                    borderRadius: 8,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
            }}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Присоединиться</Typography>
                    <Button
                        size="small"
                        color="inherit"
                        onClick={onClose}
                        sx={{ padding: 0 }}
                    >
                        <CloseIcon />
                    </Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body2">Вы вошли в аккаунт</Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Avatar src="avatar.png" sx={{ mr: 1 }} />
                            <Box>
                                <Typography variant="body1">Артур Артуров</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    test@oiate.ru
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Сменить аккаунт
                        </Button>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Grid item xs={12}>
                        <TextField
                            label="Код курса"
                            variant="outlined"
                            fullWidth
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            helperText="Введите код курса"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Отмена
                </Button>
                <Button
                    onClick={handleJoin}
                    color="primary"
                    disabled={!(courseCode.length >= 5 && courseCode.length <= 8)}
                >
                    Присоединиться
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalJoin;
