"use client";

import styles from "./favorite.module.scss";
import HomeIcon from "@/assets/images/icons/home.svg";
import Image from "next/image";
import { Menu } from "@/components/Menu/Menu";
import { Card, CardProps } from "@/components/Card/Card";
import { CardInfo } from "@/components/CardInfo/CardInfo";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Modal } from "@/components/Modal/Modal";

interface ProductRow {
  id: string;
  name: string;
  price: number | string;
  image_url: string;
  description?: string;
}

const MENU_ITEMS = ["Главная страница", "Личный кабинет"];

function FavoriteContent() {
  const { user, loading: authLoading } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<CardProps[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<CardProps | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const cardIdFromUrl = searchParams.get("cardId") || searchParams.get("id");

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

  useEffect(() => {
    if (!cardIdFromUrl) {
      setSelectedProduct(null);
      return;
    }

    let isMounted = true;
    const fetchProductById = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("id", cardIdFromUrl)
          .maybeSingle();

        if (isMounted && data) {
          const row = data as unknown as ProductRow;
          setSelectedProduct({
            id: row.id,
            title: row.name,
            price: row.price,
            imageSrc: row.image_url,
            description: row.description,
          });
        }
      } catch (err) {
        console.error("Ошибка загрузки товара по ID:", err);
      }
    };

    fetchProductById();

    return () => {
      isMounted = false;
    };
  }, [cardIdFromUrl]);

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

  const handleCardClick = useCallback(
    (product: CardProps) => {
      setSelectedProduct(product);
      const targetId = product.id || product.title;
      const newUrl = `${pathname}?cardId=${targetId}`;
      window.history.pushState(null, "", newUrl);
    },
    [pathname],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
    window.history.pushState(null, "", pathname);
  }, [pathname]);

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
                onCardClick={() => handleCardClick(product)}
              />
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={!!selectedProduct} onClose={handleCloseModal}>
        {selectedProduct && (
          <CardInfo product={selectedProduct} onClose={handleCloseModal} />
        )}
      </Modal>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FavoriteContent />
    </Suspense>
  );
}
