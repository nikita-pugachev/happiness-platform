"use client";
import styles from "./App.module.scss";
import { useState, useEffect, useCallback, Suspense } from "react";
import { Header } from "@/components/Header/Header";
import { FilterCategory } from "@/components/FilterCategory/FilterCategory";
import { Filter } from "@/components/Filter/Filter";
import { CardList } from "@/components/CardList/CardList";
import { CardInfo } from "@/components/CardInfo/CardInfo";
import { Modal } from "@/components/Modal/Modal";
import { CardProps } from "@/components/Card/Card";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams, usePathname } from "next/navigation";

interface ProductRow {
  id: string;
  name: string;
  price: number | string;
  image_url: string;
  description?: string;
}

function CatalogContent() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"]);
  const [selectedMobileCategory, setSelectedMobileCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<CardProps | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const cardIdFromUrl = searchParams.get("cardId") || searchParams.get("id");

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

  const handleMobileCategorySelect = (category: string) => {
    setSelectedMobileCategory(category);
    setSelectedCategories([category]);
  };

  const handleDesktopCategoriesSelect = (categories: string[]) => {
    setSelectedCategories(categories);
    if (categories.length === 1) {
      setSelectedMobileCategory(categories[0]);
    } else if (categories.includes("all")) {
      setSelectedMobileCategory("all");
    }
  };

  return (
    <>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className={styles.main_content}>
        <div className={styles.mobile_filter_section}>
          <FilterCategory
            selectedCategory={selectedMobileCategory}
            onSelectCategory={handleMobileCategorySelect}
          />
        </div>
        <Filter
          selectedCategories={selectedCategories}
          onSelectCategories={handleDesktopCategoriesSelect}
          className={styles.desktop_sidebar}
        />
        <div className={styles.catalog_section}>
          <CardList
            selectedCategory={selectedCategories}
            searchQuery={searchQuery}
            onCardClick={handleCardClick}
          />
        </div>
      </main>

      <Modal isOpen={!!selectedProduct} onClose={handleCloseModal}>
        {selectedProduct && (
          <CardInfo product={selectedProduct} onClose={handleCloseModal} />
        )}
      </Modal>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CatalogContent />
    </Suspense>
  );
}
