"use client";
import styles from "./login.module.scss";
import Link from "next/link";
import Image from "next/image";
import Show from "@/assets/images/icons/show-eye.svg";
import Hide from "@/assets/images/icons/hide-eye.svg";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ArrowLeftIcon from "@/assets/images/icons/arrow-left.svg";

export default function Page() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  if (user) {
    router.push("/");
    return;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Данные некоррекнты, проверьте и попробуйте снова");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className={styles.login_page}>
      <Link href="/" className={styles.back_link} aria-label="На главную">
        <IconButton src={ArrowLeftIcon} alt="Назад на главную" />
      </Link>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Вход</h2>
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
          onClick={() => setShow(!show)}
          id="password"
          error={error}
          value={password}
          required
          icon={
            !show ? (
              <Image src={Hide} alt="Скрыть пароль" />
            ) : (
              <Image src={Show} alt="Показать пароль" />
            )
          }
        />
        <Button
          className={styles.button_submit}
          type="submit"
          disabled={loading}
        >
          {loading ? "Вход..." : "Войти"}
        </Button>
        <Link href="/register" className={styles.link}>
          <span>Ещё нет аккаунта? Зарегистрироваться</span>
        </Link>
      </form>
    </div>
  );
}
