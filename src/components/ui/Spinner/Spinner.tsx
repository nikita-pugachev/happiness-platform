import styles from "./Spinner.module.scss";

interface SpinnerProps {
  label?: string;
}

export const Spinner = ({ label = "Загрузка..." }: SpinnerProps) => {
  return (
    <div className={styles.wrapper} role="status" aria-label={label}>
      <div className={styles.spinner} />
    </div>
  );
};
