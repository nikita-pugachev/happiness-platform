'use client'
import styles from './Modal.module.scss';
import Image from 'next/image';
import closeIcon from '@/assets/images/icons/close.svg';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    isOpen: boolean;
}

export const Modal = ({children, onClose, isOpen}: ModalProps) => {
    return (
        <></>
    );
}