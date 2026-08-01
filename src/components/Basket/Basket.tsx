"use client";

import styles from "./Basket.module.scss";
import { OrderList } from "@/components/OrderList/OrderList";
import { Button } from "@/components/ui/Button/Button";
import { useCart } from "@/hooks/useCart";

export interface BasketProps {
  onClose?: () => void;
  onCheckout?: () => void;
}

export const Basket = ({ onClose, onCheckout }: BasketProps) => {
  const { totalPrice, cartItems } = useCart();

  const handlePay = () => {
    if (cartItems.length === 0) return;
    onCheckout?.();
    onClose?.();
  };

  return (
    <div className={styles.basket}>
      <h2 className={styles.title}>Корзина</h2>

      <OrderList />

      <div className={styles.footer}>
        <span className={styles.total_price}>{totalPrice} улыбок</span>
        <Button
          variant="main"
          className={styles.pay_button}
          onClick={handlePay}
          disabled={cartItems.length === 0}
        >
          Оплатить
        </Button>
      </div>
    </div>
  );
};
