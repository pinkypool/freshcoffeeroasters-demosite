'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Icons } from '@/components/Icons';
import styles from '../account.module.css';

interface OrderItem {
    id: string;
    productName: string;
    productSku: string;
    quantity: number;
    pricePerKg: number;
    total: number;
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

type FilterStatus = 'all' | 'active' | 'completed';

import { useSettings } from '@/context/SettingsContext';

export default function OrdersPage() {
    const { data: session } = useSession();
    const { addToCart } = useCart();
    const { language } = useSettings();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterStatus>('all');

    const content = {
        ru: {
            title: 'Мои заказы',
            subtitle: 'История всех ваших заказов',
            loading: 'Загрузка...',
            filters: {
                all: 'Все',
                active: 'Активные',
                completed: 'Завершённые',
            },
            table: {
                number: '№ Заказа',
                date: 'Дата',
                items: 'Товары',
                total: 'Сумма',
                status: 'Статус',
                actions: 'Действия',
            },
            actions: {
                details: 'Детали',
                repeat: 'Повторить',
                repeatSuccess: 'Товары добавлены в корзину!',
            },
            empty: {
                title: 'Заказы не найдены',
                all: 'У вас пока нет заказов',
                filtered: 'Нет заказов с выбранным фильтром',
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
            title: 'My Orders',
            subtitle: 'History of all your orders',
            loading: 'Loading...',
            filters: {
                all: 'All',
                active: 'Active',
                completed: 'Completed',
            },
            table: {
                number: 'Order #',
                date: 'Date',
                items: 'Items',
                total: 'Total',
                status: 'Status',
                actions: 'Actions',
            },
            actions: {
                details: 'Details',
                repeat: 'Repeat',
                repeatSuccess: 'Items added to cart!',
            },
            empty: {
                title: 'No orders found',
                all: 'You have no orders yet',
                filtered: 'No orders match the selected filter',
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
                .then(data => setOrders(data.orders || []))
                .catch(err => console.error('Fetch error:', err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [session]);

    const activeStatuses = ['PENDING', 'CONFIRMED', 'PAID', 'PROCESSING', 'SHIPPED'];
    const completedStatuses = ['DELIVERED', 'CANCELLED'];

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'active') return activeStatuses.includes(order.status);
        if (filter === 'completed') return completedStatuses.includes(order.status);
        return true;
    });

    const activeCount = orders.filter(o => activeStatuses.includes(o.status)).length;
    const completedCount = orders.filter(o => completedStatuses.includes(o.status)).length;

    const handleRepeatOrder = (orderItems: OrderItem[]) => {
        orderItems.forEach(item => {
            addToCart({
                sku: item.productSku,
                name: item.productName,
                slug: item.productSku.toLowerCase().replace(/_/g, '-'),
                quantity: item.quantity,
                pricePerKg: item.pricePerKg,
                total: item.total,
                image: '/images/coffee-placeholder.jpg',
            });
        });
        alert(t.actions.repeatSuccess);
    };

    if (loading) {
        return <div className={styles.pageHeader}>{t.loading}</div>;
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{t.title}</h1>
                <p className={styles.pageSubtitle}>{t.subtitle}</p>
            </div>

            <div className={styles.filterBar}>
                <button
                    className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                >
                    {t.filters.all} ({orders.length})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'active' ? styles.active : ''}`}
                    onClick={() => setFilter('active')}
                >
                    {t.filters.active} ({activeCount})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'completed' ? styles.active : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    {t.filters.completed} ({completedCount})
                </button>
            </div>

            {filteredOrders.length > 0 ? (
                <div className={styles.recentSection}>
                    <table className={styles.ordersTable}>
                        <thead>
                            <tr>
                                <th>{t.table.number}</th>
                                <th>{t.table.date}</th>
                                <th>{t.table.items}</th>
                                <th>{t.table.total}</th>
                                <th>{t.table.status}</th>
                                <th>{t.table.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td>
                                        <span className={styles.orderNumber}>{order.orderNumber}</span>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        {order.items.map(item => (
                                            <div key={item.id} style={{ fontSize: '12px' }}>
                                                {item.productName} × {item.quantity} {language === 'ru' ? 'кг' : 'kg'}
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
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
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <Link
                                                href={`/account/orders/${order.id}`}
                                                className={styles.actionBtn}
                                            >
                                                <Icons.Eye size={14} /> {t.actions.details}
                                            </Link>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleRepeatOrder(order.items)}
                                            >
                                                <Icons.Repeat size={14} /> {t.actions.repeat}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={styles.recentSection}>
                    <div className={styles.emptyState}>
                        <Icons.Package size={48} className={styles.emptyIcon} />
                        <h3>{t.empty.title}</h3>
                        <p>{filter === 'all' ? t.empty.all : t.empty.filtered}</p>
                    </div>
                </div>
            )}
        </>
    );
}
