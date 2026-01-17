'use client';

import React from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { PRODUCTS, Product } from '@/lib/catalog';
import ProductCard from '@/components/ProductCard';
import styles from '../account.module.css';
import { Icons } from '@/components/Icons';
import Link from 'next/link';

import { useSettings } from '@/context/SettingsContext';

export default function FavoritesPage() {
    const { favorites, clearFavorites } = useFavorites();
    const { language } = useSettings();

    const favoriteProducts = PRODUCTS.filter((p: Product) => favorites.includes(p.slug));

    const content = {
        ru: {
            title: 'Избранное',
            clear: 'Очистить всё',
            empty: {
                title: 'Нет избранных товаров',
                text: 'Добавляйте товары в избранное, нажимая на сердечко',
                btn: 'Перейти в магазин',
            }
        },
        en: {
            title: 'Favorites',
            clear: 'Clear All',
            empty: {
                title: 'No favorite items',
                text: 'Add items to favorites by clicking the heart icon',
                btn: 'Go to Shop',
            }
        },
    };

    const t = content[language];

    return (
        <div className={styles.pageContent}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{t.title}</h1>
                {favorites.length > 0 && (
                    <button
                        className={styles.clearBtn}
                        onClick={clearFavorites}
                    >
                        {t.clear}
                    </button>
                )}
            </div>

            {favoriteProducts.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Icons.Heart size={64} />
                    </div>
                    <h3>{t.empty.title}</h3>
                    <p>{t.empty.text}</p>
                    <Link href="/shop" className={styles.emptyBtn}>
                        <Icons.Package size={18} /> {t.empty.btn}
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
