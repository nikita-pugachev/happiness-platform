import styles from './App.module.scss';
import {Button} from "@/components/ui/Button/Button";

export default function Page() {
  return (
    <>
      <h1 className={styles.title}>Интернет-магазин счастья</h1>
      <Button variant="main">Войти</Button>
      <Button variant="secondary">Регистрация</Button>
    </>
  );
}
