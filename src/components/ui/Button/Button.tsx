import styles from "./Button.module.scss";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "main" | "secondary";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "main", className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
        {...rest}
      />
    );
  },
);

Button.displayName = "Button";
