import styles from './Header.module.scss';
import CartIcon from '@/assets/images/icons/cart.svg';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

export const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.nav}>
                <button className={styles.mobile_menu} aria-label="Меню навигации">
                    <span className={styles.menu_icon}></span>
                </button>
                <div className={styles.desktop_nav}>
                    <Button variant='main'>Войти</Button>
                    <Button variant='secondary'>Зарегистрироваться</Button>
                </div>
                <IconButton src={CartIcon} alt="Корзина" />
            </div>
            <Input placeholder="Поиск..." />
        </header>
    );
    };