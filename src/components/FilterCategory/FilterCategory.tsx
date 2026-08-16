"use client";
import styles from "./FilterCategory.module.scss";
import { FC, useState, useCallback, memo } from "react";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import AllCategoryIcon from "@/assets/images/icons/all-category.svg";
import HugsIcon from "@/assets/images/icons/hugs.svg";
import WordsIcon from "@/assets/images/icons/words.svg";
import CareIcon from "@/assets/images/icons/care.svg";
import SurprisesIcon from "@/assets/images/icons/surprises.svg";
import MoodIcon from "@/assets/images/icons/mood.svg";

interface FilterCategoryProps {
  selectedCategory?: string;
  onSelectCategory?: (slug: string) => void;
  className?: string;
}

const CATEGORIES = [
  { id: "all", name: "Все категории", slug: "all", icon: AllCategoryIcon },
  { id: "hugs", name: "Объятия", slug: "hugs", icon: HugsIcon },
  { id: "words", name: "Слова", slug: "words", icon: WordsIcon },
  { id: "care", name: "Забота", slug: "care", icon: CareIcon },
  { id: "surprises", name: "Сюрпризы", slug: "surprises", icon: SurprisesIcon },
  { id: "mood", name: "Настроение", slug: "mood", icon: MoodIcon },
];

export const FilterCategory: FC<FilterCategoryProps> = memo(
  ({ selectedCategory, onSelectCategory, className }) => {
    const [internalCategory, setInternalCategory] = useState("all");

    const currentCategory =
      selectedCategory !== undefined ? selectedCategory : internalCategory;

    const handleCategoryClick = useCallback(
      (slug: string) => {
        if (selectedCategory === undefined) {
          setInternalCategory(slug);
        }
        onSelectCategory?.(slug);
      },
      [selectedCategory, onSelectCategory],
    );

    return (
      <div className={`${styles.filter_container} ${className}`}>
        <div className={styles.scroll_wrapper}>
          <ul className={styles.category_list}>
            {CATEGORIES.map((category) => {
              const isActive = currentCategory === category.slug;
              return (
                <li key={category.id} className={styles.category_item}>
                  <IconButton
                    src={category.icon}
                    alt={category.name}
                    label={category.name}
                    isActive={isActive}
                    onClick={() => handleCategoryClick(category.slug)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  },
);

FilterCategory.displayName = "FilterCategory";
