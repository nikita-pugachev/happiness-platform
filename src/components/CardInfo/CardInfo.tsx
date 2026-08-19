"use client";
import styles from "./CardInfo.module.scss";
import Image from "next/image";
import Like from "@/assets/images/icons/heart.svg";
import LikeActive from "@/assets/images/icons/heart-is-like.svg";
import MinusIcon from "@/assets/images/icons/minus.svg";
import PlusIcon from "@/assets/images/icons/plus.svg";
import { FC, useState, useEffect, MouseEvent } from "react";
import { Button } from "@/components/ui/Button/Button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { CardProps } from "@/components/Card/Card";

export interface CardInfoProps {
  product: CardProps;
  onClose?: () => void;
}

export const CardInfo: FC<CardInfoProps> = ({ product, onClose }) => {
  const router = useRouter();
  const { getItemQuantity, updateQuantity } = useCart();
  const { user } = useAuth();

  const productId = product.id || product.title;
  const quantity = getItemQuantity(productId);
  const [isLike, setLike] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !productId) return;

    let isMounted = true;
    const supabase = createClient();

    const checkFavorite = async () => {
      try {
        const { data } = await supabase
          .from("favorites")
          .select("user_id, product_id")
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .maybeSingle();

        if (isMounted) {
          setLike(!!data);
        }
      } catch (err) {
        console.error("Ошибка проверки избранного:", err);
      }
    };

    checkFavorite();

    return () => {
      isMounted = false;
    };
  }, [user, productId]);

  const handleAddFavorite = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onClose?.();
      router.push("/login");
      return;
    }

    const nextLikeState = !isLike;
    setLike(nextLikeState);

    const supabase = createClient();
    try {
      if (nextLikeState) {
        const { error } = await supabase
          .from("favorites")
          .upsert(
            { user_id: user.id, product_id: productId },
            { onConflict: "user_id,product_id" },
          );
        if (error) setLike(!nextLikeState);
      } else {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
        if (error) setLike(!nextLikeState);
      }
    } catch (err) {
      setLike(!nextLikeState);
    }
  };

  const handleAddToCart = () => {
    updateQuantity(
      {
        id: productId,
        title: product.title,
        price: product.price,
        imageSrc: product.imageSrc,
      },
      1,
    );
  };

  const handleIncrement = () => {
    updateQuantity(
      {
        id: productId,
        title: product.title,
        price: product.price,
        imageSrc: product.imageSrc,
      },
      quantity + 1,
    );
  };

  const handleDecrement = () => {
    updateQuantity(
      {
        id: productId,
        title: product.title,
        price: product.price,
        imageSrc: product.imageSrc,
      },
      Math.max(0, quantity - 1),
    );
  };

  return (
    <div className={styles.card_info_container}>
      <button
        type="button"
        onClick={handleAddFavorite}
        className={styles.favorite_button}
        aria-label="Добавить в избранное"
      >
        <Image
          src={!isLike ? Like : LikeActive}
          alt="Избранное"
          className={styles.favorite_icon}
        />
      </button>

      <div className={styles.image_wrapper}>
        <Image
          src={product.imageSrc}
          alt={product.title}
          className={styles.product_image}
          width={400}
          height={400}
        />
      </div>

      <div className={styles.details}>
        <h2 className={styles.title}>{product.title}</h2>
        <p className={styles.price}>{product.price} улыбок</p>
      </div>

      {product.description && (
        <div className={styles.description_box}>
          <p className={styles.description_text}>{product.description}</p>
        </div>
      )}

      <div className={styles.action_section}>
        {quantity === 0 ? (
          <Button
            variant="main"
            className={styles.cart_button}
            onClick={handleAddToCart}
          >
            В корзину
          </Button>
        ) : (
          <div className={styles.counter_wrapper}>
            <button
              type="button"
              className={styles.counter_button}
              onClick={handleDecrement}
              aria-label="Уменьшить количество"
            >
              <Image src={MinusIcon} alt="минус" width={14} height={14} />
            </button>
            <span className={styles.counter_value}>{quantity} шт.</span>
            <button
              type="button"
              className={styles.counter_button}
              onClick={handleIncrement}
              aria-label="Увеличить количество"
            >
              <Image src={PlusIcon} alt="плюс" width={14} height={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
