"use client";
import styles from './Card.module.scss';
import Image from 'next/image';
import { FC, MouseEvent } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { useCart } from '@/hooks/useCart';

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
    const { getItemQuantity, updateQuantity } = useCart();
    const productId = id || title;
    const quantity = getItemQuantity(productId);

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
                    <div className={styles.counter_wrapper} onClick={(e) => e.stopPropagation()}>
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