'use client';
import styles from './Header.module.scss';
import CartIcon from '@/assets/images/icons/cart.svg';
import Close from '@/assets/images/icons/close.svg';
import Image from 'next/image';
import { useState } from 'react';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { Button } from '@/components/ui/Button/Button';
import { Search } from '@/components/ui/Search/Search';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export const Header = () => {
    const [open, setOpen] = useState(false);
    const { user, signOut } = useAuth();
    const router = useRouter();

    const toggleMenu = () => {
        setOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    const handleSignOut = async () => {
        await signOut();
        closeMenu();
    };

    return (
        <header className={styles.header}>
            <div className={styles.nav}>
                <button className={styles.mobile_menu} aria-label="Меню навигации" onClick={toggleMenu}>
                    <span className={styles.menu_icon}></span>
                </button>
                <div className={`${styles.menu} ${open ? styles.is_visible : ''}`}>
                    <button onClick={closeMenu} className={styles.close_button} aria-label="Закрыть меню">
                        <Image src={Close} alt="Закрыть" className={styles.close_icon} />
                    </button>
                    <div className={styles.menu_content}>
                        {!user ? (
                            <>
                                <Button 
                                    variant="main" 
                                    className={styles.link_button}
                                    onClick={() => { closeMenu(); router.push('/login'); }}
                                >
                                    Войти
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    className={styles.link_button}
                                    onClick={() => { closeMenu(); router.push('/register'); }}
                                >
                                    Зарегистрироваться
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    variant="secondary" 
                                    className={styles.link_button}
                                    onClick={() => { closeMenu(); router.push('/profile'); }}
                                >
                                    Личный кабинет
                                </Button>
                                <Button variant="secondary" className={styles.link_button}>
                                    Избранное
                                </Button>
                                <Button variant="secondary" className={styles.link_button}>
                                    История покупок
                                </Button>
                                <Button 
                                    variant="main" 
                                    className={styles.link_button}
                                    onClick={handleSignOut}
                                >
                                    Выход
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.desktop_nav}>
                    {!user ? (
                        <>
                            <Button variant="main" onClick={() => router.push('/login')}>Войти</Button>
                            <Button variant="secondary" onClick={() => router.push('/register')}>Зарегистрироваться</Button>
                        </>
                    ) : (
                        <Button variant="main" onClick={handleSignOut}>Выход</Button>
                    )}
                </div>
                <IconButton src={CartIcon} alt="Корзина" />
            </div>
            <Search placeholder="Поиск..." />
        </header>
    );
};