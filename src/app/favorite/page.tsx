"use client";

import styles from "./favorite.module.scss";
import HomeIcon from "@/assets/images/icons/home.svg";
import Image from "next/image";
import { Menu } from "@/components/Menu/Menu";
import { Card, CardProps } from "@/components/Card/Card";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ProductRow {
  id: string;
  name: string;
  price: number | string;
  image_url: string;
  description?: string;
}

const MENU_ITEMS = ["Главная страница", "Личный кабинет"];

export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchFavorites = async () => {
      if (!user) {
        if (isMounted) {
          setFavoriteProducts([]);
          setLoading(false);
        }
        return;
      }

      try {
        const supabase = createClient();
        const { data: favoriteRows, error: favError } = await supabase
          .from("favorites")
          .select("product_id")
          .eq("user_id", user.id);

        if (favError || !favoriteRows || favoriteRows.length === 0) {
          if (isMounted) {
            setFavoriteProducts([]);
            setLoading(false);
          }
          return;
        }

        const productIds = favoriteRows.map((item) => item.product_id);

        const { data: productsData, error: prodError } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds);

        if (isMounted) {
          if (prodError || !productsData) {
            setFavoriteProducts([]);
          } else {
            const rows = productsData as unknown as ProductRow[];
            const mapped: CardProps[] = rows.map((item) => ({
              id: item.id,
              title: item.name,
              price: item.price,
              imageSrc: item.image_url,
              description: item.description,
            }));
            setFavoriteProducts(mapped);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
        if (isMounted) {
          setFavoriteProducts([]);
          setLoading(false);
        }
      }
    };

    if (!authLoading) {
      fetchFavorites();
    }

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  const handleFavoriteToggle = useCallback(
    (isLiked: boolean, productId: string) => {
      if (!isLiked) {
        setFavoriteProducts((prev) =>
          prev.filter((item) => (item.id || item.title) !== productId),
        );
      }
    },
    [],
  );

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header_favorite}>
        <div className={styles.mobile_nav}>
          <Menu showLogout items={MENU_ITEMS} />
        </div>
        <div className={styles.desktop_nav}>
          <button className={styles.home_button} onClick={handleHome}>
            <Image src={HomeIcon} alt="Вернуться на главную" />
          </button>
        </div>
        <h1 className={styles.title}>Избранное</h1>
      </header>

      <main className={styles.content}>
        {loading || authLoading ? (
          <Spinner />
        ) : favoriteProducts.length === 0 ? (
          <div className={styles.empty_container}>
            <span className={styles.empty_message}>
              В избранном пока ничего нет
            </span>
          </div>
        ) : (
          <div className={styles.grid}>
            {favoriteProducts.map((product) => (
              <Card
                key={product.id || product.title}
                id={product.id}
                title={product.title}
                price={product.price}
                imageSrc={product.imageSrc}
                description={product.description}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
