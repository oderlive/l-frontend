import React from 'react';
import styles from './ProfileTile.module.css';

const ProfileTile = ({ name, tasks }) => {
    return (
        <div className={styles.profileTile}>
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    <span className={styles.avatarLetter}>A</span>
                </div>
                <h2 className={styles.profileName}>{name}</h2>
            </div>

            <div className={styles.taskFilter}>
                <select className={styles.taskFilterSelect} defaultValue="Все">
                    <option value="Все">Все</option>
                    <option value="Выполненные">Выполненные</option>
                    <option value="Невыполненные">Невыполненные</option>
                </select>
            </div>

            <div className={styles.taskList}>
                {tasks.map((task, index) => (
                    <div className={styles.taskItem} key={index}>
                        <div className={styles.taskTitle}>
                            <span className={styles.taskTitleText}>{task.title}</span>
                            <span className={styles.taskStatus}>{task.status}</span>
                        </div>
                        <div className={styles.taskDetails}>
                            <span className={styles.taskDeadline}>Без срока сдачи</span>
                            <span className={styles.taskScore}>{task.score} из 100</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileTile;
