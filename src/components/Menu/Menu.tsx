"use client";
import styles from "./Menu.module.scss";
import Image from "next/image";
import CloseIcon from "@/assets/images/icons/close.svg";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";

export interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  items?: string[];
  user?: User | null;
}

const DEFAULT_ROUTE_MAP: Record<string, string> = {
  "Главная страница": "/",
  "Личный кабинет": "/profile",
  Профиль: "/profile",
  Избранное: "/favorite",
  "История покупок": "/history",
};

export const Menu = ({ isOpen, onClose, items = [], user }: MenuProps) => {
  const router = useRouter();
  const { signOut } = useAuth();

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className={`${styles.menu} ${isOpen ? styles.is_visible : ""}`}>
      <button
        type="button"
        onClick={onClose}
        className={styles.close_button}
        aria-label="Закрыть меню"
      >
        <Image src={CloseIcon} alt="Закрыть" className={styles.close_icon} />
      </button>

      <div className={styles.menu_content}>
        {user === null ? (
          <>
            <Button
              variant="main"
              className={styles.link_button}
              onClick={() => navigateTo("/login")}
            >
              Войти
            </Button>
            <Button
              variant="secondary"
              className={styles.link_button}
              onClick={() => navigateTo("/register")}
            >
              Зарегистрироваться
            </Button>
          </>
        ) : (
          <>
            {items.map((label) => (
              <Button
                key={label}
                variant="secondary"
                className={styles.link_button}
                onClick={() => navigateTo(DEFAULT_ROUTE_MAP[label] || "/")}
              >
                {label}
              </Button>
            ))}

            <Button
              variant="main"
              className={styles.link_button}
              onClick={handleSignOut}
            >
              Выход
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
