'use client'
import styles from './login.module.scss';
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Неверный email или пароль");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className={styles.login_page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Войти в аккаунт</h2>
        <Input
          className={styles.input_form}
          label="Электронная почта"
          aria-label="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          required
          value={email}
        />
        <Input
          className={styles.input_form}
          label="Пароль"
          aria-label="password"
          type={show ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          onClick={() => setShow(!show)}
          id="password"
          required
          value={password}
        />
        <Button
          className={styles.button_submit}
          type="submit"
          disabled={loading}
        >
          {loading ? "Вход..." : "Войти"}
        </Button>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : null}
        <Link href="/register" className={styles.link}>
          <span>Нет аккаунта? Зарегистрироваться</span>
        </Link>
      </form>
    </div>
  );
}