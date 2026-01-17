'use client';

import React from 'react';
import styles from './DemoMarquee.module.css';
import { useSettings } from '@/context/SettingsContext';

export default function DemoMarquee() {
    const { language } = useSettings();

    const content = {
        ru: '🎉 ДЕМО РЕЖИМ • Логин: demo@freshcoffeekz.com • Пароль: demo123 • Попробуйте все функции!',
        en: '🎉 DEMO MODE • Login: demo@freshcoffeekz.com • Password: demo123 • Try all features!',
    };

    const text = content[language];

    return (
        <div className={styles.marqueeContainer}>
            <div className={styles.marqueeContent}>
                <span className={styles.marqueeText}>{text}</span>
                <span className={styles.marqueeText}>{text}</span>
                <span className={styles.marqueeText}>{text}</span>
                <span className={styles.marqueeText}>{text}</span>
            </div>
        </div>
    );
}
