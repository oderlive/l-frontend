import React from 'react';
import styles from './Navbar.module.css';
import classIcon from '../../assets/icons/class.svg';
import classMenu from '../../assets/icons/class-menu.svg';
import classAvatar from '../../assets/icons/avatar.png';
import classPoints from '../../assets/icons/9points.png';
import classPlus from '../../assets/icons/plus.svg';
import { useContext } from 'react';
import { MenuContext } from '../../context/MenuContext';
import Modal from '../../shared/components/Modal/Modal';
import AccountManagement from '../AccountManagment/AccountManagment';
import ModalJoin from "../../shared/components/ModalJoin/ModalJoin";

const Navbar = () => {
    const {
        isMenuOpen,
        setIsMenuOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isModalOpen,
        setIsModalOpen
    } = useContext(MenuContext);

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
                        src={classAvatar}
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
            >
            </ModalJoin>

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
