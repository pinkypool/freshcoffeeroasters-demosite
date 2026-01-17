'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Icons } from '@/components/Icons';
import styles from '../../account.module.css';
import { useParams } from 'next/navigation';

interface OrderItem {
    id: string;
    productName: string;
    productSku: string;
    quantity: number;
    pricePerKg: number;
    total: number;
}

interface Document {
    id: string;
    name: string;
    size: number;
    createdAt: string;
    downloadUrl: string;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    total: number;
    createdAt: string;
    city: string;
    address: string | null;
    deliveryMethod: string;
    items: OrderItem[];
}

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Ожидает обработки',
    CONFIRMED: 'Подтверждён',
    PAID: 'Оплачен',
    PROCESSING: 'В обработке',
    SHIPPED: 'Отправлен',
    DELIVERED: 'Доставлен',
    CANCELLED: 'Отменён',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
    PENDING: 'Ожидает оплаты',
    PAID: 'Оплачен',
    FAILED: 'Ошибка оплаты',
    REFUNDED: 'Возврат',
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
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function OrderDetailsPage() {
    const { data: session } = useSession();
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentsMessage, setDocumentsMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const fetchDocuments = async () => {
        if (!orderId) return;
        setSyncing(true);
        try {
            const res = await fetch(`/api/user/orders/${orderId}/documents`);
            const data = await res.json();
            setDocuments(data.documents || []);
            setDocumentsMessage(data.message || null);
        } catch (err) {
            console.error('Fetch docs error:', err);
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        if (session?.user && orderId) {
            // Fetch order details
            fetch(`/api/user/orders`)
                .then(res => res.json())
                .then(data => {
                    const found = data.orders?.find((o: Order) => o.id === orderId);
                    setOrder(found || null);
                })
                .catch(err => console.error('Fetch order error:', err))
                .finally(() => setLoading(false));

            // Fetch documents
            fetchDocuments();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, orderId]);

    if (loading) {
        return <div className={styles.pageHeader}>Загрузка...</div>;
    }

    if (!order) {
        return (
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Заказ не найден</h1>
                <Link href="/account/orders">← Назад к заказам</Link>
            </div>
        );
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <Link href="/account/orders" style={{ color: '#666', marginBottom: '8px', display: 'inline-block' }}>
                    ← Назад к заказам
                </Link>
                <h1 className={styles.pageTitle}>Заказ {order.orderNumber}</h1>
                <p className={styles.pageSubtitle}>от {formatDate(order.createdAt)}</p>
            </div>

            {/* Order Status */}
            <div className={styles.recentSection} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                        <span style={{ color: '#666', fontSize: '14px' }}>Статус заказа:</span>
                        <span
                            className={styles.statusBadge}
                            style={{
                                marginLeft: '8px',
                                background: `${STATUS_COLORS[order.status] || '#666'}20`,
                                color: STATUS_COLORS[order.status] || '#666',
                            }}
                        >
                            {STATUS_LABELS[order.status] || order.status}
                        </span>
                    </div>
                    <div>
                        <span style={{ color: '#666', fontSize: '14px' }}>Оплата:</span>
                        <span
                            className={styles.statusBadge}
                            style={{
                                marginLeft: '8px',
                                background: order.paymentStatus === 'PAID' ? '#E8F5E9' : '#FFF8E1',
                                color: order.paymentStatus === 'PAID' ? '#4CAF50' : '#F9A825',
                            }}
                        >
                            {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                        </span>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className={styles.recentSection} style={{ marginBottom: '24px' }}>
                <h2 className={styles.sectionTitle}>Товары</h2>
                <table className={styles.ordersTable}>
                    <thead>
                        <tr>
                            <th>Товар</th>
                            <th>Количество</th>
                            <th>Цена за кг</th>
                            <th>Сумма</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                            <tr key={item.id}>
                                <td>{item.productName}</td>
                                <td>{item.quantity} кг</td>
                                <td>{formatPrice(item.pricePerKg)}</td>
                                <td style={{ fontWeight: 600 }}>{formatPrice(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '18px', fontWeight: 600 }}>
                    Итого: {formatPrice(order.total)}
                </div>
            </div>

            {/* Delivery Info */}
            <div className={styles.recentSection} style={{ marginBottom: '24px' }}>
                <h2 className={styles.sectionTitle}>Доставка</h2>
                <p><strong>Город:</strong> {order.city}</p>
                <p><strong>Способ:</strong> {order.deliveryMethod === 'teez' ? 'ПВЗ Teez' : 'Курьер'}</p>
                {order.address && <p><strong>Адрес:</strong> {order.address}</p>}
            </div>

            {/* Documents */}
            <div className={styles.recentSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                        <Icons.FileText size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Документы
                    </h2>
                    <button
                        onClick={fetchDocuments}
                        disabled={syncing}
                        className={styles.actionBtn}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Icons.Repeat size={16} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
                        {syncing ? 'Обновление...' : 'Обновить'}
                    </button>
                </div>

                {documents.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {documents.map(doc => (
                            <div
                                key={doc.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    background: '#F5F5F5',
                                    borderRadius: '8px',
                                }}
                            >
                                <Icons.FileText size={24} style={{ color: '#4849e8' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500 }}>{doc.name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {formatFileSize(doc.size)} • {formatDate(doc.createdAt)}
                                    </div>
                                </div>
                                <a
                                    href={doc.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.actionBtn}
                                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Icons.Download size={16} /> Скачать
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        padding: '24px',
                        textAlign: 'center',
                        background: '#FFF8E1',
                        borderRadius: '12px',
                        color: '#5D4037',
                    }}>
                        <Icons.Clock size={32} style={{ marginBottom: '8px', color: '#F9A825' }} />
                        <p style={{ margin: 0 }}>
                            {documentsMessage || 'Документы ещё не загружены'}
                        </p>
                        {order.paymentMethod === 'invoice' && (
                            <p style={{ fontSize: '14px', marginTop: '8px', color: '#888' }}>
                                Счёт формируется в рабочие дни (пн-пт, 9:00-18:00)
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
