import styles from "./Navbar.module.css"
import classIcon from '../../../assets/icons/class.svg'
import classMenu from '../../../assets/icons/class-menu.svg'
import classAvatar from '../../../assets/icons/avatar.png'
import classPoints from '../../../assets/icons/9points.png'
import classPlus from '../../../assets/icons/plus.svg'

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navbar__menu}>
                <img src={classMenu} alt="Menu" style={{width: 40, height: 40, cursor: 'pointer'}}/>
                <img src={classIcon} alt="Logo"/>
                <span>Класс</span>
            </div>
            <div className={styles.navbar__right}>
                    <button className={styles.add}><img src={classPlus} alt="add" style={{width: 35, height: 35, cursor: 'pointer'}}/></button>
                    <img src={classPoints} alt="points" style={{width: 30, height: 30, cursor: 'pointer'}}/>
                    <img src={classAvatar} alt="profile" style={{width: 60, height: 40, cursor: 'pointer'}}/>
            </div>
        </nav>
    )
}

export default Navbar;