'use client';

import React, { useState, useMemo } from 'react';
import styles from './ProductCard.module.css';
import { Product } from '@/lib/catalog';
import VolumeSlider from './VolumeSlider';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useSettings } from '@/context/SettingsContext';
import { Icons } from './Icons';
import { getPriceForQuantity } from '@/lib/pricing';

interface ProductCardProps {
    product: Product;
}

const FLAVOR_COLORS: Record<string, string> = {
    'цитрус': '#4caf50',
    'карамель': '#d2691e',
    'миндаль': '#c19a6b',
    'шоколад': '#5d4037',
    'орех': '#8d6e63',
    'тёмный шоколад': '#3e2723',
    'специи': '#ff5722',
    'табак': '#5d4037',
    'какао': '#795548',
    'жареный орех': '#6d4c41',
    'дым': '#616161',
    'горький шоколад': '#3e2723',
    'дерево': '#795548',
    'земля': '#4e342e',
    'тёмные ягоды': '#880e4f',
    'молочный шоколад': '#795548',
    // English
    'citrus': '#4caf50',
    'caramel': '#d2691e',
    'almond': '#c19a6b',
    'chocolate': '#5d4037',
    'nut': '#8d6e63',
    'dark chocolate': '#3e2723',
    'spices': '#ff5722',
    'tobacco': '#5d4037',
    'cocoa': '#795548',
    'roasted nut': '#6d4c41',
    'smoke': '#616161',
    'bitter chocolate': '#3e2723',
    'wood': '#795548',
    'earth': '#4e342e',
    'dark berries': '#880e4f',
    'milk chocolate': '#795548',
};

export default function ProductCard({ product }: ProductCardProps) {
    const { language } = useSettings();
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();

    const content = {
        ru: {
            flavor: 'Вкус:',
            density: 'Плотность',
            acidity: 'Кислотность',
            addToCart: 'В корзину',
            added: '✓ Добавлено!',
            addFav: 'Добавить в избранное',
            removeFav: 'Удалить из избранного',
            badges: {
                'popular': 'ПОПУЛЯРНЫЙ',
                'hit': 'ХИТ',
                'week_pick': 'СОРТ НЕДЕЛИ',
                'new': 'НОВИНКА',
            },
        },
        en: {
            flavor: 'Flavor:',
            density: 'Body',
            acidity: 'Acidity',
            addToCart: 'Add to Cart',
            added: '✓ Added!',
            addFav: 'Add to favorites',
            removeFav: 'Remove from favorites',
            badges: {
                'popular': 'POPULAR',
                'hit': 'HIT',
                'week_pick': 'PICK OF WEEK',
                'new': 'NEW',
            },
        },
    };

    const t = content[language];

    const getSku = useMemo(() => {
        const skuMap: Record<string, string> = {
            'brazil-alfenas': 'BRAZIL_ALFENAS',
            'espresso-1': 'ESPRESSO_1',
            'espresso-70-30': 'ESPRESSO_70_30',
            'espresso-50-50': 'ESPRESSO_50_50',
            'vending-robusta': 'VENDING_ROBUSTA',
        };
        return skuMap[product.slug] || 'BRAZIL_ALFENAS';
    }, [product.slug]);

    const priceInfo = useMemo(() => {
        return getPriceForQuantity(getSku, selectedQuantity);
    }, [getSku, selectedQuantity]);

    const handleQuantityChange = (qty: number) => {
        setSelectedQuantity(qty);
    };

    const handleAddToCart = () => {
        addToCart({
            sku: getSku,
            name: product.name,
            slug: product.slug,
            quantity: selectedQuantity,
            pricePerKg: priceInfo.pricePerKg,
            total: priceInfo.total,
            image: product.image,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const renderBar = (value: number) => {
        return (
            <div className={styles.barContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className={`${styles.barSegment} ${i <= value ? styles.barFilled : ''}`}
                    />
                ))}
            </div>
        );
    };

    const badgeLabel = product.badge ? (t.badges[product.badge as keyof typeof t.badges] || product.badge) : null;

    return (
        <div className={styles.card}>
            {/* Favorite Button */}
            <button
                className={`${styles.favoriteBtn} ${isFavorite(product.slug) ? styles.favorited : ''}`}
                onClick={() => toggleFavorite(product.slug)}
                aria-label={isFavorite(product.slug) ? t.removeFav : t.addFav}
            >
                <Icons.Heart size={20} />
            </button>

            {/* Badge */}
            {badgeLabel && (
                <div className={`${styles.badge} ${product.badge === 'week_pick' || product.badge === 'СОРТ НЕДЕЛИ' ? styles.badgeWeek : ''}`}>
                    {badgeLabel}
                </div>
            )}

            {/* Rating */}
            {product.rating && (
                <div className={styles.ratingBadge}>
                    ⭐ {product.rating} <span className={styles.reviewCount}>({product.reviews})</span>
                </div>
            )}

            <div className={styles.imageContainer}>
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className={styles.image}
                />
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.subtitle}>{product.subtitle}</span>
                    <h3 className={styles.title}>{product.name}</h3>
                </div>

                {/* Flavor Notes */}
                {product.flavorNotes && product.flavorNotes.length > 0 && (
                    <div className={styles.flavorNotes}>
                        <span className={styles.flavorLabel}>{t.flavor} </span>
                        {product.flavorNotes.map((note, i) => {
                            const color = product.flavorColors?.[i] || FLAVOR_COLORS[note.toLowerCase()] || 'inherit';
                            return (
                                <span
                                    key={note}
                                    className={styles.flavorNote}
                                    style={{
                                        color: color,
                                        fontWeight: color !== 'inherit' ? 700 : 400
                                    }}
                                >
                                    {note}{i < product.flavorNotes.length - 1 ? ', ' : ''}
                                </span>
                            );
                        })}
                    </div>
                )}

                {/* Characteristics */}
                <div className={styles.characteristics}>
                    <div className={styles.charItem}>
                        <span className={styles.charLabel}>{t.density}</span>
                        {renderBar(product.density || 3)}
                    </div>
                    <div className={styles.charItem}>
                        <span className={styles.charLabel}>{t.acidity}</span>
                        {renderBar(product.acidity || 3)}
                    </div>
                </div>

                <div className={styles.sliderSection}>
                    <VolumeSlider
                        sku={getSku}
                        onQuantityChange={(qty) => handleQuantityChange(qty)}
                    />
                </div>

                <div className={styles.actions}>
                    <button
                        className={`${styles.addToCartBtn} ${added ? styles.added : ''}`}
                        onClick={handleAddToCart}
                    >
                        {added ? t.added : `${t.addToCart} — ${priceInfo.total.toLocaleString('ru-RU')} ₸`}
                    </button>
                </div>
            </div>
        </div>
    );
}
