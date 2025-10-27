import React, { useContext } from 'react';
import { MenuContext } from '../../context/MenuContext';
import styles from './Menu.module.css';

import {
    HomeOutlined,
    CalendarTodayOutlined,
    SchoolOutlined,
    AssignmentOutlined,
    SettingsOutlined,
    ArchiveOutlined
} from '@mui/icons-material';

const Menu = ({ setSelectedComponent }) => {
    const { isMenuOpen } = useContext(MenuContext);

    return (
        isMenuOpen && (
            <div className={styles.menu}>
                <div className={styles.header}>
          <span
              className={styles.title}
              onClick={() => setSelectedComponent('general')}
          >
            <HomeOutlined /> Главная страница
          </span>
                </div>
                <ul className={styles.list}>
                    <li className={styles.item}>
                        <CalendarTodayOutlined /> Календарь
                    </li>
                    <li className={styles.item}>
                        <SchoolOutlined /> Курсы, слушателем которых вы являетесь
                    </li>
                    <li className={styles.item}>
                        <AssignmentOutlined /> Список заданий
                    </li>
                    <li className={styles.item}>ИС-М25 Python</li>
                    <li className={styles.item}>2025 2026 ИС М1</li>
                    <li className={styles.item}>ИВТ-М24, ИС-М25. CV</li>
                    <li className={styles.item}>Методы и системы поддержки принятия решений</li>
                    <li className={styles.item}>ИС-М25 OC-2025</li>
                    <li className={styles.item}>Информационные системы и технологии</li>
                    <li className={styles.item}>ИС-М25</li>
                    <li className={styles.item}>ИС-М25 Блокчейн технологии</li>
                    <li
                        className={styles.item}
                        onClick={() => setSelectedComponent('archive')}
                    >
                        <ArchiveOutlined /> Архив курсов
                    </li>
                    <li
                        className={styles.item}
                        onClick={() => setSelectedComponent('settings')}
                    >
                        <SettingsOutlined /> Настройки
                    </li>
                </ul>
            </div>
        )
    );
};

export default Menu;
