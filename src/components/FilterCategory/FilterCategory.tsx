"use client";
import styles from "./FilterCategory.module.scss";
import { FC, useState } from "react";
import Image from "next/image";
import AllCategoryIcon from "@/assets/images/icons/all-category.svg";
import HugsIcon from "@/assets/images/icons/hugs.svg";
import WordsIcon from "@/assets/images/icons/words.svg";
import CareIcon from "@/assets/images/icons/care.svg";
import SurprisesIcon from "@/assets/images/icons/surprises.svg";
import MoodIcon from "@/assets/images/icons/mood.svg";

interface FilterCategoryProps {
  selectedCategory?: string;
  onSelectCategory?: (slug: string) => void;
}

const CATEGORIES = [
  { id: "all", name: "Все категории", slug: "all", icon: AllCategoryIcon },
  { id: "hugs", name: "Объятия", slug: "hugs", icon: HugsIcon },
  { id: "words", name: "Слова", slug: "words", icon: WordsIcon },
  { id: "care", name: "Забота", slug: "care", icon: CareIcon },
  { id: "surprises", name: "Сюрпризы", slug: "surprises", icon: SurprisesIcon },
  { id: "mood", name: "Настроение", slug: "mood", icon: MoodIcon },
];

export const FilterCategory: FC<FilterCategoryProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [internalCategory, setInternalCategory] = useState("all");

  const currentCategory = selectedCategory !== undefined ? selectedCategory : internalCategory;

  const handleCategoryClick = (slug: string) => {
    if (selectedCategory === undefined) {
      setInternalCategory(slug);
    }
    onSelectCategory?.(slug);
  };

  return (
    <nav className={styles.filter_container} aria-label="Категории товаров">
      <ul className={styles.category_list}>
        {CATEGORIES.map((category) => {
          const isActive = currentCategory === category.slug;
          return (
            <li key={category.id} className={styles.category_item}>
              <button
                type="button"
                className={`${styles.category_button} ${isActive ? styles.active : ""}`}
                onClick={() => handleCategoryClick(category.slug)}
                aria-pressed={isActive}
              >
                <div className={styles.icon_wrapper}>
                  <Image src={category.icon} alt={category.name} className={styles.icon_image} />
                </div>
                <span className={styles.category_name}>{category.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
