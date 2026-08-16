"use client";
import styles from "./Filter.module.scss";
import { FC } from "react";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";

export interface FilterProps {
  selectedCategories?: string[];
  onSelectCategories?: (categories: string[]) => void;
  className?: string;
}

export const CATEGORIES = [
  { id: "all", name: "Все категории", slug: "all" },
  { id: "hugs", name: "Объятия", slug: "hugs" },
  { id: "words", name: "Слова", slug: "words" },
  { id: "care", name: "Забота", slug: "care" },
  { id: "surprises", name: "Сюрпризы", slug: "surprises" },
  { id: "mood", name: "Настроение", slug: "mood" },
];

export const Filter: FC<FilterProps> = ({
  selectedCategories = ["all"],
  onSelectCategories,
  className = "",
}) => {
  const isAllSelected =
    selectedCategories.includes("all") || selectedCategories.length === 0;

  const handleToggleCategory = (slug: string, checked: boolean) => {
    if (!onSelectCategories) return;

    if (slug === "all") {
      onSelectCategories(["all"]);
      return;
    }

    let updated = selectedCategories.filter((s) => s !== "all");

    if (checked) {
      updated.push(slug);
    } else {
      updated = updated.filter((s) => s !== slug);
    }

    if (updated.length === 0) {
      updated = ["all"];
    }

    onSelectCategories(updated);
  };

  return (
    <aside className={`${styles.filter_sidebar} ${className}`}>
      <h3 className={styles.filter_title}>Категории</h3>
      <ul className={styles.checkbox_group}>
        {CATEGORIES.map((cat) => {
          const isChecked =
            cat.slug === "all"
              ? isAllSelected
              : selectedCategories.includes(cat.slug);
          return (
            <li key={cat.id} className={styles.checkbox_item}>
              <Checkbox
                label={cat.name}
                checked={isChecked}
                onChange={(checked) => handleToggleCategory(cat.slug, checked)}
              />
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
