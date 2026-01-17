'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Icons } from '@/components/Icons';
import styles from './account.module.css';
import { useSettings } from '@/context/SettingsContext';

interface OrderItem {
    id: string;
    productName: string;
    productSku: string;
    quantity: number;
    pricePerKg: number;
    total: number;
    product?: {
        id: string;
        name: string;
        image: string | null;
    };
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    items: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: '#FF9800',
    CONFIRMED: '#2196F3',
    PAID: '#4CAF50',
    PROCESSING: '#9C27B0',
    SHIPPED: '#00BCD4',
    DELIVERED: '#4CAF50',
    CANCELLED: '#F44336',
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function AccountPage() {
    const { data: session, status } = useSession();
    const { language } = useSettings();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const content = {
        ru: {
            welcome: 'Добро пожаловать',
            subtitle: 'Управляйте заказами и настройками аккаунта',
            loading: 'Загрузка...',
            totalOrders: 'Всего заказов',
            activeOrders: 'Активных',
            totalSpent: 'Сумма заказов',
            recentOrders: 'Последние заказы',
            viewAll: 'Все заказы',
            table: {
                number: '№ Заказа',
                date: 'Дата',
                total: 'Сумма',
                status: 'Статус',
            },
            empty: {
                title: 'Пока нет заказов',
                text: 'Оформите первый заказ в нашем магазине',
                btn: 'Перейти в магазин',
            },
            status: {
                PENDING: 'Новый',
                CONFIRMED: 'Подтверждён',
                PAID: 'Оплачен',
                PROCESSING: 'В обработке',
                SHIPPED: 'Отправлен',
                DELIVERED: 'Доставлен',
                CANCELLED: 'Отменён',
            }
        },
        en: {
            welcome: 'Welcome',
            subtitle: 'Manage your orders and account settings',
            loading: 'Loading...',
            totalOrders: 'Total Orders',
            activeOrders: 'Active',
            totalSpent: 'Total Spent',
            recentOrders: 'Recent Orders',
            viewAll: 'All Orders',
            table: {
                number: 'Order #',
                date: 'Date',
                total: 'Total',
                status: 'Status',
            },
            empty: {
                title: 'No orders yet',
                text: 'Place your first order in our shop',
                btn: 'Go to Shop',
            },
            status: {
                PENDING: 'New',
                CONFIRMED: 'Confirmed',
                PAID: 'Paid',
                PROCESSING: 'Processing',
                SHIPPED: 'Shipped',
                DELIVERED: 'Delivered',
                CANCELLED: 'Cancelled',
            }
        },
    };

    const t = content[language];

    useEffect(() => {
        if (session?.user) {
            fetch('/api/user/orders')
                .then(res => res.json())
                .then(data => {
                    setOrders(data.orders || []);
                })
                .catch(err => console.error('Fetch orders error:', err))
                .finally(() => setLoading(false));
        } else if (status !== 'loading') {
            setLoading(false);
        }
    }, [session, status]);

    const totalOrders = orders.length;
    const activeOrders = orders.filter(o =>
        ['PENDING', 'CONFIRMED', 'PAID', 'PROCESSING', 'SHIPPED'].includes(o.status)
    ).length;
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    const recentOrders = orders.slice(0, 5);

    if (loading) {
        return <div className={styles.pageHeader}>{t.loading}</div>;
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>
                    {t.welcome}{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
                </h1>
                <p className={styles.pageSubtitle}>{t.subtitle}</p>
            </div>

            {/* Dashboard Cards */}
            <div className={styles.dashboardGrid}>
                <Link href="/account/orders" className={styles.dashCard}>
                    <div className={styles.dashIcon}>
                        <Icons.Package size={28} />
                    </div>
                    <div className={styles.dashInfo}>
                        <h4>{t.totalOrders}</h4>
                        <span className={styles.dashValue}>{totalOrders}</span>
                    </div>
                </Link>

                <Link href="/account/orders?status=active" className={styles.dashCard}>
                    <div className={styles.dashIcon} style={{ background: '#FF9800' }}>
                        <Icons.Truck size={28} />
                    </div>
                    <div className={styles.dashInfo}>
                        <h4>{t.activeOrders}</h4>
                        <span className={styles.dashValue}>{activeOrders}</span>
                    </div>
                </Link>

                <div className={styles.dashCard}>
                    <div className={styles.dashIcon} style={{ background: '#4CAF50' }}>
                        <Icons.Currency size={28} />
                    </div>
                    <div className={styles.dashInfo}>
                        <h4>{t.totalSpent}</h4>
                        <span className={styles.dashValue}>{formatPrice(totalSpent)}</span>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className={styles.recentSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{t.recentOrders}</h2>
                    <Link href="/account/orders" className={styles.sectionLink}>
                        {t.viewAll} <Icons.ChevronRight size={16} />
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <table className={styles.ordersTable}>
                        <thead>
                            <tr>
                                <th>{t.table.number}</th>
                                <th>{t.table.date}</th>
                                <th>{t.table.total}</th>
                                <th>{t.table.status}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <span className={styles.orderNumber}>{order.orderNumber}</span>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>{formatPrice(order.total)}</td>
                                    <td>
                                        <span
                                            className={styles.statusBadge}
                                            style={{
                                                background: `${STATUS_COLORS[order.status] || '#666'}20`,
                                                color: STATUS_COLORS[order.status] || '#666',
                                            }}
                                        >
                                            {t.status[order.status as keyof typeof t.status] || order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <Icons.Package size={48} className={styles.emptyIcon} />
                        <h3>{t.empty.title}</h3>
                        <p>{t.empty.text}</p>
                        <Link href="/" className={styles.emptyBtn}>
                            <Icons.Cart size={18} /> {t.empty.btn}
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
