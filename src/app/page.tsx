'use client';
import styles from './App.module.scss';
import { Header } from '@/components/Header/Header';
import { FilterCategory } from '@/components/FilterCategory/FilterCategory';

export default function Page() {
  return (
    <>
      <Header />
      <FilterCategory />
    </>
  );
}
