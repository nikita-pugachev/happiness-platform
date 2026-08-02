"use client";

import styles from "./SuccessOrder.module.scss";
import { Button } from "@/components/ui/Button/Button";

export interface SuccessOrderProps {
  onClose: () => void;
}

export const SuccessOrder = ({ onClose }: SuccessOrderProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.message}>Спасибо за заказ. Улыбайтесь чаще!</h2>
      <Button variant="main" className={styles.button} onClick={onClose}>
        Отлично
      </Button>
    </div>
  );
};
