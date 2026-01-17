'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import styles from './AuthModal.module.css';
import { Icons } from './Icons';

type AuthTab = 'login' | 'register';

export default function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, login } = useAuth();
    const { language } = useSettings();
    const [activeTab, setActiveTab] = useState<AuthTab>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const content = {
        ru: {
            loginTitle: 'Вход в аккаунт',
            registerTitle: 'Регистрация',
            loginTab: 'Вход',
            registerTab: 'Регистрация',
            email: 'Email',
            password: 'Пароль',
            loginBtn: 'Войти',
            loggingIn: 'Вход...',
            errorDefault: 'Неверный email или пароль',
            errorGeneric: 'Ошибка входа. Попробуйте позже.',
            whatsappTitle: 'Регистрация через WhatsApp',
            whatsappText: 'Для создания аккаунта напишите нам в WhatsApp. Мы согласуем условия сотрудничества и пришлём вам логин и пароль для входа.',
            whatsappBtn: 'Написать в WhatsApp',
            whatsappNote: 'После получения доступа вы сможете войти через вкладку «Вход»',
            whatsappMessage: 'Здравствуйте! Хочу зарегистрироваться как оптовый клиент Fresh Coffee.',
        },
        en: {
            loginTitle: 'Sign In',
            registerTitle: 'Register',
            loginTab: 'Sign In',
            registerTab: 'Register',
            email: 'Email',
            password: 'Password',
            loginBtn: 'Sign In',
            loggingIn: 'Signing in...',
            errorDefault: 'Invalid email or password',
            errorGeneric: 'Login error. Please try again later.',
            whatsappTitle: 'Register via WhatsApp',
            whatsappText: 'To create an account, message us on WhatsApp. We\'ll discuss partnership terms and send you login credentials.',
            whatsappBtn: 'Message on WhatsApp',
            whatsappNote: 'After receiving access, you can sign in using the "Sign In" tab',
            whatsappMessage: 'Hello! I want to register as a wholesale client of Fresh Coffee.',
        },
    };

    const t = content[language];

    if (!isAuthModalOpen) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await login(loginEmail, loginPassword);
            if (!result.success) {
                setError(result.error || t.errorDefault);
            }
        } catch {
            setError(t.errorGeneric);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeAuthModal();
        }
    };

    const whatsappNumber = '77075845229';

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={closeAuthModal}>
                    <Icons.Close size={24} />
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {activeTab === 'login' ? t.loginTitle : t.registerTitle}
                    </h2>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            {t.loginTab}
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
                            onClick={() => setActiveTab('register')}
                        >
                            {t.registerTab}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className={styles.error}>
                        <Icons.AlertCircle size={16} /> {error}
                    </div>
                )}

                {activeTab === 'login' ? (
                    <form onSubmit={handleLogin} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>{t.email}</label>
                            <input
                                type="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>{t.password}</label>
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? t.loggingIn : t.loginBtn}
                        </button>
                    </form>
                ) : (
                    <div className={styles.registerContent}>
                        <div className={styles.registerIcon}>
                            <Icons.WhatsApp size={48} />
                        </div>
                        <h3 className={styles.registerTitle}>{t.whatsappTitle}</h3>
                        <p className={styles.registerText}>{t.whatsappText}</p>
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t.whatsappMessage)}`}
                            className={styles.whatsappBtn}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icons.WhatsApp size={20} />
                            {t.whatsappBtn}
                        </a>
                        <p className={styles.registerNote}>{t.whatsappNote}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
