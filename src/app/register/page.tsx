"use client";
import styles from "./register.module.scss";
import Link from "next/link";
import Image from "next/image";
import Show from "@/assets/images/icons/show-eye.svg";
import Hide from "@/assets/images/icons/hide-eye.svg";
import { useState } from "react";
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
  const [name, setName] = useState("");
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

    if (password.length < 6) {
      setError("Пароль должен содержать не менее 6-ти символов");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className={styles.register_page}>
      <Link href="/" className={styles.back_link} aria-label="На главную">
        <IconButton src={ArrowLeftIcon} alt="Назад на главную" />
      </Link>
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
          onClick={() => setShow(!show)}
          id="password"
          hint={
            password.length > 0 && password.length < 6 && !error
              ? "Пароль должен содержать не менее 6-ти символов"
              : undefined
          }
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
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
        <Link href="/login" className={styles.link}>
          <span>Уже есть аккаунт? Войти</span>
        </Link>
      </form>
    </div>
  );
}
