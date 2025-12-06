import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import styles from './Statistics.module.css';

// 🔽 Регистрируем нужные компоненты Chart.js
ChartJS.register(
    CategoryScale,    // ← для оси X (категории: "Математика", "Неделя 1" и т.д.)
    LinearScale,      // ← для оси Y (числовые значения)
    BarElement,       // ← для столбчатой диаграммы
    LineElement,      // ← для линий
    PointElement,     // ← для точек на линии
    Title,
    Tooltip,
    Legend
);

const Statistics = () => {
    const barData = {
        labels: ['Математика', 'Русский', 'Физика', 'Информатика', 'Химия'],
        datasets: [
            {
                label: 'Средний балл (4.36 из 5)',
                data: [4.3, 4.7, 3.9, 4.8, 4.1],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const lineData = {
        labels: ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4', 'Неделя 5'],
        datasets: [
            {
                label: 'Средний балл за неделю',
                data: [3.8, 4.0, 4.1, 4.3, 4.5],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.4)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.3,
                borderWidth: 2,
            },
        ],
    };

    const handleGenerateReport = () => {
        alert('Формирование отчёта об успеваемости начато...');
    };

    return (
        <Box className={styles.container}>
            <Typography variant="h4" className={styles.title}>
                Статистика успеваемости
            </Typography>

            {/* График: Успеваемость по предметам */}
            <Paper className={styles.chartBox}>
                <Typography variant="h6" gutterBottom>
                    Успеваемость по предметам
                </Typography>
                <Bar data={barData} />
            </Paper>

            {/* График: Динамика */}
            <Paper className={styles.chartBox}>
                <Typography variant="h6" gutterBottom>
                    Динамика успеваемости
                </Typography>
                <Line data={lineData} />
            </Paper>

            {/* Кнопка */}
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleGenerateReport}
                className={styles.button}
            >
                Сформировать отчёт об успеваемости
            </Button>
        </Box>
    );
};

export default Statistics;
