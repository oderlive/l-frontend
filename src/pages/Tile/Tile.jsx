import React, { useState, useRef } from 'react';
import styles from './Tile.module.css';
import tileProfile from '../../assets/icons/profile-course.svg';
import tileFolder from '../../assets/icons/folder.svg';
import tileDots from '../../assets/icons/3-dots.svg';
import { useNavigate } from 'react-router-dom';

const Tile = ({ courseId, course, name, surname, imageUrl }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const menuButtonRef = useRef(null);

    const handleTileClick = () => {
        navigate(`/course/${courseId}`);
    };

    const handleMove = () => {
        console.log('Переместить курс:', course);
        setIsModalOpen(false);
    };

    const handleLeave = () => {
        console.log('Покинуть курс:', course);
        setIsModalOpen(false);
    };

    const handleMenuClick = (e) => {
        e.stopPropagation(); // ⛔️ Останавливаем всплытие
        setIsModalOpen((prev) => !prev);
    };

    return (
        <div
            className={styles.tile}
            role="button"
            tabIndex={0}
            onClick={handleTileClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTileClick();
                }
            }}
        >
            <div className={styles.header}>
                <h2 className={styles.course}>{course}</h2>
            </div>

            <div className={styles.content}>
                <img src={imageUrl} alt={name} className={styles.avatar} />
                <p className={styles.teacher}>{name} {surname}</p>
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.actionButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/profile-tile');
                    }}
                    aria-label="Профиль преподавателя"
                >
                    <img src={tileProfile} alt="Профиль" className={styles.icon} />
                </button>

                <button
                    className={styles.actionButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/file-course');
                    }}
                    aria-label="Файлы курса"
                >
                    <img src={tileFolder} alt="Файлы" className={styles.icon} />
                </button>

                <button
                    ref={menuButtonRef}
                    className={styles.actionButton}
                    onClick={handleMenuClick}
                    aria-label="Дополнительные действия"
                >
                    <img src={tileDots} alt="Меню" className={styles.icon} />
                </button>
            </div>

            {/* Модальное меню — теперь позиционируется относительно .tile */}
            {isModalOpen && (
                <div className={styles.modalContent}>
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
