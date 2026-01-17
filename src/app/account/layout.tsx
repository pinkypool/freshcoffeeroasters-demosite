'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Icons } from '@/components/Icons';
import styles from './account.module.css';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, user, logout, openAuthModal } = useAuth();

    // If not authenticated, show login prompt
    if (!isAuthenticated || !user) {
        return (
            <div className={styles.content} style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Icons.User size={64} />
                    </div>
                    <h3>Войдите в аккаунт</h3>
                    <p>Для доступа к личному кабинету необходимо авторизоваться</p>
                    <button className={styles.emptyBtn} onClick={openAuthModal}>
                        <Icons.User size={18} /> Войти
                    </button>
                </div>
            </div>
        );
    }

    const navItems = [
        { href: '/account', label: 'Обзор', icon: Icons.Grid },
        { href: '/account/orders', label: 'Мои заказы', icon: Icons.Package },
        { href: '/account/favorites', label: 'Избранное', icon: Icons.Heart },
        { href: '/account/companies', label: 'Мои компании', icon: Icons.Office },
        { href: '/account/manager', label: 'Ваш менеджер', icon: Icons.User },
        { href: '/account/documents', label: 'Документы', icon: Icons.FileText },
        { href: '/account/settings', label: 'Настройки', icon: Icons.Settings },
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
                        <span>{user.type === 'WHOLESALE' ? 'Оптовик' : 'Розница'}</span>
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
                        <Icons.Logout size={20} /> Выйти
                    </button>
                </nav>
            </aside>

            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
