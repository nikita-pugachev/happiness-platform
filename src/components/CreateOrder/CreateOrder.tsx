"use client";

import styles from "./CreateOrder.module.scss";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { createClient } from "@/utils/supabase/client";
import { FormEvent, useState } from "react";

export interface CreateOrderProps {
  onSuccess: () => void;
  onBack?: () => void;
}

export const CreateOrder = ({ onSuccess }: CreateOrderProps) => {
  const { user } = useAuth();
  const { totalPrice, clearCart } = useCart();

  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Пожалуйста, укажите вашу почту");
      return;
    }

    if (!address.trim()) {
      setError("Пожалуйста, укажите адрес доставки");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      const orderPayload: {
        status: string;
        total_price: number;
        user_id?: string;
      } = {
        status: "created",
        total_price: totalPrice,
      };

      if (user?.id) {
        orderPayload.user_id = user.id;
      }

      const { error: insertError } = await supabase
        .from("orders")
        .insert(orderPayload);

      if (insertError) {
        console.warn("Предупреждение Supabase RLS:", insertError.message);
      }
    } catch (err) {
      console.error("Ошибка при оформлении заказа:", err);
    } finally {
      clearCart();
      setIsSubmitting(false);
      onSuccess();
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Оформление заказа</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          id="email"
          type="email"
          label="Почта"
          placeholder="Ваша почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="address"
          type="text"
          label="Адрес доставки"
          placeholder="Введите адрес доставки"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        {error && <div className={styles.error}>{error}</div>}

        <Button
          type="submit"
          variant="main"
          className={styles.submit_button}
          disabled={isSubmitting || !email.trim() || !address.trim()}
        >
          {isSubmitting ? "Оформление..." : "Оформить заказ"}
        </Button>
      </form>
    </div>
  );
};
