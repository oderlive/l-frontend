import React, { useState, useContext } from 'react';
import styles from './ModalJoin.module.css';
import { MenuContext } from "../../../context/MenuContext";

const ModalJoin = ({ isOpen, onClose }) => {
    const { isModalOpen } = useContext(MenuContext);
    const [courseCode, setCourseCode] = useState('');

    const handleJoin = () => {
        if (courseCode.length >= 5 && courseCode.length <= 8) {
            console.log('Код курса принят:', courseCode);
            onClose();
        } else {
            alert('Код курса должен быть от 5 до 8 символов.');
        }
    };

    return (
        isModalOpen && (
            <div className={styles.modal}>
                <div className={styles.content}>
                    <h2>Присоединиться</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        X
                    </button>
                    <div>
                        <p>Вы вошли в аккаунт</p>
                        <div>
                            <img src="avatar.png" alt="Avatar" />
                            <span>Артур Артуров</span>
                            <a href="mailto:test@oiate.ru">test@oiate.ru</a>
                        </div>
                        <button className={styles.changeAccountButton}>Сменить аккаунт</button>
                    </div>
                    <div>
                        <p>Код курса</p>
                        <input
                            type="text"
                            placeholder="Введите код курса"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            className={styles.courseCodeInput}
                        />
                    </div>
                    <div className={styles.actionButtons}>
                        <button onClick={onClose}>Отмена</button>
                        <button onClick={handleJoin}>Присоединиться</button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ModalJoin;
