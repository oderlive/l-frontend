import React, { useState, useRef } from 'react';
import styles from './Tile.module.css';
import tileProfile from '../../assets/icons/profile-course.svg';
import tileFolder from '../../assets/icons/folder.svg';
import tileDots from '../../assets/icons/3-dots.svg';
import { useNavigate } from 'react-router-dom';

const Tile = ({ course, teacher, imageUrl }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const menuButtonRef = useRef(null);

    // Обработчики для кнопок в модальном окне
    const handleMove = () => {
        console.log('Переместить курс:', course);
        setIsModalOpen(false);
    };

    const handleLeave = () => {
        console.log('Покинуть курс:', course);
        setIsModalOpen(false);
    };

    // Обработчик клика по кнопке меню
    const handleMenuClick = () => {
        setIsModalOpen((prev) => !prev); // Инвертируем состояние: true ↔ false
    };

    return (
        <div className={styles.tile}>
            <div className={styles.header}>
                <h2 className={styles.course}>{course}</h2>
            </div>
            <div className={styles.content}>
                <img src={imageUrl} alt={teacher} className={styles.avatar} />
                <p className={styles.teacher}>{teacher}</p>
            </div>
            <div className={styles.actions}>
                <button
                    className={styles.actionButton}
                    onClick={() => navigate('/profile-tile')}
                >
                    <img src={tileProfile} alt="Профиль" className={styles.icon} />
                </button>
                <button className={styles.actionButton}>
                    <img src={tileFolder} alt="Файлы" className={styles.icon} onClick={() => navigate('/file-course')} />
                </button>
                <button
                    ref={menuButtonRef}
                    className={styles.actionButton}
                    onClick={handleMenuClick} // Используем новый обработчик
                >
                    <img src={tileDots} alt="Меню" className={styles.icon} />
                </button>
            </div>

            {isModalOpen && (
                <div
                    className={styles.modalContent}
                    style={{
                        position: 'absolute',
                        top: `${menuButtonRef.current.getBoundingClientRect().bottom}px`,
                        left: `${menuButtonRef.current.getBoundingClientRect().left}px`,
                        transform: 'translateX(-50%)',
                        marginTop: '8px',
                    }}
                >
                    <button className={styles.modalButton} onClick={handleMove}>
                        Переместить
                    </button>
                    <button className={styles.modalButton} onClick={handleLeave}>
                        Покинуть курс
                    </button>
                </div>
            )}

        </div>
    );
};

export default Tile;
