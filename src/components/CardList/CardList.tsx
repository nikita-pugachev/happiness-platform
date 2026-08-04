"use client";
import styles from "./CardList.module.scss";
import { FC, useEffect, useState } from "react";
import { Card, CardProps } from "@/components/Card/Card";
import { createClient } from "@/utils/supabase/client";

export interface CardListProps {
  onCardClick?: (product: CardProps) => void;
  selectedCategory?: string;
  searchQuery?: string;
}

interface ProductRow {
  id: string;
  name: string;
  price: number | string;
  image_url: string;
  description?: string;
  categories?: { slug: string } | null;
}

export const CardList: FC<CardListProps> = ({
  onCardClick,
  selectedCategory = "all",
  searchQuery = "",
}) => {
  const [products, setProducts] = useState<CardProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const fetchProducts = async () => {
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*, categories(slug)");

        if (!isMounted) return;

        if (fetchError || !data) {
          setError(
            "Ошибка загрузки данных, пожалуйста, перезагрузите страницу.",
          );
          setProducts([]);
        } else {
          const rows = data as unknown as ProductRow[];
          const filtered =
            selectedCategory && selectedCategory !== "all"
              ? rows.filter(
                  (item) => item.categories?.slug === selectedCategory,
                )
              : rows;

          const mappedProducts: CardProps[] = filtered.map((item) => ({
            id: item.id,
            title: item.name,
            price: item.price,
            imageSrc: item.image_url,
            description: item.description,
          }));

          setProducts(mappedProducts);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            "Ошибка загрузки данных, пожалуйста, перезагрузите страницу.",
          );
          setProducts([]);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const queryClean = searchQuery.trim().toLowerCase();
  const displayedProducts = queryClean
    ? products.filter((product) =>
        product.title.toLowerCase().includes(queryClean),
      )
    : products;

  if (error) {
    return (
      <section className={styles.card_list_container}>
        <span className={styles.error_message}>{error}</span>
      </section>
    );
  }

  return (
    <section
      className={styles.card_list_container}
      aria-label="Каталог товаров"
    >
      {displayedProducts.length === 0 ? (
        <span className={styles.empty_message}>Ничего не найдено</span>
      ) : (
        <div className={styles.grid}>
          {displayedProducts.map((product, index) => (
            <Card
              key={product.id || index}
              id={product.id}
              title={product.title}
              price={product.price}
              imageSrc={product.imageSrc}
              description={product.description}
              onCardClick={() => onCardClick?.(product)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
