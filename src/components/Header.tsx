'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import styles from './Header.module.css';
import { Icons } from './Icons';

export default function Header() {
    const { getItemCount, openCart } = useCart();
    const { isAuthenticated, user, openAuthModal, logout } = useAuth();
    const { language, theme, setLanguage, toggleTheme, t } = useSettings();
    const [mounted, setMounted] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Prevent hydration mismatch - only show cart count after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    const itemCount = mounted ? getItemCount() : 0;

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoText}>fresh</span>
                    <span className={styles.logoTextBold}>coffee</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/shop" className={styles.navLink}>{t('nav.shop')}</Link>
                    <Link href="/services" className={styles.navLink}>{t('nav.services')}</Link>
                    <Link href="/about" className={styles.navLink}>{t('nav.about')}</Link>
                    <Link href="/faq" className={styles.navLink}>{t('nav.faq')}</Link>
                    <Link href="/contact" className={styles.navLink}>{t('nav.contact')}</Link>
                </nav>

                <div className={styles.actions}>
                    {/* Language Toggle */}
                    <button 
                        className={styles.toggleBtn}
                        onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
                        title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
                    >
                        <span className={styles.langLabel}>{language.toUpperCase()}</span>
                    </button>

                    {/* Theme Toggle */}
                    <button 
                        className={styles.toggleBtn}
                        onClick={toggleTheme}
                        title={theme === 'light' ? 'Dark mode' : 'Light mode'}
                    >
                        {mounted && theme === 'dark' ? (
                            <Icons.Sun size={18} />
                        ) : (
                            <Icons.Moon size={18} />
                        )}
                    </button>

                    {isAuthenticated && user ? (
                        <div className={styles.profileWrapper} ref={profileMenuRef}>
                            <button
                                className={styles.profileBtn}
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            >
                                <div className={styles.avatar}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                                <Icons.ChevronDown size={16} className={isProfileMenuOpen ? styles.rotated : ''} />
                            </button>

                            {isProfileMenuOpen && (
                                <div className={styles.profileMenu}>
                                    <div className={styles.menuHeader}>
                                        <div className={styles.menuAvatar}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={styles.menuInfo}>
                                            <strong>{user.name}</strong>
                                            <span>{user.type === 'WHOLESALE' ? t('user.wholesale') : t('user.retail')}</span>
                                        </div>
                                    </div>
                                    <div className={styles.menuDivider}></div>
                                    <Link href="/account" className={styles.menuItem} onClick={() => setIsProfileMenuOpen(false)}>
                                        <Icons.Grid size={18} /> {t('nav.account')}
                                    </Link>
                                    <Link href="/account/orders" className={styles.menuItem} onClick={() => setIsProfileMenuOpen(false)}>
                                        <Icons.Package size={18} /> {t('nav.orders')}
                                    </Link>
                                    <Link href="/account/documents" className={styles.menuItem} onClick={() => setIsProfileMenuOpen(false)}>
                                        <Icons.FileText size={18} /> {t('nav.documents')}
                                    </Link>
                                    <Link href="/account/settings" className={styles.menuItem} onClick={() => setIsProfileMenuOpen(false)}>
                                        <Icons.Settings size={18} /> {t('nav.settings')}
                                    </Link>
                                    <div className={styles.menuDivider}></div>
                                    <button className={styles.logoutBtn} onClick={() => { logout(); setIsProfileMenuOpen(false); }}>
                                        <Icons.Logout size={18} /> {t('nav.logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className={styles.loginBtn} onClick={openAuthModal}>
                            <Icons.User size={18} />
                            <span>{t('nav.login')}</span>
                        </button>
                    )}

                    <button className={styles.cartLink} onClick={openCart}>
                        <Icons.Cart size={24} />
                        {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
                    </button>
                </div>
            </div>
        </header>
    );
}
