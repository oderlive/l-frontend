import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
                    <img src={"https://sun9-79.userapi.com/s/v1/ig2/yCvCoaPXh09Daz1Y9vt0Op5EqH54WfbRGwOC8Gcl2xf-XxYq8u6QIwI7iLPqb9-xU84ugTYOCCX7kLxPf2qJ4N01.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1275x1275&from=bu&cs=1275x0"} alt="Logo" />
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
