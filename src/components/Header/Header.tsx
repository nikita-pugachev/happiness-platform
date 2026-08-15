"use client";

import styles from "./Header.module.scss";
import Image from "next/image";
import CartIcon from "@/assets/images/icons/cart.svg";
import FavoriteIcon from "@/assets/images/icons/heart.svg";
import UserIcon from "@/assets/images/icons/user.svg";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
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
  const router = useRouter();
  const { user } = useAuth();
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

  const handleFavorite = () => {
    router.push('/favorite');
  }

  const handleProfile = () => {
    if(!user) {
      router.push('/login');
      return;
    }
    router.push('/profile');
  }

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
        <div className={styles.search_container}>
          <Search
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Поиск..."
          />
        </div>
        <div className={styles.desk_nav}>
          <button className={styles.desk_nav_button} onClick={handleFavorite}>
            <Image src={FavoriteIcon} alt="favorite" width={25} height={25} />
          </button>
          <button className={styles.desk_nav_button} onClick={openCart}>
            <Image src={CartIcon} alt="favorite" width={25} height={25} />
          </button>
          <button className={styles.desk_nav_button} onClick={handleProfile}>
            <Image src={UserIcon} alt="favorite" width={25} height={25} />
          </button>
        </div>
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
