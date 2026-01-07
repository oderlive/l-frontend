import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Backdrop,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    MenuItem,
    Modal as MuiModal,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {
    Add as AddIcon,
    ArrowDropDown,
    ArrowDropUp,
    Delete as DeleteIcon,
    GroupAdd as GroupAddIcon,
    Groups as GroupsIcon,
    HomeOutlined,
    School as SchoolIcon
} from '@mui/icons-material';

import styles from './Menu.module.css';
import { useNavigate } from 'react-router-dom';
import {
    createInstitution,
    fetchInstitutions
} from '../../features/institutions/institutions';
import { getUserInstitution } from '../../features/users/users';
import {
    createGroup,
    createGroupsBatch,
    fetchGroupsByInstitution,
    removeGroup
} from '../../features/group/groupsSlice';
import {addCourseByGroupIdsThunk, deleteCourseByIdThunk, fetchCoursesByUser} from "../../features/course/coursesSlice";
import CoursesSection from "../CoursesSection/CoursesSection";

const Menu = ({ setSelectedComponent }) => {
    const [institutions, setInstitutions] = useState([]);
    const [expandedInstitutions, setExpandedInstitutions] = useState({});
    const [allGroups, setAllGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isGroupsModalOpen, setIsGroupsModalOpen] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isAddingCourse, setIsAddingCourse] = useState(false);

    const [groupName, setGroupName] = useState('');
    const [groupNames, setGroupNames] = useState('');
    const [courseName, setCourseName] = useState('');
    const [selectedGroups, setSelectedGroups] = useState([]);

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

    useEffect(() => {
        loadInstitutions();
        // const intervalId = setInterval(loadInstitutions, 60000);
        // return () => clearInterval(intervalId);
    }, []);


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

            // Если institutionId нет — просто не загружаем учреждения, но продолжаем работу
            if (!institutionId) {
                console.log('[Menu] institution.id не найден, пропускаем загрузку учреждений');
                setInstitutions([]);
                setAllGroups([]);
                return;
            }

            const institutionsAction = await dispatch(fetchInstitutions(institutionId));
            if (institutionsAction.meta?.requestStatus !== 'fulfilled') {
                throw new Error(institutionsAction.error?.message || 'Не удалось загрузить учреждения');
            }

            const resultAction = institutionsAction.payload;
            console.log('[Menu] Учреждения загружены:', resultAction);
            setInstitutions([resultAction]);

            await loadGroupsForInstitutions([resultAction]);
            const coursesAction = await dispatch(fetchCoursesByUser());
            if (coursesAction.meta?.requestStatus === 'fulfilled' && Array.isArray(coursesAction.payload)) {
                setCourses(coursesAction.payload);
            }
            console.log(coursesAction.payload)

            setCourses(coursesAction.payload);
            console.log(allGroups)
            console.log(courses)
        } catch (err) {
            setError(err.message || 'Произошла ошибка при загрузке учреждений');
            console.error('[Menu] Ошибка загрузки:', err);
        } finally {
            setFetchLoading(false);
        }
    };

    // Загрузка всех групп пользователя
    const loadGroupsForInstitutions = async (institutionsList) => {
        const validInstitutions = institutionsList.filter(inst => inst.id);
        console.log(validInstitutions);
        const allGroups = [];

        for (const inst of validInstitutions) {
            try {
                const result = await dispatch(fetchGroupsByInstitution(inst.id));
                console.log(result);

                if (result.meta?.requestStatus === 'fulfilled' && Array.isArray(result.payload)) {
                    allGroups.push(...result.payload);
                }
            } catch (err) {
                console.error(`Ошибка загрузки групп для ${inst.id}:`, err);
            }
        }
        setAllGroups(allGroups);
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
                await loadInstitutions(); // Перезагружаем данные после создания
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

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            loadInstitutions();
            // const intervalId = setInterval(loadInstitutions, 10000); // автообновление каждую минуту
            // return () => clearInterval(intervalId);
        }
    }, []);


    // Обработчики модалок
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

    const openCourseModal = () => setIsCourseModalOpen(true);
    const closeCourseModal = () => {
        setIsCourseModalOpen(false);
        setCourseName('');
        setSelectedGroups([]);
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
                alert('Для создания группы необходимо сначала создать учреждение');
                return;
            }

            const action = await dispatch(createGroup(institutionId, { name: groupName }));
            if (action.meta?.requestStatus !== 'fulfilled') {
                throw new Error(action.error?.message || 'Ошибка при создании группы');
            }

            await loadGroupsForInstitutions(institutions);
            closeGroupModal();
        } catch (error) {

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

        const namesArray = groupNames
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);

        if (namesArray.length === 0) {
            alert('Нет валидных названий групп');
            return;
        }

        try {
            setIsLoading(true);

            const institutionId = institutions[0]?.id;
            if (!institutionId) {
                alert('Для создания групп необходимо сначала создать учреждение');
                return;
            }

            const groupsToCreate = namesArray.map(name => ({ name: name }));

            await dispatch(createGroupsBatch(institutionId, groupsToCreate));

            await loadGroupsForInstitutions(institutions);
            closeGroupsModal();
        } catch (error) {
            console.error('Ошибка при добавлении групп:', error);
            alert(`Произошла ошибка: ${error.message || 'Проверьте соединение'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Удаление группы
    const handleDeleteGroup = async (groupId) => {
        try {
            setIsLoading(true);
            await dispatch(removeGroup(groupId));
            await loadGroupsForInstitutions(institutions);
        } catch (error) {
            console.error('Ошибка при удалении группы:', error);
            alert('Произошла ошибка при удалении группы');
        } finally {
            setIsLoading(false);
        }
    };

    // Удаление курса
    const handleDeleteCourse = async (courseId) => {
        try {
            setIsLoading(true);
            console.log(courseId)
            await dispatch(deleteCourseByIdThunk(courseId));
        } catch (error) {
            console.error('Ошибка при удалении курса:', error);
            console.log(   courseId )
            alert(`Произошла ошибка: ${error.message || 'Проверьте соединение'}`);
        } finally {
            setIsLoading(false);
        }
    };


    // Добавление курса на группы
    const handleAddCourse = async () => {
        if (!courseName) {
            alert('Введите название курса');
            return;
        }

        try {
            setIsLoading(true);

            const action = await dispatch(addCourseByGroupIdsThunk(courseName, [])); // Пустой массив групп

            if (action.meta?.requestStatus !== 'fulfilled') {
                throw new Error(action.error?.message || 'Ошибка при создании курса');
            }

            const updatedCoursesAction = await dispatch(fetchCoursesByUser());
            if (updatedCoursesAction.meta?.requestStatus === 'fulfilled') {
                setCourses(updatedCoursesAction.payload);
            }

            closeCourseModal();
        } catch (error) {
            console.error('Ошибка при добавлении курса:', error);
            alert(`Произошла ошибка: ${error.message || 'Проверьте соединение'}`);
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
            {institutions.length > 0 ? (
                institutions.map(inst => (
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


                        {/* Кнопки управления группами и курсами */}
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
                ))
            ) : (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Учреждения не найдены. Создайте учреждение, чтобы начать работу.
                </Typography>
            )}

            {/* Блок с группами для развёрнутого учреждения */}
            {institutions.map(inst => {
                const isExpanded = expandedInstitutions[inst.id];

                const groupsForInstitution = allGroups
                    .filter(group =>
                        group.institution &&
                        group.institution.id === inst.id
                    );

                return (
                    isExpanded && (
                        <div key={`groups-${inst.id}`} className={styles.groupsList}>
                            <Typography variant="subtitle2" color="textSecondary" ml={3} mb={1}>
                                Группы:
                            </Typography>
                            <div className={styles.groupsContainer}>
                                {groupsForInstitution.length > 0 ? (
                                    groupsForInstitution.map(group => (
                                        <div key={group.id} className={styles.groupItem}>
                                            <GroupsIcon
                                                fontSize="small"
                                                sx={{ color: '#1976d2', mr: 1 }}
                                            />
                                            <Typography variant="body2" className={styles.groupName}>
                                                {group.name || 'Без названия'}
                                            </Typography>
                                            <Button
                                                variant="text"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeleteGroup(group.id)}
                                                disabled={isLoading}
                                                sx={{
                                                    minWidth: 'auto',
                                                    padding: '0 4px',
                                                    marginLeft: '8px'
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        className={styles.noGroupsMessage}
                                    >
                                        Нет групп
                                    </Typography>
                                )}
                            </div>



                        </div>
                    )
                );
            })}
            {/* "Курсы"*/}
            <div className={styles.coursesSection}>
                <Typography variant="h6" color="textPrimary" mb={2}>
                    Курсы
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<AddIcon fontSize="small" />}
                        onClick={openCourseModal}
                        sx={{ ml: 2 }}
                    >
                        Курс
                    </Button>
                </Typography>

                <CoursesSection
                    courses={courses}
                    onDeleteCourse={handleDeleteCourse}
                    isLoading={isLoading}
                />
            </div>


            {/* Ссылки в нижней части */}
            <span className={styles.title} onClick={() => navigate('/settings')}>
        <Button size="small">Настройки</Button>
      </span>
            <span className={styles.title} onClick={() => navigate('/archive')}>
        <Button size="small">Архив</Button>
      </span>
      {/*      <span className={styles.title} onClick={() => navigate('/manage-users')}>*/}
      {/*  <Button size="small">Управлять пользователями</Button>*/}
      {/*</span>*/}
            <span className={styles.title} onClick={() => navigate('/statistics')}>
        <Button size="small">Статистика</Button>
      </span>
            <span className={styles.title} onClick={() => navigate('/rewards')}>
        <Button size="small">Модуль поощрений</Button>
      </span>
            <span className={styles.title} onClick={() => navigate('/manage-users')}>
        <Button size="small">Управление пользователями</Button>
      </span>
            {/* Кнопка "Добавить учебное заведение" — всегда видна */}
            <Box width="100%" sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    fullWidth
                    onClick={() => setIsModalOpen(true)}
                >
                    Добавить учебное заведение
                </Button>
            </Box>

            {/* Модальное окно создания учреждения */}
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
                            name="institution_type"
                            value={formData.institution_type}
                            onChange={handleInputChange}
                            margin="normal"
                            size="small"
                        >
                            <MenuItem value="SCHOOL">Школа</MenuItem>
                            <MenuItem value="COLLEGE">Колледж</MenuItem>
                            <MenuItem value="UNIVERSITY">Университет</MenuItem>
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
                                disabled={isLoading}
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
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Добавить группу
                    </Typography>

                    {error && (
                        <Typography color="error" variant="body2" mb={2}>
                            {error}
                        </Typography>
                    )}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddSingleGroup();
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Название группы"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                            margin="normal"
                            size="small"
                        />

                        <Box mt={3} display="flex" gap={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                            >
                                {isLoading ? 'Создаётся...' : 'Добавить группу'}
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={closeGroupModal}
                            >
                                Отмена
                            </Button>
                        </Box>
                    </form>
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
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Добавить несколько групп
                    </Typography>

                    {error && (
                        <Typography color="error" variant="body2" mb={2}>
                            {error}
                        </Typography>
                    )}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddMultipleGroups();
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Названия групп (через запятую)"
                            value={groupNames}
                            onChange={(e) => setGroupNames(e.target.value)}
                            required
                            margin="normal"
                            size="small"
                            helperText="Пример: 10А, 10Б, 11В"
                        />

                        <Box mt={3} display="flex" gap={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                            >
                                {isLoading ? 'Создаются...' : 'Добавить группы'}
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={closeGroupsModal}
                            >
                                Отмена
                            </Button>
                        </Box>
                    </form>
                </Box>
            </MuiModal>

            {/* Модальное окно для добавления курса */}
            <MuiModal
                open={isCourseModalOpen}
                onClose={closeCourseModal}
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
                        Добавить курс
                    </Typography>

                    {error && (
                        <Typography color="error" variant="body2" mb={2}>
                            {error}
                        </Typography>
                    )}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddCourse();
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Название курса"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            required
                            margin="normal"
                            size="small"
                        />

                        <Typography variant="subtitle2" mt={2} mb={1}>
                            Выберите группы:
                        </Typography>
                        <Box
                            sx={{
                                maxHeight: 200,
                                overflowY: 'auto',
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                p: 1
                            }}
                        >
                            {allGroups.map((group) => (
                                <Box
                                    key={group.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        py: 0.5,
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: '#f5f5f5' }
                                    }}
                                    onClick={() => {
                                        setSelectedGroups((prev) =>
                                            prev.find((g) => g.id === group.id)
                                                ? prev.filter((g) => g.id !== group.id)
                                                : [...prev, group]
                                        );
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedGroups.some((g) => g.id === group.id)}
                                        size="small"
                                    />
                                    <Typography variant="body2">{group.name}</Typography>
                                </Box>
                            ))}
                        </Box>

                        <Box mt={3} display="flex" gap={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                            >
                                {isLoading ? 'Создаётся...' : 'Добавить курс'}
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={closeCourseModal}
                            >
                                Отмена
                            </Button>
                        </Box>
                    </form>
                </Box>
            </MuiModal>

            {/* Индикатор загрузки */}
            {isLoading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                    }}
                >
                    <CircularProgress color="primary" />
                </Box>
            )}

            {/* Уведомление об отсутствии учреждений */}
            {institutions.length === 0 && !fetchLoading && (
                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: 'warning.main',
                        color: 'warning.contrastText',
                        borderRadius: 1,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="body2">
                        Для работы с группами и курсами необходимо создать учебное заведение.
                    </Typography>
                </Box>
            )}
        </div>
    );
};

export default Menu;
