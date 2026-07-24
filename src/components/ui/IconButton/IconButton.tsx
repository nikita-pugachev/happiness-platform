import styles from './IconButton.module.scss';
import Image from "next/image";

interface IconButtonProps {
    src: string;
    alt: string;
    label?: string;
    onClick?: () => void;
}

export const IconButton = ({ src, alt, label, onClick }: IconButtonProps) => {
    return (
        <div className={styles.container}>
            <button className={styles.icon_button} onClick={onClick}>
                <Image src={src} alt={alt} className={styles.icon} />
            </button>
            { label && <span className={styles.label}>{label}</span>}
        </div>
    );
};