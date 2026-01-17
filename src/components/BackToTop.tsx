'use client';

import React, { useState, useEffect } from 'react';
import styles from './BackToTop.module.css';
import { Icons } from './Icons';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            className={`${styles.backToTop} ${isVisible ? styles.visible : ''}`}
            onClick={scrollToTop}
            aria-label="Вернуться наверх"
        >
            <Icons.ChevronUp size={24} />
        </button>
    );
}
