'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import styles from './DemoBanner.module.css';

export default function DemoBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const { language } = useSettings();

    useEffect(() => {
        // Check if user has dismissed the banner before
        const dismissed = localStorage.getItem('demo-banner-dismissed');
        if (!dismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
        localStorage.setItem('demo-banner-dismissed', 'true');
    };

    const handleShowAgain = () => {
        setIsVisible(true);
        setIsDismissed(false);
        localStorage.removeItem('demo-banner-dismissed');
    };

    if (!isVisible && !isDismissed) return null;

    const content = {
        ru: {
            title: '👋 Добро пожаловать в демо!',
            subtitle: 'Это демонстрация сайта Fresh Coffee Roasters',
            features: [
                '🛒 Полнофункциональная корзина',
                '👤 Личный кабинет с заказами',
                '🌙 Тёмная тема',
                '🌐 Английский язык',
            ],
            loginTitle: 'Для входа используйте:',
            email: 'Email: demo@freshcoffeekz.com',
            password: 'Пароль: demo123',
            cta: 'Понятно!',
            showAgain: '❔',
        },
        en: {
            title: '👋 Welcome to the demo!',
            subtitle: 'This is a demonstration of Fresh Coffee Roasters website',
            features: [
                '🛒 Fully functional cart',
                '👤 Personal account with orders',
                '🌙 Dark theme',
                '🌐 English language',
            ],
            loginTitle: 'Login credentials:',
            email: 'Email: demo@freshcoffeekz.com',
            password: 'Password: demo123',
            cta: 'Got it!',
            showAgain: '❔',
        },
    };

    const t = content[language];

    return (
        <>
            {isVisible && (
                <div className={styles.overlay}>
                    <div className={styles.banner}>
                        <h2 className={styles.title}>{t.title}</h2>
                        <p className={styles.subtitle}>{t.subtitle}</p>
                        
                        <div className={styles.features}>
                            {t.features.map((feature, i) => (
                                <span key={i} className={styles.feature}>{feature}</span>
                            ))}
                        </div>

                        <div className={styles.credentials}>
                            <h4>{t.loginTitle}</h4>
                            <code className={styles.code}>{t.email}</code>
                            <code className={styles.code}>{t.password}</code>
                        </div>

                        <button className={styles.cta} onClick={handleDismiss}>
                            {t.cta}
                        </button>
                    </div>
                </div>
            )}

            {isDismissed && (
                <button 
                    className={styles.showAgainBtn} 
                    onClick={handleShowAgain}
                    title="Show demo info"
                >
                    {t.showAgain}
                </button>
            )}
        </>
    );
}
