"use client";
import styles from "./Modal.module.scss";
import Image from "next/image";
import closeIcon from "@/assets/images/icons/close.svg";
import { FC, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

const emptySubscribe = () => () => {};

export const Modal: FC<ModalProps> = ({ children, onClose, isOpen }) => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isMounted) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.close_button}
          onClick={onClose}
          aria-label="Закрыть модальное окно"
        >
          <Image src={closeIcon} alt="Закрыть" width={20} height={20} />
        </button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};
