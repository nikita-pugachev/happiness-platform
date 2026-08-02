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
import { CreateOrder } from "@/components/CreateOrder/CreateOrder";
import { SuccessOrder } from "@/components/SuccessOrder/SuccessOrder";

type CartStep = "basket" | "create_order" | "success";

export const Header = () => {
  const { totalCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<CartStep>("basket");

  const openCart = () => {
    setCartStep("basket");
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setCartStep("basket");
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
        {cartStep === "basket" && (
          <Basket
            onClose={closeCart}
            onCheckout={() => setCartStep("create_order")}
          />
        )}
        {cartStep === "create_order" && (
          <CreateOrder
            onSuccess={() => setCartStep("success")}
            onBack={() => setCartStep("basket")}
          />
        )}
        {cartStep === "success" && (
          <SuccessOrder onClose={closeCart} />
        )}
      </Modal>
    </>
  );
};
