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

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Новый',
    CONFIRMED: 'Подтверждён',
    PAID: 'Оплачен',
    PROCESSING: 'В обработке',
    SHIPPED: 'Отправлен',
    DELIVERED: 'Доставлен',
    CANCELLED: 'Отменён',
};

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

export default function OrdersPage() {
    const { data: session } = useSession();
    const { addToCart } = useCart();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterStatus>('all');

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
        alert('Товары добавлены в корзину!');
    };

    if (loading) {
        return <div className={styles.pageHeader}>Загрузка...</div>;
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Мои заказы</h1>
                <p className={styles.pageSubtitle}>История всех ваших заказов</p>
            </div>

            <div className={styles.filterBar}>
                <button
                    className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Все ({orders.length})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'active' ? styles.active : ''}`}
                    onClick={() => setFilter('active')}
                >
                    Активные ({activeCount})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'completed' ? styles.active : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Завершённые ({completedCount})
                </button>
            </div>

            {filteredOrders.length > 0 ? (
                <div className={styles.recentSection}>
                    <table className={styles.ordersTable}>
                        <thead>
                            <tr>
                                <th>№ Заказа</th>
                                <th>Дата</th>
                                <th>Товары</th>
                                <th>Сумма</th>
                                <th>Статус</th>
                                <th>Действия</th>
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
                                                {item.productName} × {item.quantity} кг
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
                                            {STATUS_LABELS[order.status] || order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <Link
                                                href={`/account/orders/${order.id}`}
                                                className={styles.actionBtn}
                                            >
                                                <Icons.Eye size={14} /> Детали
                                            </Link>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleRepeatOrder(order.items)}
                                            >
                                                <Icons.Repeat size={14} /> Повторить
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
                        <h3>Заказы не найдены</h3>
                        <p>{filter === 'all' ? 'У вас пока нет заказов' : 'Нет заказов с выбранным фильтром'}</p>
                    </div>
                </div>
            )}
        </>
    );
}
