// src/components/GoogleAnalytics.tsx
'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
    gaId?: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
    const measurementId = gaId || process.env.NEXT_PUBLIC_GA_ID;

    if (!measurementId) {
        return null; // Don't render if no GA ID
    }

    return (
        <>
            {/* Google Analytics 4 */}
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
                }}
            />
        </>
    );
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}

// E-commerce tracking
export function trackPurchase(orderId: string, total: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) {
    if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', 'purchase', {
            transaction_id: orderId,
            value: total,
            currency: 'KZT',
            items: items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
        });
    }
}
