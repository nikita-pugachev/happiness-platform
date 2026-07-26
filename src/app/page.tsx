'use client';
import { useState } from 'react';
import { Header } from '@/components/Header/Header';
import { FilterCategory } from '@/components/FilterCategory/FilterCategory';
import { CardList } from '@/components/CardList/CardList';

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <>
      <Header />
      <FilterCategory
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <CardList selectedCategory={selectedCategory} />
    </>
  );
}
