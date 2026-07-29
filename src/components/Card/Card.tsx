"use client";
import styles from "./Card.module.scss";
import Image from "next/image";
import Like from "@/assets/images/icons/heart.svg";
import LikeActive from "@/assets/images/icons/heart-is-like.svg";
import { FC, MouseEvent, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button/Button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export interface CardProps {
  id?: string;
  title: string;
  description?: string;
  price: number | string;
  imageSrc: string;
  onCardClick?: () => void;
  onQuantityChange?: (newQuantity: number) => void;
}

export const Card: FC<CardProps> = ({
  id,
  title,
  price,
  imageSrc,
  onCardClick,
  onQuantityChange,
}) => {
  const router = useRouter();
  const { getItemQuantity, updateQuantity } = useCart();
  const productId = id || title;
  const quantity = getItemQuantity(productId);
  const { user } = useAuth();
  const [isLike, setLike] = useState<boolean>(false);

  useEffect(() => {
    const targetId = id || productId;
    if (!user || !targetId) return;

    const supabase = createClient();

    const checkFavorite = async () => {
      const { data } = await supabase
        .from("favorites")
        .select("user_id, product_id")
        .eq("user_id", user.id)
        .eq("product_id", targetId)
        .maybeSingle();

      if (data) {
        setLike(true);
      }
    };

    checkFavorite();
  }, [user, id, productId]);

  const handleAddFavorite = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }

    const targetId = id || productId;
    const nextLikeState = !isLike;
    setLike(nextLikeState);

    const supabase = createClient();

    try {
      if (nextLikeState) {
        const { error } = await supabase
          .from("favorites")
          .upsert(
            { user_id: user.id, product_id: targetId },
            { onConflict: "user_id,product_id" },
          );

        if (error) {
          console.error(
            "Ошибка при добавлении в избранное:",
            error.message || error,
          );
          setLike(!nextLikeState);
        }
      } else {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", targetId);

        if (error) {
          console.error(
            "Ошибка при удалении из избранного:",
            error.message || error,
          );
          setLike(!nextLikeState);
        }
      }
    } catch (err) {
      console.error("Ошибка при работе с избранным:", err);
      setLike(!nextLikeState);
    }
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newQty = 1;
    updateQuantity({ id: productId, title, price, imageSrc }, newQty);
    onQuantityChange?.(newQty);
  };

  const handleIncrement = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newQty = quantity + 1;
    updateQuantity({ id: productId, title, price, imageSrc }, newQty);
    onQuantityChange?.(newQty);
  };

  const handleDecrement = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newQty = Math.max(0, quantity - 1);
    updateQuantity({ id: productId, title, price, imageSrc }, newQty);
    onQuantityChange?.(newQty);
  };

  return (
    <div className={styles.card} onClick={onCardClick}>
      <div className={styles.image_container}>
        <button
          type="button"
          onClick={handleAddFavorite}
          className={styles.favorite_button}
        >
          <Image
            src={!isLike ? Like : LikeActive}
            alt="Добавить в избранное"
            className={styles.favorite_image}
          />
        </button>
        <Image
          src={imageSrc}
          alt={title}
          className={styles.card_image}
          width={300}
          height={300}
        />
      </div>
      <h3 className={styles.card_title}>{title}</h3>

      <div className={styles.card_info}>
        <p className={styles.card_price}>{price} улыбок</p>

        {quantity === 0 ? (
          <Button
            variant="main"
            className={styles.cart_button}
            onClick={handleAddToCart}
          >
            В корзину
          </Button>
        ) : (
          <div
            className={styles.counter_wrapper}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.counter_button}
              onClick={handleDecrement}
              aria-label="Уменьшить количество"
            >
              -
            </button>
            <span className={styles.counter_value}>{quantity}</span>
            <button
              type="button"
              className={styles.counter_button}
              onClick={handleIncrement}
              aria-label="Увеличить количество"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
