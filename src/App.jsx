import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider as MenuProvider } from './context/MenuContext';
import { Link } from 'react-router-dom';

import {
    Box,
    Grid,
    Container,
    CircularProgress,
} from '@mui/material';
import styles from './App.module.css';
import Navbar from './pages/Navbar/Navbar';
import Menu from './pages/Menu/Menu';
import ModalJoin from './shared/components/ModalJoin/ModalJoin';
import Tile from './pages/Tile/Tile';
import avatar from './assets/icons/avatar.png';
import store from './features/api/store';
import { Provider } from 'react-redux';
import ProfileTile from "./pages/ProfileTile/ProfileTile";
import FileCourse from "./pages/FileCourse/FileCourse";
import Course from "./pages/Course/Course";
import {getCoursesByUser} from "./features/course/courses";
import Statistics from "./pages/Statistics/Statistics";
import RewardsPage from "./pages/Rewards/Rewards";
import Rewards from "./pages/Rewards/Rewards";
import ResetPasswordPage from "./pages/Settings/ResetPasswordPage";
import ResetTfaPage from "./pages/Settings/ResetTfaPage";
import ManageUsers from "./pages/ManageUsers/ManageUsers";

const Archive = lazy(() => import('./pages/Archive/Archive'));
const Settings = lazy(() => import('./pages/Settings/Settings'));

function App() {

    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [courses, setCourses] = useState([]); // Состояние для хранения курсов
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние ошибок

    // Выполняем запрос при монтировании компонента
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCoursesByUser();
                setCourses(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <MenuProvider>
                    <div className={styles.appContainer}>
                        <Navbar />
                        <Container maxWidth="xxl" sx={{ mt: 4 }} className={styles.contentWrapper}>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Menu setSelectedComponent={setSelectedComponent} />
                                </Grid>
                                <Grid item xs={9}>
                                    <Suspense
                                        fallback={
                                            <div className={styles.loadingSpinner}>
                                                <CircularProgress />
                                            </div>
                                        }
                                    >
                                        <Routes>
                                            <Route path="/profile-tile" element={<ProfileTile name="test test" tasks={tasks} />} />
                                            <Route path="/archive" element={<Archive/>} />
                                            <Route path="/settings" element={<Settings/>} />
                                            <Route path="/course/:courseId" element={<Course />} />
                                            <Route path="/file-course" element={<FileCourse/>} />
                                            <Route path="/statistics" element={<Statistics/>} />
                                            <Route path="/rewards" element={<Rewards/>} />
                                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                                            <Route path="/reset-tfa" element={<ResetTfaPage />} />
                                            <Route path="/manage-users" element={<ManageUsers />} />
                                            <Route path="/" element={
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        justifyContent: 'space-between',
                                                        gap: 2,
                                                    }}
                                                    className={styles.tileContainer}
                                                >
                                                    {courses.map((course, index) => (
                                                            <Tile
                                                                courseId={course.id}
                                                                course={course.name}
                                                                name={course.creator.name}
                                                                surname={course.creator.surname}
                                                                imageUrl={avatar}
                                                            />
                                                    ))}

                                                </Box>
                                            } />
                                        </Routes>
                                    </Suspense>
                                </Grid>
                            </Grid>
                        </Container>
                        <ModalJoin />
                    </div>
                </MenuProvider>
            </Router>
        </Provider>
    );
}

// Удаляем mockData, так как теперь используем API
const tasks = [
    { title: 'Решение системы ОДУ', status: '01', score: 95 },
    { title: 'Анализ DataFrame', status: '01', score: 100 },
    { title: 'Линейная алгебра, numpy', status: '01', score: 100 },
];

export default App;
