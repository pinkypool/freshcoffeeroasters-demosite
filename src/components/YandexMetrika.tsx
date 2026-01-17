'use client';

// Yandex Metrika component
// Add NEXT_PUBLIC_YANDEX_METRIKA_ID to .env

import Script from 'next/script';

const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

export function YandexMetrika() {
    if (!METRIKA_ID) return null;

    return (
        <>
            <Script id="yandex-metrika" strategy="afterInteractive">
                {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${METRIKA_ID}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            ecommerce:"dataLayer"
          });
        `}
            </Script>
            <noscript>
                <div>
                    <img
                        src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
                        style={{ position: 'absolute', left: '-9999px' }}
                        alt=""
                    />
                </div>
            </noscript>
        </>
    );
}

// E-commerce tracking helpers
export function trackPurchase(orderId: string, products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
}>, total: number) {
    if (typeof window !== 'undefined' && window.ym) {
        window.ym(Number(METRIKA_ID), 'reachGoal', 'purchase', {
            order_id: orderId,
            order_price: total,
            currency: 'KZT',
            products,
        });
    }
}

export function trackAddToCart(product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
}) {
    if (typeof window !== 'undefined' && window.ym) {
        window.ym(Number(METRIKA_ID), 'reachGoal', 'add_to_cart', product);
    }
}

// Add ym to window type
declare global {
    interface Window {
        ym?: (id: number, action: string, goal: string, params?: Record<string, unknown>) => void;
    }
}
