'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './CartSidebar.module.css';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
    const { isCartOpen, closeCart, items, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const router = useRouter();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const lastActiveElementRef = useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const requestClose = useMemo(() => {
        return (afterClose?: () => void) => {
            closeCart();
            afterClose?.();
        };
    }, [closeCart]);

    const handleCheckout = () => {
        // let the closing animation start before navigation
        closeCart();
        window.setTimeout(() => router.push('/checkout'), 120);
    };

    // Only compute after mount to prevent hydration mismatch
    const displayItems = mounted ? items : [];

    const itemCountLabel = useMemo(() => {
        if (displayItems.length === 0) return 'Корзина пуста';
        if (displayItems.length === 1) return '1 позиция';
        if (displayItems.length >= 2 && displayItems.length <= 4) return `${displayItems.length} позиции`;
        return `${displayItems.length} позиций`;
    }, [displayItems.length]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') requestClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [requestClose]);

    // Focus management + simple focus trap
    useEffect(() => {
        if (!isCartOpen) return;

        lastActiveElementRef.current = document.activeElement as HTMLElement | null;
        closeBtnRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            const root = sidebarRef.current;
            if (!root) return;

            const focusables = Array.from(
                root.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter((el) => !el.hasAttribute('aria-hidden'));

            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;

            if (e.shiftKey) {
                if (!active || active === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            lastActiveElementRef.current?.focus?.();
        };
    }, [isCartOpen]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    return (
        <>
            <div
                className={`${styles.overlay} ${isCartOpen ? styles.open : ''}`}
                onClick={() => requestClose()}
                aria-hidden="true"
            />
            <div
                className={`${styles.sidebar} ${isCartOpen ? styles.open : ''}`}
                ref={sidebarRef}
                role="dialog"
                aria-modal="true"
                aria-label="Корзина"
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>Корзина • {itemCountLabel}</h2>
                    <button className={styles.closeBtn} onClick={() => requestClose()} ref={closeBtnRef} aria-label="Закрыть корзину">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className={styles.content}>
                    {displayItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <p>Ваша корзина пуста</p>
                        </div>
                    ) : (
                        displayItems.map((item) => (
                            <div key={item.sku} className={styles.cartItem}>
                                <div className={styles.itemImageWrapper}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        className={styles.itemImage}
                                    />
                                </div>
                                <div className={styles.itemDetails}>
                                    <div className={styles.itemName}>{item.name}</div>
                                    <div className={styles.itemMetaRow}>
                                        <div className={styles.itemPrice}>
                                            {item.quantity} кг × {item.pricePerKg.toLocaleString('ru-RU')} ₸
                                        </div>
                                        <div className={styles.itemTotal}>{item.total.toLocaleString('ru-RU')} ₸</div>
                                    </div>
                                    <div className={styles.quantityControls}>
                                        <button
                                            className={styles.qtyBtn}
                                            aria-label="Уменьшить количество"
                                            onClick={() => {
                                                if (item.quantity > 1) {
                                                    updateQuantity(item.sku, item.quantity - 1);
                                                }
                                            }}
                                        >
                                            -
                                        </button>
                                        <label className={styles.srOnly} htmlFor={`qty-${item.sku}`}>Количество (кг)</label>
                                        <input
                                            id={`qty-${item.sku}`}
                                            className={styles.qtyInput}
                                            type="number"
                                            inputMode="numeric"
                                            min={1}
                                            step={1}
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const next = Math.max(1, Math.round(Number(e.target.value || 1)));
                                                updateQuantity(item.sku, next);
                                            }}
                                        />
                                        <button
                                            className={styles.qtyBtn}
                                            aria-label="Увеличить количество"
                                            onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeFromCart(item.sku)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {displayItems.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Итого:</span>
                            <span className={styles.totalValue}>{getCartTotal().toLocaleString('ru-RU')} ₸</span>
                        </div>
                        <button className={styles.checkoutBtn} onClick={handleCheckout}>
                            Оформить заказ
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
