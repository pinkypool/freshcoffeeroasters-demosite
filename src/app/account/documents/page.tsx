'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Icons } from '@/components/Icons';
import styles from '../account.module.css';

interface Document {
    id: string;
    name: string;
    size: number;
    createdAt: string;
    downloadUrl: string;
    orderId: string;
    orderNumber: string;
}

interface Order {
    id: string;
    orderNumber: string;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

import { useSettings } from '@/context/SettingsContext';

export default function DocumentsPage() {
    const { data: session } = useSession();
    const { language } = useSettings();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const content = {
        ru: {
            title: 'Документы',
            subtitle: 'Счета, УПД и накладные по вашим заказам',
            loading: 'Загрузка...',
            update: 'Обновить',
            updating: 'Обновление...',
            download: 'Скачать',
            order: 'Заказ',
            empty: {
                title: 'Документов пока нет',
                text: 'Счета и другие документы появятся после оформления заказов',
                note: 'Для оптовых заказов: счёт формируется в рабочие дни (пн-пт, 9:00-18:00)',
            }
        },
        en: {
            title: 'Documents',
            subtitle: 'Invoices and waybills for your orders',
            loading: 'Loading...',
            update: 'Update',
            updating: 'Updating...',
            download: 'Download',
            order: 'Order',
            empty: {
                title: 'No documents yet',
                text: 'Invoices and other documents will appear after placing orders',
                note: 'For wholesale orders: invoice is generated on business days (Mon-Fri, 9:00-18:00)',
            }
        },
    };

    const t = content[language];

    const fetchAllDocuments = async () => {
        if (!session?.user) return;

        setSyncing(true);
        try {
            // First get all orders
            const ordersRes = await fetch('/api/user/orders');
            const ordersData = await ordersRes.json();
            const orders: Order[] = ordersData.orders || [];

            // Then fetch documents for each order
            const allDocs: Document[] = [];

            for (const order of orders) {
                try {
                    const docsRes = await fetch(`/api/user/orders/${order.id}/documents`);
                    const docsData = await docsRes.json();

                    if (docsData.documents?.length > 0) {
                        const docsWithOrder = docsData.documents.map((doc: Omit<Document, 'orderId' | 'orderNumber'>) => ({
                            ...doc,
                            orderId: order.id,
                            orderNumber: order.orderNumber,
                        }));
                        allDocs.push(...docsWithOrder);
                    }
                } catch (err) {
                    console.error('Fetch docs error for order:', order.id, err);
                }
            }

            // Sort by date, newest first
            allDocs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setDocuments(allDocs);
        } catch (err) {
            console.error('Fetch orders error:', err);
        } finally {
            setSyncing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchAllDocuments();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    if (loading) {
        return <div className={styles.pageHeader}>{t.loading}</div>;
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className={styles.pageTitle}>{t.title}</h1>
                        <p className={styles.pageSubtitle}>{t.subtitle}</p>
                    </div>
                    <button
                        onClick={fetchAllDocuments}
                        disabled={syncing}
                        className={styles.actionBtn}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Icons.Repeat size={16} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
                        {syncing ? t.updating : t.update}
                    </button>
                </div>
            </div>

            {documents.length > 0 ? (
                <div className={styles.recentSection}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {documents.map(doc => (
                            <div
                                key={doc.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px',
                                    background: '#F5F5F5',
                                    borderRadius: '12px',
                                }}
                            >
                                <Icons.FileText size={28} style={{ color: '#4849e8' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>{doc.name}</div>
                                    <div style={{ fontSize: '13px', color: '#666' }}>
                                        <Link
                                            href={`/account/orders/${doc.orderId}`}
                                            style={{ color: '#4849e8', textDecoration: 'none' }}
                                        >
                                            {t.order} {doc.orderNumber}
                                        </Link>
                                        {' • '}
                                        {formatFileSize(doc.size)}
                                        {' • '}
                                        {formatDate(doc.createdAt)}
                                    </div>
                                </div>
                                <a
                                    href={doc.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.actionBtn}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Icons.Download size={16} /> {t.download}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={styles.recentSection}>
                    <div style={{
                        padding: '48px 24px',
                        textAlign: 'center',
                        background: '#FFF8E1',
                        borderRadius: '12px',
                        color: '#5D4037',
                    }}>
                        <Icons.FileText size={48} style={{ marginBottom: '16px', color: '#F9A825', opacity: 0.6 }} />
                        <h3 style={{ margin: '0 0 8px' }}>{t.empty.title}</h3>
                        <p style={{ margin: 0, fontSize: '14px' }}>
                            {t.empty.text}
                        </p>
                        <p style={{ fontSize: '12px', color: '#888', marginTop: '12px' }}>
                            {t.empty.note}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
