"use client";
import styles from "./Header.module.scss";
import CartIcon from "@/assets/images/icons/cart.svg";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { Search } from "@/components/ui/Search/Search";
import { useCart } from "@/hooks/useCart";
import { Menu } from "@/components/Menu/Menu";

export const Header = () => {
  const { totalCount } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <Menu
          showLogout
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
