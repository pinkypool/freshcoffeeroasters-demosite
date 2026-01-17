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

import { useSettings } from '@/context/SettingsContext';

export default function OrderDetailsPage() {
    const { data: session } = useSession();
    const params = useParams();
    const orderId = params.id as string;
    const { language } = useSettings();

    const [order, setOrder] = useState<Order | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentsMessage, setDocumentsMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const content = {
        ru: {
            loading: 'Загрузка...',
            notFound: 'Заказ не найден',
            back: '← Назад к заказам',
            order: 'Заказ',
            from: 'от',
            statusLabel: 'Статус заказа:',
            paymentLabel: 'Оплата:',
            items: {
                title: 'Товары',
                product: 'Товар',
                quantity: 'Количество',
                price: 'Цена за кг',
                sum: 'Сумма',
                total: 'Итого:',
            },
            delivery: {
                title: 'Доставка',
                city: 'Город:',
                method: 'Способ:',
                address: 'Адрес:',
                methods: {
                    teez: 'ПВЗ Teez',
                    courier: 'Курьер',
                }
            },
            documents: {
                title: 'Документы',
                update: 'Обновить',
                updating: 'Обновление...',
                download: 'Скачать',
                empty: 'Документы ещё не загружены',
                invoiceNote: 'Счёт формируется в рабочие дни (пн-пт, 9:00-18:00)',
            },
            status: {
                PENDING: 'Ожидает обработки',
                CONFIRMED: 'Подтверждён',
                PAID: 'Оплачен',
                PROCESSING: 'В обработке',
                SHIPPED: 'Отправлен',
                DELIVERED: 'Доставлен',
                CANCELLED: 'Отменён',
            },
            paymentStatus: {
                PENDING: 'Ожидает оплаты',
                PAID: 'Оплачен',
                FAILED: 'Ошибка оплаты',
                REFUNDED: 'Возврат',
            }
        },
        en: {
            loading: 'Loading...',
            notFound: 'Order not found',
            back: '← Back to orders',
            order: 'Order',
            from: 'from',
            statusLabel: 'Order Status:',
            paymentLabel: 'Payment:',
            items: {
                title: 'Items',
                product: 'Product',
                quantity: 'Quantity',
                price: 'Price per kg',
                sum: 'Total',
                total: 'Total:',
            },
            delivery: {
                title: 'Delivery',
                city: 'City:',
                method: 'Method:',
                address: 'Address:',
                methods: {
                    teez: 'Teez Pickup',
                    courier: 'Courier',
                }
            },
            documents: {
                title: 'Documents',
                update: 'Update',
                updating: 'Updating...',
                download: 'Download',
                empty: 'No documents yet',
                invoiceNote: 'Invoice is generated on business days (Mon-Fri, 9:00-18:00)',
            },
            status: {
                PENDING: 'Pending',
                CONFIRMED: 'Confirmed',
                PAID: 'Paid',
                PROCESSING: 'Processing',
                SHIPPED: 'Shipped',
                DELIVERED: 'Delivered',
                CANCELLED: 'Cancelled',
            },
            paymentStatus: {
                PENDING: 'Pending Payment',
                PAID: 'Paid',
                FAILED: 'Payment Failed',
                REFUNDED: 'Refunded',
            }
        },
    };

    const t = content[language];

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
        return <div className={styles.pageHeader}>{t.loading}</div>;
    }

    if (!order) {
        return (
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{t.notFound}</h1>
                <Link href="/account/orders">{t.back}</Link>
            </div>
        );
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <Link href="/account/orders" style={{ color: '#666', marginBottom: '8px', display: 'inline-block' }}>
                    {t.back}
                </Link>
                <h1 className={styles.pageTitle}>{t.order} {order.orderNumber}</h1>
                <p className={styles.pageSubtitle}>{t.from} {formatDate(order.createdAt)}</p>
            </div>

            {/* Order Status */}
            <div className={styles.recentSection} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                        <span style={{ color: '#666', fontSize: '14px' }}>{t.statusLabel}</span>
                        <span
                            className={styles.statusBadge}
                            style={{
                                marginLeft: '8px',
                                background: `${STATUS_COLORS[order.status] || '#666'}20`,
                                color: STATUS_COLORS[order.status] || '#666',
                            }}
                        >
                            {t.status[order.status as keyof typeof t.status] || order.status}
                        </span>
                    </div>
                    <div>
                        <span style={{ color: '#666', fontSize: '14px' }}>{t.paymentLabel}</span>
                        <span
                            className={styles.statusBadge}
                            style={{
                                marginLeft: '8px',
                                background: order.paymentStatus === 'PAID' ? '#E8F5E9' : '#FFF8E1',
                                color: order.paymentStatus === 'PAID' ? '#4CAF50' : '#F9A825',
                            }}
                        >
                            {t.paymentStatus[order.paymentStatus as keyof typeof t.paymentStatus] || order.paymentStatus}
                        </span>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className={styles.recentSection} style={{ marginBottom: '24px' }}>
                <h2 className={styles.sectionTitle}>{t.items.title}</h2>
                <table className={styles.ordersTable}>
                    <thead>
                        <tr>
                            <th>{t.items.product}</th>
                            <th>{t.items.quantity}</th>
                            <th>{t.items.price}</th>
                            <th>{t.items.sum}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                            <tr key={item.id}>
                                <td>{item.productName}</td>
                                <td>{item.quantity} {language === 'ru' ? 'кг' : 'kg'}</td>
                                <td>{formatPrice(item.pricePerKg)}</td>
                                <td style={{ fontWeight: 600 }}>{formatPrice(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '18px', fontWeight: 600 }}>
                    {t.items.total} {formatPrice(order.total)}
                </div>
            </div>

            {/* Delivery Info */}
            <div className={styles.recentSection} style={{ marginBottom: '24px' }}>
                <h2 className={styles.sectionTitle}>{t.delivery.title}</h2>
                <p><strong>{t.delivery.city}</strong> {order.city}</p>
                <p><strong>{t.delivery.method}</strong> {order.deliveryMethod === 'teez' ? t.delivery.methods.teez : t.delivery.methods.courier}</p>
                {order.address && <p><strong>{t.delivery.address}</strong> {order.address}</p>}
            </div>

            {/* Documents */}
            <div className={styles.recentSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                        <Icons.FileText size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        {t.documents.title}
                    </h2>
                    <button
                        onClick={fetchDocuments}
                        disabled={syncing}
                        className={styles.actionBtn}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Icons.Repeat size={16} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
                        {syncing ? t.documents.updating : t.documents.update}
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
                                    <Icons.Download size={16} /> {t.documents.download}
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
                            {documentsMessage || t.documents.empty}
                        </p>
                        {order.paymentMethod === 'invoice' && (
                            <p style={{ fontSize: '14px', marginTop: '8px', color: '#888' }}>
                                {t.documents.invoiceNote}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
