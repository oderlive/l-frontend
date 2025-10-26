import React from 'react';
import styles from './AccountManagment.module.css';
import { useContext } from 'react';
import { MenuContext } from '../../context/MenuContext';
import { logout } from '../../features/auth/auth.js'
import {useDispatch} from "react-redux";

const AccountManagement = () => {
    const { setIsProfileModalOpen } = useContext(MenuContext);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileModalOpen(false);
    };

    return (
        <div className={styles.accountManagement}>
            <div className={styles.header}>
                <div className={styles.avatar}>
                    <div className={styles.avatarLetter}>A</div>
                </div>
                <h2>Авторизация</h2>
            </div>
            <div className={styles.actions}>
                <button
                    className={styles.addAccount}
                    onClick={() => setIsProfileModalOpen(false)}
                >
                    Войти
                </button>
                <button
                    className={styles.logout}
                    onClick={() => {
                        setIsProfileModalOpen(false);
                        handleLogout();
                    }
                    }
                >
                    Выйти
                </button>
            </div>
            <div className={styles.links}>
                <button
                    className={styles.link}
                    onClick={(e) => e.preventDefault()}
                >
                    Политика конфиденциальности
                </button>
                <button
                    className={styles.link}
                    onClick={(e) => e.preventDefault()}
                >
                    Условия использования
                </button>
            </div>
        </div>
    );
};

export default AccountManagement;
