"use client";

import styles from "./Menu.module.scss";
import Image from "next/image";
import CloseIcon from "@/assets/images/icons/close.svg";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export interface MenuProps {
  isOpen?: boolean;
  items?: string[];
  showLogout?: boolean;
}

const DEFAULT_ROUTE_MAP: Record<string, string> = {
  "Главная страница": "/",
  "Личный кабинет": "/profile",
  "Избранное": "/favorite",
};

export const Menu = ({
  isOpen = false,
  items = [],
  showLogout = false,
}: MenuProps) => {
  const [open, setOpen] = useState(isOpen);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const handleNavigate = (path: string) => {
    closeMenu();
    router.push(path);
  };

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
    router.push("/");
  };

  return (
    <div className={styles.menu_wrapper}>
      <button
        type="button"
        className={styles.trigger_button}
        aria-label="Открыть меню"
        onClick={toggleMenu}
      >
        <span className={styles.menu_icon} />
      </button>

      <div className={`${styles.menu} ${open ? styles.is_visible : ""}`}>
        <button
          type="button"
          onClick={closeMenu}
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
                onClick={() => handleNavigate("/login")}
              >
                Войти
              </Button>
              <Button
                variant="secondary"
                className={styles.link_button}
                onClick={() => handleNavigate("/register")}
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
                  onClick={() =>
                    handleNavigate(DEFAULT_ROUTE_MAP[label] || "/")
                  }
                >
                  {label}
                </Button>
              ))}

              {showLogout && (
                <Button
                  variant="main"
                  className={styles.link_button}
                  onClick={handleSignOut}
                >
                  Выход
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
