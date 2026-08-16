"use client";
import styles from "./Checkbox.module.scss";
import { FC, InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export const Checkbox: FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  id,
  disabled,
  className = "",
  ...props
}) => {
  const checkboxId =
    id || `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <label
      htmlFor={checkboxId}
      className={`${styles.checkbox_container} ${disabled ? styles.disabled : ""} ${className}`}
    >
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.real_checkbox}
        {...props}
      />
      <span
        className={`${styles.custom_checkbox} ${checked ? styles.checked : ""}`}
      ></span>
      <span className={styles.label_text}>{label}</span>
    </label>
  );
};
