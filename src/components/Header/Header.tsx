"use client";
import styles from "./Header.module.scss";
import CartIcon from "@/assets/images/icons/cart.svg";
import { useState } from "react";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { Search } from "@/components/ui/Search/Search";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Menu } from "@/components/Menu/Menu";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { totalCount } = useCart();

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <button
          className={styles.mobile_menu}
          aria-label="Меню навигации"
          onClick={toggleMenu}
        >
          <span className={styles.menu_icon}></span>
        </button>

        <Menu
          isOpen={open}
          onClose={closeMenu}
          user={user}
          items={["Личный кабинет", "Избранное", "История покупок"]}
        />

        <IconButton
          src={CartIcon}
          alt="Корзина"
          stateInfo={totalCount > 0 ? String(totalCount) : undefined}
        />
      </div>
      <Search placeholder="Поиск..." />
    </header>
  );
};
