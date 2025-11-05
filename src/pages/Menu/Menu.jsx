import React, { useState } from 'react';
import {
    HomeOutlined,
    CalendarTodayOutlined,
    SchoolOutlined,
    AssignmentOutlined,
    SettingsOutlined,
    ArchiveOutlined
} from '@mui/icons-material';
import styles from './Menu.module.css';
import {useNavigate} from "react-router-dom";

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

    return (
        <div className={styles.menu}>
            {/* Заголовок */}
            <div className={styles.header}>
        <span
            className={styles.title}
            onClick={() => navigate('/')}
        >
          <HomeOutlined /> Главная страница
        </span>
            </div>

            {/* Отображение учебных заведений */}
            {mockData.map((inst) => (
                <div key={inst.id}>
                    <div
                        className={styles.item}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleInstitution(inst.id)}
                    >
                        {expandedInstitutions[inst.id] ? '▼' : '►'} {inst.name}
                    </div>

                    {/* Группы внутри учебного заведения */}
                    {expandedInstitutions[inst.id] &&
                        inst.groups.map((group) => (
                            <div key={group.id} style={{ paddingLeft: '20px' }}>
                                <div
                                    className={styles.item}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => toggleGroup(group.id)}
                                >
                                    {expandedGroups[group.id] ? '▼' : '►'} {group.name}
                                </div>

                                {/* Курсы внутри группы */}
                                {expandedGroups[group.id] &&
                                    group.courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className={styles.item}
                                            style={{ paddingLeft: '40px', cursor: 'pointer' }}
                                            onClick={() => setSelectedComponent(course.name)}
                                        >
                                            {course.name}
                                        </div>
                                    ))}
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
};

export default Menu;