'use client';

import React from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { PRODUCTS, Product } from '@/lib/catalog';
import ProductCard from '@/components/ProductCard';
import styles from '../account.module.css';
import { Icons } from '@/components/Icons';
import Link from 'next/link';

export default function FavoritesPage() {
    const { favorites, clearFavorites } = useFavorites();

    const favoriteProducts = PRODUCTS.filter((p: Product) => favorites.includes(p.slug));

    return (
        <div className={styles.pageContent}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Избранное</h1>
                {favorites.length > 0 && (
                    <button
                        className={styles.clearBtn}
                        onClick={clearFavorites}
                    >
                        Очистить всё
                    </button>
                )}
            </div>

            {favoriteProducts.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Icons.Heart size={64} />
                    </div>
                    <h3>Нет избранных товаров</h3>
                    <p>Добавляйте товары в избранное, нажимая на сердечко</p>
                    <Link href="/shop" className={styles.emptyBtn}>
                        <Icons.Package size={18} /> Перейти в магазин
                    </Link>
                </div>
            ) : (
                <div className={styles.productsGrid}>
                    {favoriteProducts.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
