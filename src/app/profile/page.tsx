"use client";
import styles from "./profile.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import ArrowLeftIcon from "@/assets/images/icons/arrow-left.svg";

export default function Page() {
  const { user, refreshUser } = useAuth();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(() => user?.user_metadata?.name || "");
  const [email, setEmail] = useState(() => user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    () => user?.user_metadata?.avatar_url || null,
  );

  const [prevUser, setPrevUser] = useState(user);

  if (user !== prevUser) {
    setPrevUser(user);
    setName(user?.user_metadata?.name || "");
    setEmail(user?.email || "");
    setAvatarUrl(user?.user_metadata?.avatar_url || null);
  }

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      await refreshUser();
      setSuccess("Аватарка успешно обновлена!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка при загрузке аватарки";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const updateData: {
        email?: string;
        password?: string;
        data?: { name?: string };
      } = {};

      if (name !== (user?.user_metadata?.name || "")) {
        updateData.data = { name };
      }

      if (email !== (user?.email || "")) {
        updateData.email = email;
      }

      if (showPasswordInput && newPassword.trim().length > 0) {
        if (newPassword.length < 6) {
          setError("Новый пароль должен содержать не менее 6-ти символов");
          setLoading(false);
          return;
        }
        updateData.password = newPassword;
      }

      const { error: updateError } = await supabase.auth.updateUser(updateData);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      await refreshUser();
      if (email !== (user?.email || "")) {
        setSuccess(
          "Письмо с подтверждением отправлено на вашу новую почту. Пожалуйста, перейдите по ссылке в письме."
        );
      } else {
        setSuccess("Изменения успешно сохранены!");
      }
      setNewPassword("");
      setShowPasswordInput(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка при сохранении данных";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const firstLetter = name
    ? name.charAt(0).toUpperCase()
    : email
      ? email.charAt(0).toUpperCase()
      : "U";

  return (
    <div className={styles.profile_page}>
      <Link href="/" className={styles.back_link} aria-label="На главную">
        <IconButton src={ArrowLeftIcon} alt="Назад на главную" />
      </Link>

      <div className={styles.container}>
        <div className={styles.avatar_section}>
          <div
            className={styles.avatar_wrapper}
            onClick={handleAvatarClick}
            title="Нажмите, чтобы изменить аватарку"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Аватар профиля"
                width={80}
                height={80}
                className={styles.avatar_image}
              />
            ) : (
              <span className={styles.avatar_placeholder}>{firstLetter}</span>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className={styles.file_input}
            accept="image/*"
            onChange={handleAvatarUpload}
          />
          <h2 className={styles.user_name_display}>{name || "Пользователь"}</h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            className={styles.input_form}
            label="Имя"
            aria-label="name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            className={styles.input_form}
            label="Электронная почта"
            aria-label="email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!showPasswordInput ? (
            <span
              className={styles.change_password_span}
              onClick={() => setShowPasswordInput(true)}
            >
              Изменить пароль
            </span>
          ) : (
            <Input
              className={styles.input_form}
              label="Новый пароль"
              aria-label="new-password"
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              hint="Минимум 6 символов"
            />
          )}

          <Button
            className={styles.button_submit}
            type="submit"
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
        </form>
      </div>
    </div>
  );
}
