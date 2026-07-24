'use client'
import styles from './register.module.scss';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className={styles.register_page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Регистрация</h2>
        <Input
          className={styles.input_form}
          label="Имя"
          aria-label="name"
          onChange={(e) => setName(e.target.value)}
          type="name"
          id="name"
          value={name}
          required
        />
        <Input
          className={styles.input_form}
          label="Электронная почта"
          aria-label="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          value={email}
          required
        />
        <Input
          className={styles.input_form}
          label="Пароль"
          aria-label="password"
          type={show ? "text" : "password"}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(null);
          }}
          id="password"
          hint={
            !password && !error
              ? "Пароль должен содержать не менее 6-ти символов"
              : undefined
          }
          error={error}
          value={password}
          required
        />
        <Button
          className={styles.button_submit}
          type="submit"
          disabled={loading}
        >
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
        <Link href="/login" className={styles.link}>
          <span>Уже есть аккаунт? Войти</span>
        </Link>
      </form>
    </div>
  );
}