"use client";
import styles from "./Search.module.scss";
import { Input } from "@/components/ui/Input/Input";
import { FC, useState } from "react";
import Image from "next/image";
import SearchIcon from "@/assets/images/icons/search.svg";
import CloseIcon from "@/assets/images/icons/close.svg";

interface SearchProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const Search: FC<SearchProps> = ({ value, placeholder, onChange }) => {
  const [localState, setLocalState] = useState<string>("");
  const currentValue = value ?? localState;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (value === undefined) {
      setLocalState(val);
    }
    onChange?.(val);
  };

  const handleClear = () => {
    if (value === undefined) {
      setLocalState("");
    }
    onChange?.("");
  };

  return (
    <Input
      value={currentValue}
      placeholder={placeholder}
      aria-label="Поиск"
      onChange={handleTextChange}
      onClick={handleClear}
      className={styles.search_input}
      icon={
        currentValue && (
          <Image className={styles.icon} src={CloseIcon} alt="close" />
        )
      }
      categoryIcon={
        <Image src={SearchIcon} alt="search" className={styles.search_icon} />
      }
    />
  );
};
