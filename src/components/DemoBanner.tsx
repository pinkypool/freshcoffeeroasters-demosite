'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import styles from './DemoBanner.module.css';

export default function DemoBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const { language } = useSettings();

    useEffect(() => {
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
            subtitle: 'Демонстрация сайта Fresh Coffee Roasters',
            features: [
                '🛒 Полнофункциональная корзина',
                '👤 Личный кабинет',
                '🌙 Тёмная тема',
                '🌐 RU/EN',
            ],
            loginTitle: 'Демо-доступ:',
            email: 'demo@freshcoffeekz.com',
            password: 'demo123',
            fullVersion: '🚀 Полная версия',
            fullVersionText: 'В production-версии: полная синхронизация с CRM (цены, контрагенты, остатки), админ-панель (управление пользователями, редактирование товаров, фото, категорий), интеграция с Supabase и платёжными системами.',
            cta: 'Понятно!',
            showAgain: '❔',
        },
        en: {
            title: '👋 Welcome to the demo!',
            subtitle: 'Fresh Coffee Roasters website demo',
            features: [
                '🛒 Functional cart',
                '👤 User account',
                '🌙 Dark theme',
                '🌐 RU/EN',
            ],
            loginTitle: 'Demo access:',
            email: 'demo@freshcoffeekz.com',
            password: 'demo123',
            fullVersion: '🚀 Full Version',
            fullVersionText: 'Production version includes: full CRM sync (prices, counterparties, stock), admin panel (user management, product editing, photos, categories), Supabase & payment integrations.',
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

                        <div className={styles.fullVersion}>
                            <strong>{t.fullVersion}</strong>
                            <p>{t.fullVersionText}</p>
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
