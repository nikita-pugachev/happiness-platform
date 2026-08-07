"use client";

import styles from "./Header.module.scss";
import CartIcon from "@/assets/images/icons/cart.svg";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { Search } from "@/components/ui/Search/Search";
import { useCart } from "@/hooks/useCart";
import { Menu } from "@/components/Menu/Menu";
import { useState, useCallback, useMemo, memo } from "react";
import { Modal } from "@/components/Modal/Modal";
import { Basket } from "@/components/Basket/Basket";
import { CreateOrder } from "@/components/CreateOrder/CreateOrder";
import { SuccessOrder } from "@/components/SuccessOrder/SuccessOrder";

type CartStep = "basket" | "create_order" | "success";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const MENU_ITEMS = ["Личный кабинет", "Избранное"];

export const Header = memo(({ searchQuery, onSearchChange }: HeaderProps) => {
  const { totalCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<CartStep>("basket");

  const openCart = useCallback(() => {
    setCartStep("basket");
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
    setCartStep("basket");
  }, []);

  const handleCheckout = useCallback(() => {
    setCartStep("create_order");
  }, []);

  const handleCreateOrderSuccess = useCallback(() => {
    setCartStep("success");
  }, []);

  const handleCreateOrderBack = useCallback(() => {
    setCartStep("basket");
  }, []);

  const cartBadgeText = useMemo(() => {
    if (totalCount <= 0) return undefined;
    return totalCount > 99 ? "99+" : String(totalCount);
  }, [totalCount]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.nav}>
          <Menu showLogout items={MENU_ITEMS} />

          <IconButton
            src={CartIcon}
            alt="Корзина"
            stateInfo={cartBadgeText}
            onClick={openCart}
          />
        </div>
        <Search
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Поиск..."
        />
      </header>

      <Modal isOpen={isCartOpen} onClose={closeCart}>
        {cartStep === "basket" && (
          <Basket onClose={closeCart} onCheckout={handleCheckout} />
        )}
        {cartStep === "create_order" && (
          <CreateOrder
            onSuccess={handleCreateOrderSuccess}
            onBack={handleCreateOrderBack}
          />
        )}
        {cartStep === "success" && <SuccessOrder onClose={closeCart} />}
      </Modal>
    </>
  );
});

Header.displayName = "Header";
