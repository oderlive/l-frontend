import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Button,
    TextField,
    Select,
    MenuItem,
    Typography,
    Box,
    CircularProgress,
    Modal as MuiModal,
    Backdrop
} from '@mui/material';
import {
    HomeOutlined,
    ArrowDropDown,
    ArrowDropUp,
    Add as AddIcon
} from '@mui/icons-material';

import styles from './Menu.module.css';
import { useNavigate } from 'react-router-dom';
import { createInstitution } from '../../features/institutions/institutions';
import {addGroup, deleteGroup} from "../../features/group/group";

const mockData = [
    {
        id: 1,
        name: 'Учебное заведение 1',
        groups: [
            {
                id: 11,
                name: 'Группа A',
                courses: [
                    { id: 111, name: 'Курс 1' },
                    { id: 112, name: 'Курс 2' }
                ],
            },
            {
                id: 12,
                name: 'Группа B',
                courses: [
                    { id: 121, name: 'Курс 3' },
                    { id: 122, name: 'Курс 4' }
                ],
            },
        ],
    },
    {
        id: 2,
        name: 'Учебное заведение 2',
        groups: [
            {
                id: 21,
                name: 'Группа C',
                courses: [
                    { id: 211, name: 'Курс 5' },
                    { id: 212, name: 'Курс 6' }
                ],
            },
        ],
    },
];

const Menu = ({ setSelectedComponent }) => {
    const [expandedInstitutions, setExpandedInstitutions] = useState({});
    const [expandedGroups, setExpandedGroups] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        location: '',
        short_name: '',
        full_name: '',
        institution_type: 'SCHOOL',
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Состояние для работы с группами
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [groupFormData, setGroupFormData] = useState({ name: '' });
    const [groupError, setGroupError] = useState(null);
    const [groupLoading, setGroupLoading] = useState(false);
    const institutionId = mockData[0].id; // ID учебного заведения для API-запросов

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleInstitution = (id) => {
        setExpandedInstitutions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const toggleGroup = (id) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const resultAction = await dispatch(createInstitution(formData));

            if (createInstitution.fulfilled.match(resultAction)) {
                alert('Учебное заведение успешно создано!');
                setIsModalOpen(false);
                setFormData({
                    email: '',
                    location: '',
                    short_name: '',
                    full_name: '',
                    institution_type: 'SCHOOL',
                });
            } else {
                setError(resultAction.error.message || 'Ошибка при создании');
            }
        } catch (err) {
            setError('Произошла ошибка сети');
        } finally {
            setIsLoading(false);
        }
    };

    // Добавление группы (POST /groups)
    const handleAddGroup = async (e) => {
        e.preventDefault();
        setGroupLoading(true);
        setGroupError(null);

        try {
            const newGroup = await addGroup(institutionId, groupFormData);
            // Обновляем mockData (не делаем повторный запрос к API)
            mockData[0].groups.push(newGroup);
            setIsAddingGroup(false);
            setGroupFormData({ name: '' });
            alert('Группа успешно добавлена!');
        } catch (error) {
            setGroupError(error.message || 'Ошибка при добавлении группы');
        } finally {
            setGroupLoading(false);
        }
    };

    // Удаление группы (DELETE /groups/{id})
    const handleDeleteGroup = async (groupId) => {
        setGroupLoading(true);
        try {
            await deleteGroup(groupId);
            // Удаляем группу из mockData
            mockData[0].groups = mockData[0].groups.filter(group => group.id !== groupId);
            alert('Группа удалена!');
        } catch (error) {
            setGroupError(error.message || 'Ошибка при удалении группы');
        } finally {
            setGroupLoading(false);
        }
    };

    return (
        <div className={styles.menu}>
            {/* Заголовок */}
            <div className={styles.header}>
        <span
            className={styles.title}
            onClick={() => navigate('/')}
        >
          <Button startIcon={<HomeOutlined />} size="small">
            Главная страница
          </Button>
        </span>
            </div>

            {/* Список учреждений */}
            {mockData.map((inst) => (
                <div key={inst.id}>
                    <div
                        className={styles.item}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={() => toggleInstitution(inst.id)}
                    >
                        {expandedInstitutions[inst.id] ? <ArrowDropUp /> : <ArrowDropDown />}
                        <Typography variant="body1">{inst.name}</Typography>
                    </div>

                    {expandedInstitutions[inst.id] &&
                        inst.groups.map((group) => (
                            <div key={group.id} style={{ paddingLeft: '32px' }}>
                                <div
                                    className={styles.item}
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    onClick={() => toggleGroup(group.id)}
                                >
                                    {expandedGroups[group.id] ? <ArrowDropUp /> : <ArrowDropDown />}
                                    <Typography variant="body2">{group.name}</Typography>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteGroup(group.id)}
                                    >
                                        Удалить
                                    </Button>
                                </div>

                                {expandedGroups[group.id] &&
                                    group.courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className={styles.item}
                                            style={{ paddingLeft: '48px', cursor: 'pointer' }}
                                            onClick={() => setSelectedComponent(course.name)}
                                        >
                                            <Typography variant="body2">{course.name}</Typography>
                                        </div>
                                    ))}
                            </div>
                        ))}
                </div>
            ))}

            {/* Кнопка открытия модального окна для заведения */}
            <Box mt={2} ml={1}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Добавить учебное заведение
                </Button>
            </Box>

            {/* Модальное окно для заведения */}
            <MuiModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Создать учебное заведение
                    </Typography>

                    {error && (
                        <Typography color="error" variant="body2" mb={2}>
                            {error}
                        </Typography>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            margin="normal"
                            size="small"
                        />

                        <TextField
                            fullWidth
                            label="Местоположение"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                            margin="normal"
                            size="small"
                        />

                        <TextField
                            fullWidth
                            label="Короткое название"
                            name="short_name"
                            value={formData.short_name}
                            onChange={handleInputChange}
                            required
                            margin="normal"
                            size="small"
                        />

                        <TextField
                            fullWidth
                            label="Полное название"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            required
                            margin="normal"
                            size="small"
                        />

                        <Select
                            fullWidth
                            value={formData.institution_type}
                            onChange={handleInputChange}
                            name="institution_type"
                            displayEmpty
                            margin="normal"
                            size="small"
                        >
                            <MenuItem value="SCHOOL">Школа</MenuItem>
                            <MenuItem value="COLLEGE">Колледж</MenuItem>
                            <MenuItem value="UNIVERSITY">Университет</MenuItem>
                            <MenuItem value="OTHER">Другое</MenuItem>
                        </Select>

                        <Box mt={3} display="flex" gap={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                            >
                                {isLoading ? 'Создаётся...' : 'Создать'}
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Отмена
                            </Button>
                        </Box>
                    </form>
                </Box>
            </MuiModal>

            {/* Кнопка добавления группы */}
            <Box mt={2} ml={1}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddingGroup(true)}
                >
                    Добавить группу
                </Button>
            </Box>

            {/* Модальное окно для добавления группы */}
            <MuiModal
                open={isAddingGroup}
                onClose={() => setIsAddingGroup(false)}
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Создать группу
                    </Typography>

                    {groupError && (
                        <Typography color="error" variant="body2" mb={2}>
                            {groupError}
                        </Typography>
                    )}

                    <form onSubmit={handleAddGroup}>
                        <TextField
                            fullWidth
                            label="Название группы"
                            name="name"
                            value={groupFormData.name}
                            onChange={(e) => setGroupFormData({ name: e.target.value })}
                            required
                            margin="normal"
                            size="small"
                        />

                        <Box mt={3} display="flex" gap={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={groupLoading}
                                startIcon={groupLoading ? <CircularProgress size={20} /> : null}
                            >
                                {groupLoading ? 'Создаётся...' : 'Создать'}
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => setIsAddingGroup(false)}
                            >
                                Отмена
                            </Button>
                        </Box>
                    </form>
                </Box>
            </MuiModal>
        </div>
    );
};

export default Menu;
