"use client";

import styles from "./OrderList.module.scss";
import Image from "next/image";
import TrashIcon from "@/assets/images/icons/trash.svg";
import { useCart } from "@/hooks/useCart";

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
}

export interface OrderListProps {
  items?: OrderItem[];
  onRemoveItem?: (id: string) => void;
}

export const OrderList = ({ items, onRemoveItem }: OrderListProps) => {
  const { cartItems, updateQuantity } = useCart();
  const displayItems = items ?? cartItems;

  const handleRemove = (id: string, title: string) => {
    if (onRemoveItem) {
      onRemoveItem(id);
    } else {
      updateQuantity({ id, title, price: 0, imageSrc: "" }, 0);
    }
  };

  if (displayItems.length === 0) {
    return <span className={styles.empty}>Корзина пуста</span>;
  }

  return (
    <div className={styles.order_list}>
      {displayItems.map((item) => (
        <div key={item.id} className={styles.item}>
          <h3 className={styles.item_title}>{item.title}</h3>
          <div className={styles.content_info}>
            <span className={styles.item_quantity}>{item.quantity} шт.</span>
            <button
              type="button"
              className={styles.delete_button}
              aria-label={`Удалить ${item.title} из корзины`}
              onClick={() => handleRemove(item.id, item.title)}
            >
              <Image
                src={TrashIcon}
                alt="Удалить"
                className={styles.trash_icon}
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
