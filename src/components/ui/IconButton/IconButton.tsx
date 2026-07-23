import styles from './IconButton.module.scss';
import Image from "next/image";

interface IconButtonProps {
    src: string;
    alt: string;
    onClick?: () => void;
}

export const IconButton = ({ src, alt, onClick }: IconButtonProps) => {
    return (
        <button className={styles.icon_button} onClick={onClick}>
            <Image src={src} alt={alt} className={styles.icon} />
        </button>
    );
};