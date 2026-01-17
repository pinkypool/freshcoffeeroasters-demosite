'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthModal.module.css';
import { Icons } from './Icons';

type AuthTab = 'login' | 'register';

export default function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, login } = useAuth();
    const [activeTab, setActiveTab] = useState<AuthTab>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    if (!isAuthModalOpen) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await login(loginEmail, loginPassword);
            if (!result.success) {
                setError(result.error || 'Неверный email или пароль');
            }
        } catch {
            setError('Ошибка входа. Попробуйте позже.');
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
    const whatsappMessage = 'Здравствуйте! Хочу зарегистрироваться как оптовый клиент Fresh Coffee.';

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={closeAuthModal}>
                    <Icons.Close size={24} />
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {activeTab === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
                    </h2>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Вход
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
                            onClick={() => setActiveTab('register')}
                        >
                            Регистрация
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
                            <label>Email</label>
                            <input
                                type="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Пароль</label>
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
                            {isLoading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>
                ) : (
                    <div className={styles.registerContent}>
                        <div className={styles.registerIcon}>
                            <Icons.WhatsApp size={48} />
                        </div>
                        <h3 className={styles.registerTitle}>Регистрация через WhatsApp</h3>
                        <p className={styles.registerText}>
                            Для создания аккаунта напишите нам в WhatsApp.
                            Мы согласуем условия сотрудничества и пришлём вам
                            логин и пароль для входа.
                        </p>
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                            className={styles.whatsappBtn}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icons.WhatsApp size={20} />
                            Написать в WhatsApp
                        </a>
                        <p className={styles.registerNote}>
                            После получения доступа вы сможете войти через вкладку «Вход»
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
