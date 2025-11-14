import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Добавляем
import styles from './Navbar.module.css';
import classIcon from '../../assets/icons/class.svg';
import classMenu from '../../assets/icons/class-menu.svg';
import classAvatar from '../../assets/icons/avatar.png';
import classSign from '../../assets/icons/sign.svg';
import classPoints from '../../assets/icons/9points.png';
import classPlus from '../../assets/icons/plus.svg';
import { useContext } from 'react';
import { MenuContext } from '../../context/MenuContext';
import Modal from '../../shared/components/Modal/Modal';
import AccountManagement from '../AccountManagment/AccountManagment';
import ModalJoin from '../../shared/components/ModalJoin/ModalJoin';

const Navbar = () => {
    const {
        isMenuOpen,
        setIsMenuOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isModalOpen,
        setIsModalOpen
    } = useContext(MenuContext);

    // Получаем статус авторизации из Redux
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    // Локальное состояние для userId (только для инициализации)
    const [userId, setUserId] = useState(localStorage.getItem('user_id'));

    // Выбираем иконку: приоритет у isLoggedIn, fallback на localStorage
    const avatarSrc = isLoggedIn ? classAvatar : classSign;

    // Эффект: синхронизируем localState с localStorage при mount
    useEffect(() => {
        const currentUserId = localStorage.getItem('user_id');
        setUserId(currentUserId);
    }, [localStorage.getItem('user_id')]);

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navbar__menu}>
                    <img
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        src={classMenu}
                        alt="Menu"
                        style={{ width: 40, height: 40, cursor: 'pointer' }}
                    />
                    <img src={classIcon} alt="Logo" />
                    <span>Класс</span>
                </div>
                <div className={styles.navbar__right}>
                    <button
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        className={styles.add}
                    >
                        <img
                            src={classPlus}
                            alt="add"
                            style={{ width: 35, height: 35, cursor: 'pointer' }}
                        />
                    </button>
                    <img
                        src={classPoints}
                        alt="points"
                        style={{ width: 30, height: 30, cursor: 'pointer' }}
                    />
                    <img
                        src={avatarSrc}
                        alt="profile"
                        className={styles.avatar}
                        style={{ width: 60, height: 40, cursor: 'pointer' }}
                        onClick={() => setIsProfileModalOpen(true)}
                    />
                </div>
            </nav>

            <ModalJoin
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <Modal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            >
                <AccountManagement />
            </Modal>
        </>
    );
};

export default Navbar;
