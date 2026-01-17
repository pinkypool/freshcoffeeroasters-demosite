'use client';

import React, { useMemo, useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';
import { Product, PRODUCTS as FALLBACK_PRODUCTS } from '@/lib/catalog';

type FilterType = 'all' | 'espresso' | 'arabica' | 'robusta';
type SortType = 'popular' | 'priceAsc' | 'priceDesc' | 'ratingDesc';

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortType>('popular');

    // Fetch products from database
    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.products?.length > 0) {
                    setProducts(data.products);
                }
            })
            .catch(err => console.error('Fetch products error:', err))
            .finally(() => setLoading(false));
    }, []);

    const isMatchFilter = (slug: string, nextFilter: FilterType) => {
        if (nextFilter === 'all') return true;
        if (nextFilter === 'espresso') return slug.includes('espresso');
        if (nextFilter === 'arabica') return slug.includes('brazil') || slug.includes('alfenas');
        if (nextFilter === 'robusta') return slug.includes('robusta') || slug.includes('vending');
        return true;
    };

    const filterCounts = useMemo(() => {
        const counts: Record<FilterType, number> = { all: products.length, espresso: 0, arabica: 0, robusta: 0 };
        for (const p of products) {
            if (p.slug.includes('espresso')) counts.espresso += 1;
            if (p.slug.includes('brazil') || p.slug.includes('alfenas')) counts.arabica += 1;
            if (p.slug.includes('robusta') || p.slug.includes('vending')) counts.robusta += 1;
        }
        return counts;
    }, [products]);

    const visibleProducts = useMemo(() => {
        const q = query.trim().toLowerCase();

        const list = products
            .filter((p) => isMatchFilter(p.slug, filter))
            .filter((p) => {
                if (!q) return true;
                return (
                    p.name.toLowerCase().includes(q) ||
                    p.subtitle.toLowerCase().includes(q) ||
                    (p.flavorNotes && p.flavorNotes.some((n) => n.toLowerCase().includes(q)))
                );
            });

        const sorted = [...list];
        if (sort === 'ratingDesc') sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        if (sort === 'priceAsc') sorted.sort((a, b) => (a.pricePerKg ?? 0) - (b.pricePerKg ?? 0));
        if (sort === 'priceDesc') sorted.sort((a, b) => (b.pricePerKg ?? 0) - (a.pricePerKg ?? 0));
        // popular: keep catalog order
        return sorted;
    }, [filter, query, sort, products]);

    return (
        <div className={styles.shopContainer}>
            <section className={styles.hero}>
                <div className="reveal">
                    <h1 className={styles.heroTitle}>Магазин</h1>
                    <p className={styles.heroText}>Выберите свежий кофе для вашего бизнеса или дома</p>
                </div>
            </section>

            <div className={`${styles.toolbar} reveal`}>
                <div className={styles.searchWrap}>
                    <input
                        className={styles.searchInput}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Поиск: эспрессо, шоколад, Бразилия…"
                        aria-label="Поиск по товарам"
                    />
                </div>
                <div className={styles.sortWrap}>
                    <label className={styles.sortLabel} htmlFor="shop-sort">Сортировка</label>
                    <select
                        id="shop-sort"
                        className={styles.sortSelect}
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortType)}
                    >
                        <option value="popular">Популярные</option>
                        <option value="ratingDesc">По рейтингу</option>
                        <option value="priceAsc">Цена: дешевле</option>
                        <option value="priceDesc">Цена: дороже</option>
                    </select>
                </div>
            </div>

            <div className={`${styles.filterRow} reveal`}>
                {(['all', 'espresso', 'arabica', 'robusta'] as FilterType[]).map((f) => (
                    <button
                        key={f}
                        className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' && 'Все'}
                        {f === 'espresso' && 'Эспрессо-смеси'}
                        {f === 'arabica' && '100% Арабика'}
                        {f === 'robusta' && 'С робустой'}
                        <span className={styles.filterCount}>{filterCounts[f]}</span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
                    Загрузка товаров...
                </div>
            ) : visibleProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
                    Товары не найдены
                </div>
            ) : (
                <div className={`${styles.productGrid} reveal`}>
                    {visibleProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
