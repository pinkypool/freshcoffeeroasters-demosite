'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function CartPage() {
    const { items, removeFromCart, getCartTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className={styles.emptyCart}>
                <h1 className={styles.title}>Корзина пуста</h1>
                <p className={styles.emptyText}>Добавьте товары из нашего каталога</p>
                <Link href="/shop" className={styles.shopBtn}>
                    Перейти в магазин
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.cartContainer}>
            <h1 className={styles.title}>Корзина</h1>

            <div className={styles.cartItems}>
                {items.map((item) => (
                    <div key={item.sku} className={styles.cartItem}>
                        <div className={styles.itemImage}>
                            <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div className={styles.itemInfo}>
                            <h3 className={styles.itemName}>{item.name}</h3>
                            <p className={styles.itemMeta}>
                                {item.quantity} кг × {item.pricePerKg.toLocaleString('ru-RU')} ₸/кг
                            </p>
                        </div>
                        <div className={styles.itemTotal}>
                            {item.total.toLocaleString('ru-RU')} ₸
                        </div>
                        <button
                            className={styles.removeBtn}
                            onClick={() => removeFromCart(item.sku)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.cartSummary}>
                <div className={styles.summaryRow}>
                    <span>Итого:</span>
                    <span className={styles.totalPrice}>{getCartTotal().toLocaleString('ru-RU')} ₸</span>
                </div>
                <div className={styles.actions}>
                    <button className={styles.clearBtn} onClick={clearCart}>
                        Очистить корзину
                    </button>
                    <Link href="/checkout" className={styles.checkoutBtn}>
                        Оформить заказ
                    </Link>
                </div>
            </div>
        </div>
    );
}
