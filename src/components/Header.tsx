'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';
import { Icons } from './Icons';

export default function Header() {
    const { getItemCount, openCart } = useCart();
    const { isAuthenticated, user, openAuthModal, logout } = useAuth();
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
                    <Link href="/shop" className={styles.navLink}>Магазин</Link>
                    <Link href="/services" className={styles.navLink}>Услуги</Link>
                    <Link href="/about" className={styles.navLink}>О нас</Link>
                    <Link href="/faq" className={styles.navLink}>FAQ</Link>
                    <Link href="/contact" className={styles.navLink}>Контакты</Link>
                </nav>

                <div className={styles.actions}>
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
                                            <span>{user.type === 'WHOLESALE' ? 'Оптовик' : 'Розница'}</span>
                                        </div>
                                    </div>
                                    <div className={styles.menuDivider}></div>
                                    <Link href="/account" className={styles.menuItem} onClick={() => setIsProfileMenuOpen(false)}>
                                        <Icons.Grid size={18} /> Личный кабинет
                                    </Link>
                                    <Link href="/account/orders" className={styles.menuItem} onClick={() => setIsProfileMenuOpen(false)}>
                                        <Icons.Package size={18} /> Мои заказы
                                    </Link>
                                    <Link href="/account/documents" className={styles.menuItem} onClick={() => setIsProfileMenuOpen(false)}>
                                        <Icons.FileText size={18} /> Документы
                                    </Link>
                                    <Link href="/account/settings" className={styles.menuItem} onClick={() => setIsProfileMenuOpen(false)}>
                                        <Icons.Settings size={18} /> Настройки
                                    </Link>
                                    <div className={styles.menuDivider}></div>
                                    <button className={styles.logoutBtn} onClick={() => { logout(); setIsProfileMenuOpen(false); }}>
                                        <Icons.Logout size={18} /> Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className={styles.loginBtn} onClick={openAuthModal}>
                            <Icons.User size={18} />
                            <span>Войти</span>
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
