"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Header } from "@/components/Header/Header";
import { FilterCategory } from "@/components/FilterCategory/FilterCategory";
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
  const [selectedCategory, setSelectedCategory] = useState("all");
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
    [pathname]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
    window.history.pushState(null, "", pathname);
  }, [pathname]);

  return (
    <>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <FilterCategory
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <CardList
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onCardClick={handleCardClick}
      />

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
