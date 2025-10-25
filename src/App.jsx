import React, {lazy, Suspense, useState} from 'react';
import { Provider } from './context/MenuContext';
import Navbar from './pages/Navbar/Navbar';
import Menu from './pages/Menu/Menu';
import ModalJoin from './shared/components/ModalJoin/ModalJoin';
import Tile from './pages/Tile/Tile';
import avatar from './assets/icons/avatar.png'

const Archive = lazy(() => import('./pages/Archive/Archive'));

function App() {
    const [selectedComponent, setSelectedComponent] = useState(null);

    return (
        <Provider>
            <Navbar />
            <div style={{display: 'flex'}}>
                <Menu setSelectedComponent={setSelectedComponent}  />
                <Suspense fallback={<div>Загрузка...</div>}>
                    {selectedComponent === 'archive' && <Archive />}
                    {selectedComponent === 'general' &&
                        <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            gap: '16px',
                            padding: '16px',
                        }}
                    >
                        {mockData.map((item, index) => (
                            <Tile key={index} {...item} />
                        ))}
                    </div>}
                </Suspense>
            </div>
            <ModalJoin />
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
        teacher: 'Анастасия Теплякова',
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

export default App;
