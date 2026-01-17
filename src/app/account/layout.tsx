'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Icons } from '@/components/Icons';
import styles from './account.module.css';

import { useSettings } from '@/context/SettingsContext';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, user, logout, openAuthModal } = useAuth();
    const { language } = useSettings();

    const content = {
        ru: {
            loginTitle: 'Войдите в аккаунт',
            loginText: 'Для доступа к личному кабинету необходимо авторизоваться',
            loginBtn: 'Войти',
            nav: {
                overview: 'Обзор',
                orders: 'Мои заказы',
                favorites: 'Избранное',
                companies: 'Мои компании',
                manager: 'Ваш менеджер',
                documents: 'Документы',
                settings: 'Настройки',
                logout: 'Выйти',
            },
            roles: {
                wholesale: 'Оптовик',
                retail: 'Розница',
            }
        },
        en: {
            loginTitle: 'Sign In',
            loginText: 'Please sign in to access your account',
            loginBtn: 'Sign In',
            nav: {
                overview: 'Overview',
                orders: 'My Orders',
                favorites: 'Favorites',
                companies: 'My Companies',
                manager: 'Your Manager',
                documents: 'Documents',
                settings: 'Settings',
                logout: 'Sign Out',
            },
            roles: {
                wholesale: 'Wholesale',
                retail: 'Retail',
            }
        },
    };

    const t = content[language];

    // If not authenticated, show login prompt
    if (!isAuthenticated || !user) {
        return (
            <div className={styles.content} style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Icons.User size={64} />
                    </div>
                    <h3>{t.loginTitle}</h3>
                    <p>{t.loginText}</p>
                    <button className={styles.emptyBtn} onClick={openAuthModal}>
                        <Icons.User size={18} /> {t.loginBtn}
                    </button>
                </div>
            </div>
        );
    }

    const navItems = [
        { href: '/account', label: t.nav.overview, icon: Icons.Grid },
        { href: '/account/orders', label: t.nav.orders, icon: Icons.Package },
        { href: '/account/favorites', label: t.nav.favorites, icon: Icons.Heart },
        { href: '/account/companies', label: t.nav.companies, icon: Icons.Office },
        { href: '/account/manager', label: t.nav.manager, icon: Icons.User },
        { href: '/account/documents', label: t.nav.documents, icon: Icons.FileText },
        { href: '/account/settings', label: t.nav.settings, icon: Icons.Settings },
    ];

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className={styles.accountLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarAvatar}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.sidebarInfo}>
                        <h3>{user.name}</h3>
                        <span>{user.type === 'WHOLESALE' ? t.roles.wholesale : t.roles.retail}</span>
                    </div>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                        >
                            <item.icon size={20} /> {item.label}
                        </Link>
                    ))}

                    <div className={styles.navDivider}></div>

                    <button
                        className={`${styles.navItem} ${styles.logoutItem}`}
                        onClick={handleLogout}
                    >
                        <Icons.Logout size={20} /> {t.nav.logout}
                    </button>
                </nav>
            </aside>

            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
