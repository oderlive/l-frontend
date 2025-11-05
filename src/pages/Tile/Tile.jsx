import React from 'react';
import styles from './Tile.module.css';
import tileProfile from '../../assets/icons/profile-course.svg';
import tileFolder from '../../assets/icons/folder.svg';
import tileDots from '../../assets/icons/3-dots.svg';
import {useNavigate} from "react-router-dom";

const Tile = ({ course, teacher, imageUrl }) => {
    const navigate = useNavigate();

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
                <button className={styles.actionButton} onClick={() => navigate('/profile-tile')}>
                    <img src={tileProfile} alt="Профиль" className={styles.icon} />
                </button>
                <button className={styles.actionButton}>
                    <img src={tileFolder} alt="Файлы" className={styles.icon} />
                </button>
                <button className={styles.actionButton}>
                    <img src={tileDots} alt="Меню" className={styles.icon} />
                </button>
            </div>
        </div>
    );
};

export default Tile;
