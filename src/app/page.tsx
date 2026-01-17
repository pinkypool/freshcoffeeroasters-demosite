'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { Product, PRODUCTS } from '@/lib/catalog';
import ProductCard from '@/components/ProductCard';
import { Icons } from '@/components/Icons';

// Динамический импорт для 3D модели
const CoffeeModel3D = dynamic(() => import('@/components/CoffeeModel3D'), {
  ssr: false,
});

export default function Home() {
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch hit products from API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products?.length > 0) {
          // Get first 3 products or products with 'hit' badge
          const hits = data.products.filter((p: Product) => p.badge === 'hit').slice(0, 3);
          if (hits.length > 0) {
            setTopProducts(hits);
          } else {
            // Fallback to first 3 products
            setTopProducts(data.products.slice(0, 3));
          }
        } else {
          // Fallback to static catalog
          setTopProducts(PRODUCTS.slice(0, 3));
        }
      })
      .catch(() => {
        setTopProducts(PRODUCTS.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className={styles.main}>
      {/* Hero Section with 3D Model on the Side */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              <Icons.Sparkles size={16} /> Обжариваем в день заказа
            </span>
            <h1 className={styles.heroTitle}>
              Свежий кофе<br />
              <span className={styles.heroAccent}>с доставкой по Казахстану</span>
            </h1>
            <p className={styles.heroText}>
              Fresh Coffee — это свежеобжаренный кофе высшего качества. Мы обжариваем и отправляем ваш кофе в день заказа.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/shop" className={styles.heroBtn}>
                Перейти в магазин
              </Link>
              <Link href="https://wa.me/77075845229?text=Салем! Меня интересует свежий кофе" className={styles.heroBtnSecondary} target="_blank">
                <Icons.Message size={18} /> Консультация
              </Link>
            </div>
          </div>

          <div className={styles.hero3DModel}>
            <CoffeeModel3D />
          </div>
        </div>
      </section>

      {/* Features Section - Separate from hero */}
      <section className={styles.features}>
        <div className="reveal">
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}><Icons.Truck size={28} /></span>
            <h3>Бесплатная доставка</h3>
            <p>До пунктов Teez в 30 городах</p>
          </div>
        </div>
        <div className="reveal" style={{ transitionDelay: '70ms' }}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}><Icons.Leaf size={28} /></span>
            <h3>Свежая обжарка</h3>
            <p>Обжариваем в день заказа</p>
          </div>
        </div>
        <div className="reveal" style={{ transitionDelay: '140ms' }}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}><Icons.Percent size={28} /></span>
            <h3>Скидки от 5 кг</h3>
            <p>До 25% при заказе от 100+ кг</p>
          </div>
        </div>
        <div className="reveal" style={{ transitionDelay: '210ms' }}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}><Icons.Shield size={28} /></span>
            <h3>Гарантия вкуса</h3>
            <p>Вернём деньги, если не понравится</p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className={styles.productsSection}>
        <div className="reveal">
          <h2 className={styles.sectionTitle}>Наши хиты</h2>
          <p className={styles.sectionSubtitle}>Самые популярные сорта кофе</p>
        </div>
        <div className="reveal" style={{ transitionDelay: '80ms' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Загрузка...
            </div>
          ) : (
            <div className={styles.grid}>
              {topProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className={styles.seeAllWrapper}>
            <Link href="/shop" className={styles.seeAllBtn}>
              Смотреть все сорта <Icons.ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="reveal">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Готовы попробовать?</h2>
            <p className={styles.ctaText}>
              Закажите свежий кофе прямо сейчас или свяжитесь с нами для консультации
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/shop" className={styles.ctaBtn}>
                <Icons.Cart size={20} /> Заказать кофе
              </Link>
              <Link href="https://wa.me/77075845229" className={styles.ctaBtnWhatsapp} target="_blank">
                <Icons.Message size={20} /> WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
