import styles from './IconButton.module.scss';
import Image from "next/image";

export interface IconButtonProps {
    src: string;
    alt: string;
    label?: string;
    onClick?: () => void;
    isActive?: boolean;
    className?: string;
    stateInfo?: string;
    setStateInfo?: () => void;
}

export const IconButton = ({ src, alt, label, onClick, isActive, className, stateInfo, setStateInfo }: IconButtonProps) => {
    return (
        <button
            type="button"
            className={`${styles.container} ${isActive ? styles.active : ''} ${className || ''}`}
            onClick={onClick}
            aria-pressed={isActive}
        >
            <div className={styles.icon_button}>
                <Image src={src} alt={alt} className={styles.icon} />
            </div>
            {stateInfo && (
                <div className={styles.info}>
                    <span className={styles.state_info}>{stateInfo}</span>
                </div>
            )}
            {label && <span className={styles.label}>{label}</span>}
        </button>
    );
};