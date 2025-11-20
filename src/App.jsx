import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider as MenuProvider } from './context/MenuContext';
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


const Archive = lazy(() => import('./pages/Archive/Archive'));
const Settings = lazy(() => import('./pages/Settings/Settings'));

function App() {
    const [selectedComponent, setSelectedComponent] = useState(null);


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
                                    {/*{selectedComponent === 'archive' && <Archive />}*/}
                                    {/*{selectedComponent === 'settings' && <Settings />}*/}
                                    {/*{selectedComponent === 'general' && (*/}
                                    {/*    <Box*/}
                                    {/*        sx={{*/}
                                    {/*            display: 'flex',*/}
                                    {/*            flexWrap: 'wrap',*/}
                                    {/*            justifyContent: 'space-between',*/}
                                    {/*            gap: 2,*/}
                                    {/*        }}*/}
                                    {/*        className={styles.tileContainer}*/}
                                    {/*    >*/}
                                    {/*        {mockData.map((item, index) => (*/}
                                    {/*            <Tile key={index} {...item} />*/}
                                    {/*        ))}*/}
                                    {/*    </Box>*/}
                                    {/*)}*/}
                                    <Routes>
                                        <Route path="/profile-tile" element={<ProfileTile name="test test" tasks={tasks} />} />
                                        <Route path="/archive" element={<Archive/>} />
                                        <Route path="/settings" element={<Settings/>} />
                                        <Route path="/course" element={<Course/>} />
                                        <Route path="/file-course" element={<FileCourse/>} />
                                        <Route path="/" element={<Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'space-between',
                                                gap: 2,
                                            }}
                                            className={styles.tileContainer}
                                        >
                                            {mockData.map((item, index) => (
                                                <Tile key={index} {...item} />
                                            ))}
                                        </Box>} />
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

// Mock data
const mockData = [
    {
        course: 'ИС-М25 Python',
        teacher: 'Test test',
        imageUrl: avatar,
    },
    {
        course: '2025 2026 ИС М1',
        teacher: 'test test',
        imageUrl: avatar,
    },
    {
        course: 'test test',
        teacher: 'test test',
        imageUrl: avatar,
    },
    {
        course: 'Методы и системы по...',
        teacher: 'test test',
        imageUrl: avatar,
    },
    {
        course: 'ИС-М25 OC-2025',
        teacher: 'test test',
        imageUrl: avatar,
    },
    {
        course: 'Информационные системы',
        teacher: 'test test',
        imageUrl: avatar,
    },
];

const tasks = [
    { title: 'Решение системы ОДУ', status: '01', score: 95 },
    { title: 'Анализ DataFrame', status: '01', score: 100 },
    { title: 'Линейная алгебра, numpy', status: '01', score: 100 },
];


export default App;