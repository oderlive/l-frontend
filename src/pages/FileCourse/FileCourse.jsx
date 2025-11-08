import React, { useState } from 'react';
import {
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button
} from '@mui/material';
import styles from './FileCourse.module.css';

const FileCourse = () => {
    const [filters, setFilters] = useState({
        type: '',
        people: '',
        changed: '',
        source: ''
    });

    const files = [
        { name: '1.ИС-M25.ipynb', owner: 'test', modifiedDate: '10.05.2023', size: '567 КБ' },
        { name: '11.ИС-M25.ipynb', owner: 'test', modifiedDate: '15.05.2023', size: '678 КБ' },
        { name: 'DataFrame.ipynb', owner: 'Неизвестно', modifiedDate: '20.05.2023', size: '345 КБ' },
        { name: 'Sprott_S.ipynb', owner: 'Неизвестно', modifiedDate: '25.05.2023', size: '789 КБ' }
    ];

    const handleFilterChange = (field) => (event) => {
        setFilters({
            ...filters,
            [field]: event.target.value
        });
    };

    return (
        <div className={styles.fileCourseContainer}>
            <div className={styles.headerFilters}>
                <div className={styles.filterGroup}>
                    <FormControl variant="outlined" size="small">
                        <InputLabel>Тип</InputLabel>
                        <Select
                            value={filters.type}
                            onChange={handleFilterChange('type')}
                            label="Тип"
                            sx={{ minWidth: 140 }}
                        >
                            <MenuItem value="">
                                <em>Все</em>
                            </MenuItem>
                            <MenuItem value="ipynb">Jupyter Notebook (.ipynb)</MenuItem>
                            <MenuItem value="py">Python (.py)</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" size="small">
                        <InputLabel>Владелец</InputLabel>
                        <Select
                            value={filters.people}
                            onChange={handleFilterChange('people')}
                            label="Владелец"
                            sx={{ minWidth: 140 }}
                        >
                            <MenuItem value="">
                                <em>Все</em>
                            </MenuItem>
                            <MenuItem value="test">test</MenuItem>
                            <MenuItem value="unknown">Неизвестно</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className={styles.filterGroup}>
                    <FormControl variant="outlined" size="small">
                        <InputLabel>Дата изменения</InputLabel>
                        <Select
                            value={filters.changed}
                            onChange={handleFilterChange('changed')}
                            label="Дата изменения"
                            sx={{ minWidth: 160 }}
                        >
                            <MenuItem value="">
                                <em>Все</em>
                            </MenuItem>
                            <MenuItem value="recent">Последние 7 дней</MenuItem>
                            <MenuItem value="month">Последний месяц</MenuItem>
                            <MenuItem value="older">Старше месяца</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" size="small">
                        <InputLabel>Источник</InputLabel>
                        <Select
                            value={filters.source}
                            onChange={handleFilterChange('source')}
                            label="Источник"
                            sx={{ minWidth: 140 }}
                        >
                            <MenuItem value="">
                                <em>Все</em>
                            </MenuItem>
                            <MenuItem value="local">Локальный</MenuItem>
                            <MenuItem value="cloud">Облако</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    className={styles.sortBtn}
                    onClick={() => console.log('Сортировка')}
                >
                    Сортировка
                </Button>
            </div>

            <table className={styles.fileTable}>
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Владелец</th>
                    <th>Дата изменения</th>
                    <th>Размер файла</th>
                </tr>
                </thead>
                <tbody>
                {files.map((file, index) => (
                    <tr key={index}>
                        <td>
                            <span className={styles.fileIcon}>📄</span>
                            {file.name}
                        </td>
                        <td>{file.owner}</td>
                        <td>{file.modifiedDate}</td>
                        <td>{file.size}</td>
                        <td className={styles.actions}>• • •</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default FileCourse;
