"use client";

import styles from "./Header.module.scss";
import CartIcon from "@/assets/images/icons/cart.svg";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { Search } from "@/components/ui/Search/Search";
import { useCart } from "@/hooks/useCart";
import { Menu } from "@/components/Menu/Menu";
import { useState } from "react";
import { Modal } from "@/components/Modal/Modal";
import { Basket } from "@/components/Basket/Basket";

export const Header = () => {
  const { totalCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <>
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
            onClick={openCart}
          />
        </div>
        <Search placeholder="Поиск..." />
      </header>

      <Modal isOpen={isCartOpen} onClose={closeCart}>
        <Basket onClose={closeCart} />
      </Modal>
    </>
  );
};
