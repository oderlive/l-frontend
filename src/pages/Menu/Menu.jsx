import React, { useState, useEffect } from 'react';
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
    Add as AddIcon,
    Refresh as RefreshIcon,
    School as SchoolIcon,
    GroupAdd as GroupAddIcon
} from '@mui/icons-material';

import styles from './Menu.module.css';
import { useNavigate } from 'react-router-dom';
import { createInstitution, fetchInstitutions } from '../../features/institutions/institutions';
import { getUserInstitution } from '../../features/users/users';
import { createGroup, createGroupsBatch, fetchGroupsByInstitution } from '../../features/group/groupsSlice';

const Menu = ({ setSelectedComponent }) => {
    const [institutions, setInstitutions] = useState([]);
    const [expandedInstitutions, setExpandedInstitutions] = useState({});
    const [allGroups, setAllGroups] = useState([]); // Все группы пользователя
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false); // Модалка для одной группы
    const [isGroupsModalOpen, setIsGroupsModalOpen] = useState(false); // Модалка для нескольких групп
    const [groupName, setGroupName] = useState(''); // Название группы (одна)
    const [groupNames, setGroupNames] = useState(''); // Названия групп (несколько, через запятую)

    const [formData, setFormData] = useState({
        email: '',
        location: '',
        short_name: '',
        full_name: '',
        institution_type: 'SCHOOL',
        access_token: localStorage.getItem('access_token'),
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Загрузка учреждений
    const loadInstitutions = async () => {
        setFetchLoading(true);
        setError(null);
        try {
            console.log('[Menu] Начинаем загрузку учреждений...');
            const userAction = await dispatch(getUserInstitution());

            if (userAction.meta?.requestStatus !== 'fulfilled') {
                throw new Error(userAction.error?.message || 'Не удалось загрузить данные пользователя');
            }

            const userData = userAction.payload;
            console.log('[Menu] Данные пользователя:', userData);

            const institutionId = userData.institution?.id;
            console.log('[Menu] Извлечён institutionId:', institutionId);

            if (!institutionId) {
                throw new Error('institution.id не найден в данных пользователя');
            }

            const institutionsAction = await dispatch(fetchInstitutions(institutionId));

            if (institutionsAction.meta?.requestStatus !== 'fulfilled') {
                throw new Error(institutionsAction.error?.message || 'Не удалось загрузить учреждения');
            }

            const resultAction = institutionsAction.payload;
            console.log('[Menu] Учреждения загружены:', resultAction);
            setInstitutions([resultAction]);


            await loadGroupsForInstitutions([resultAction]);
        } catch (err) {
            setError(err.message || 'Произошла ошибка при загрузке учреждений');
            console.error('[Menu] Ошибка загрузки:', err);
        } finally {
            setFetchLoading(false);
        }
    };


    // Загрузка всех групп пользователя
    const loadGroupsForInstitutions = async (institutionsList) => {
        try {
            const institutionIds = institutionsList.map(inst => inst.id);
            const groupsPromises = institutionIds.map(id =>
                dispatch(fetchGroupsByInstitution(id))
            );

            const groupsActions = await Promise.all(groupsPromises);

            // Фильтруем только валидные действия с meta
            const allGroupsFlattened = groupsActions
                .filter(action =>
                    action && // Проверяем, что action существует
                    action.meta && // Проверяем наличие meta
                    action.meta.requestStatus === 'fulfilled'
                )
                .map(action => action.payload)
                .flat();

            setAllGroups(allGroupsFlattened);
        } catch (err) {
            console.error('[Menu] Ошибка загрузки групп:', err);
            setAllGroups([]);
        }
    };

    const toggleInstitution = (id) => {
        setExpandedInstitutions(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Создание учреждения
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const resultAction = await dispatch(createInstitution(formData));
            if (createInstitution.fulfilled.match(resultAction)) {
                setIsModalOpen(false);
                setFormData({
                    email: '',
                    location: '',
                    short_name: '',
                    full_name: '',
                    institution_type: 'SCHOOL',
                });
                // Перезагружаем учреждения и группы после создания
                await loadInstitutions();
            } else {
                setError(resultAction.error.message || 'Ошибка при создании');
            }
        } catch (err) {
            setError('Произошла ошибка сети');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Эффект загрузки
    useEffect(() => {
        loadInstitutions();
        const intervalId = setInterval(loadInstitutions, 60000);
        return () => clearInterval(intervalId);
    }, []);

    // Обработчики для модалок групп
    const openGroupModal = () => setIsGroupModalOpen(true);
    const closeGroupModal = () => {
        setIsGroupModalOpen(false);
        setGroupName('');
    };

    const openGroupsModal = () => setIsGroupsModalOpen(true);
    const closeGroupsModal = () => {
        setIsGroupsModalOpen(false);
        setGroupNames('');
    };

    // Добавление одной группы
    const handleAddSingleGroup = async () => {
        if (!groupName) {
            alert('Введите название группы');
            return;
        }
        try {
            setIsLoading(true);
            const institutionId = institutions[0]?.id;
            if (!institutionId) {
                throw new Error('Не найден ID учреждения');
            }

            const action = await dispatch(createGroup(institutionId, { name: groupName }));

            if (action.meta?.requestStatus !== 'fulfilled') {
                throw new Error(action.error?.message || 'Ошибка при создании группы');
            }

            await loadGroupsForInstitutions(institutions);
            closeGroupModal();
        } catch (error) {
            console.error('Ошибка при добавлении группы:', error);
            alert('Произошла ошибка при добавлении группы');
        } finally {
            setIsLoading(false);
        }
    };

    // Добавление нескольких групп
    const handleAddMultipleGroups = async () => {
        if (!groupNames) {
            alert('Введите названия групп через запятую');
            return;
        }
        const namesArray = groupNames.split(',').map(name => name.trim()).filter(name => name);
        if (namesArray.length === 0) {
            alert('Нет валидных названий групп');
            return;
        }
        try {
            setIsLoading(true);
            const institutionId = institutions[0]?.id;
            if (!institutionId) {
                throw new Error('Не найден ID учреждения');
            }

            const action = await dispatch(createGroupsBatch(institutionId, namesArray));

            if (action.meta?.requestStatus !== 'fulfilled') {
                throw new Error(action.error?.message || 'Ошибка при массовом создании групп');
            }

            await loadGroupsForInstitutions(institutions);
            closeGroupsModal();
        } catch (error) {
            console.error('Ошибка при массовом добавлении групп:', error);
            alert('Произошла ошибка при добавлении групп');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.menu}>
            {/* Заголовок */}
            <div className={styles.header}>
        <span className={styles.title} onClick={() => navigate('/')}>
          <Button startIcon={<HomeOutlined />} size="small">
            Главная страница
          </Button>
        </span>
            </div>

            {/* Список учреждений */}
            {institutions.map(inst => (
                <div key={inst.id} className={styles.institutionRow}>
                    <div
                        className={styles.item}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexGrow: 1
                        }}
                        onClick={() => toggleInstitution(inst.id)}
                    >
                        <SchoolIcon fontSize="small" color="primary" />
                        {expandedInstitutions[inst.id] ? <ArrowDropUp /> : <ArrowDropDown />}
                        <Typography variant="body1">
                            {inst.short_name || inst.name || 'Название не указано'}
                        </Typography>
                    </div>

                    {/* Кнопки управления группами */}
                    <Box display="flex" gap={1} ml={1}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<GroupAddIcon fontSize="small" />}
                            onClick={openGroupModal}
                        >
                            Группа
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<AddIcon fontSize="small" />}
                            onClick={openGroupsModal}
                        >
                            Группы
                        </Button>
                    </Box>
                </div>
            ))}

            {/* Блок с группами для развёрнутого учреждения */}
            {institutions.map(inst => (
                expandedInstitutions[inst.id] && (
                    <div key={`groups-${inst.id}`} className={styles.groupsList}>
                        <Typography variant="subtitle2" color="textSecondary" ml={3} mb={1}>
                            Группы:
                        </Typography>
                        {/* Фильтруем группы по institution.id */}
                        {allGroups
                            .filter(group => group.institution.id === inst.id)
                            .map(group => (
                                <div key={group.id} className={styles.groupItem}>
                                    <Typography variant="body2" ml={3}>
                                        {group.name || 'Без названия'}
                                    </Typography>
                                </div>
                            ))}
                        {/* Если нет групп для этого учреждения */}
                        {allGroups.filter(group => group.institution.id === inst.id).length === 0 && (
                            <Typography variant="body2" color="textSecondary" ml={3}>
                                Нет групп
                            </Typography>
                        )}
                    </div>
                )
            ))}

            {/* Кнопка "Добавить учебное заведение" */}
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

            {/* Модалка создания учреждения */}
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
                            size="small"
                        >
                            <MenuItem value="SCHOOL">Школа</MenuItem>
                            <MenuItem value="COLLEGE">Колледж</MenuItem>
                            <MenuItem value="HIGHER_EDUCATION">Университет</MenuItem>
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

            {/* Модальное окно для добавления одной группы */}
            <MuiModal
                open={isGroupModalOpen}
                onClose={closeGroupModal}
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 350,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Добавить группу
                    </Typography>

                    <TextField
                        fullWidth
                        label="Название группы"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        margin="normal"
                        size="small"
                    />

                    <Box mt={3} display="flex" gap={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddSingleGroup}
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} /> : null}
                        >
                            {isLoading ? 'Добавляется...' : 'Добавить'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={closeGroupModal}
                        >
                            Отмена
                        </Button>
                    </Box>
                </Box>
            </MuiModal>

            {/* Модальное окно для добавления нескольких групп */}
            <MuiModal
                open={isGroupsModalOpen}
                onClose={closeGroupsModal}
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 350,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Добавить группы
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Названия групп (через запятую)"
                        value={groupNames}
                        onChange={(e) => setGroupNames(e.target.value)}
                        margin="normal"
                        size="small"
                        helperText="Введите названия групп, разделяя их запятыми"
                    />

                    <Box mt={3} display="flex" gap={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddMultipleGroups}
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} /> : null}
                        >
                            {isLoading ? 'Добавляются...' : 'Добавить'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={closeGroupsModal}
                        >
                            Отмена
                        </Button>
                    </Box>
                </Box>
            </MuiModal>
        </div>
    );
};

export default Menu;
