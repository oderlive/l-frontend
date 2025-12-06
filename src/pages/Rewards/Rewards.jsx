import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import styles from './Rewards.module.css';

const studentRewards = [
    { id: 1, name: 'Активность', points: 120, icon: '⚡' },
    { id: 2, name: 'Помощь', points: 85, icon: '🤝' },
    { id: 3, name: 'Пунктуальность', points: 140, icon: '✅' },
    { id: 4, name: 'Лидерство', points: 95, icon: '🌟' },
    { id: 5, name: 'Творчество', points: 70, icon: '🎨' },
];

const badges = [
    { name: 'Новичок', icon: '🐣', unlocked: true },
    { name: 'Отличник', icon: '🎖️', unlocked: true },
];

const Rewards = () => {
    const handleIssueReward = () => {
        alert('Поощрение успешно начислено!');
    };

    const handleExportReport = () => {
        alert('Отчёт по поощрениям экспортирован в PDF');
    };

    return (
        <Box className={styles.container}>
            {/* Заголовок — чёрный, через className */}
            <Typography variant="h4" className={styles.title}>
                Модуль поощрений
            </Typography>

            {/* Карточка: Баллы */}
            <Paper className={styles.card}>
                {/* Подзаголовок — тоже чёрный */}
                <Typography variant="h6" gutterBottom sx={{ color: '#1a1a1a' }}>
                    Баллы учеников
                </Typography>
                <Box>
                    {studentRewards.map((reward) => (
                        <Box
                            key={reward.id}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                            p={1}
                            sx={{ backgroundColor: '#e3f2fd', borderRadius: 1 }}
                        >
                            <Typography variant="body1">
                                {reward.icon} {reward.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                +{reward.points} баллов
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Button
                    variant="contained"
                    className={styles.button}
                    onClick={handleIssueReward}
                    size="small"
                >
                    Начислить поощрение
                </Button>
            </Paper>

            {/* Карточка: Достижения */}
            <Paper className={styles.card}>
                <Typography variant="h6" gutterBottom sx={{ color: '#1a1a1a' }}>
                    Достижения и бейджи
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                    Награды, доступные ученикам
                </Typography>
                <Box className={styles.badgeList}>
                    {badges.map((badge, index) => (
                        <Box
                            key={index}
                            className={styles.badge}
                            sx={{
                                opacity: badge.unlocked ? 1 : 0.5,
                                filter: badge.unlocked ? 'none' : 'grayscale(70%)',
                            }}
                        >
                            <img
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${badge.name}`}
                                alt={badge.name}
                                style={{ borderRadius: '50%' }}
                            />
                            <Typography variant="caption">{badge.name}</Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>

            {/* Кнопка экспорта */}
            <Button
                variant="outlined"
                color="primary"
                onClick={handleExportReport}
                className={styles.button}
                sx={{
                    backgroundColor: 'transparent',
                    color: '#1976d2',
                    '&:hover': { backgroundColor: '#bbdefb' },
                }}
            >
                Экспортировать отчёт
            </Button>
        </Box>
    );
};

export default Rewards;
