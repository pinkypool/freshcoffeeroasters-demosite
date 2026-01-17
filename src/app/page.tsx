'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { Product, PRODUCTS } from '@/lib/catalog';
import ProductCard from '@/components/ProductCard';
import { Icons } from '@/components/Icons';
import { useSettings } from '@/context/SettingsContext';

// Dynamic import for 3D model
const CoffeeModel3D = dynamic(() => import('@/components/CoffeeModel3D'), {
  ssr: false,
});

export default function Home() {
  const { language } = useSettings();
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const content = {
    ru: {
      badge: 'Обжариваем в день заказа',
      title: 'Свежий кофе',
      titleAccent: 'с доставкой по Казахстану',
      text: 'Fresh Coffee — это свежеобжаренный кофе высшего качества. Мы обжариваем и отправляем ваш кофе в день заказа.',
      shopBtn: 'Перейти в магазин',
      consult: 'Консультация',
      freeDelivery: 'Бесплатная доставка',
      freeDeliveryDesc: 'До пунктов Teez в 30 городах',
      freshRoast: 'Свежая обжарка',
      freshRoastDesc: 'Обжариваем в день заказа',
      discounts: 'Скидки от 5 кг',
      discountsDesc: 'До 25% при заказе от 100+ кг',
      guarantee: 'Гарантия вкуса',
      guaranteeDesc: 'Вернём деньги, если не понравится',
      hits: 'Наши хиты',
      hitsDesc: 'Самые популярные сорта кофе',
      loading: 'Загрузка...',
      seeAll: 'Смотреть все сорта',
      ready: 'Готовы попробовать?',
      readyDesc: 'Закажите свежий кофе прямо сейчас или свяжитесь с нами для консультации',
      orderBtn: 'Заказать кофе',
    },
    en: {
      badge: 'Roasted on order day',
      title: 'Fresh Coffee',
      titleAccent: 'delivered across Kazakhstan',
      text: 'Fresh Coffee — premium freshly roasted coffee. We roast and ship your coffee on the day of order.',
      shopBtn: 'Go to Shop',
      consult: 'Consultation',
      freeDelivery: 'Free Delivery',
      freeDeliveryDesc: 'To Teez points in 30 cities',
      freshRoast: 'Fresh Roast',
      freshRoastDesc: 'Roasted on order day',
      discounts: 'Discounts from 5 kg',
      discountsDesc: 'Up to 25% for 100+ kg orders',
      guarantee: 'Taste Guarantee',
      guaranteeDesc: 'Money back if not satisfied',
      hits: 'Our Bestsellers',
      hitsDesc: 'Most popular coffee varieties',
      loading: 'Loading...',
      seeAll: 'View all varieties',
      ready: 'Ready to try?',
      readyDesc: 'Order fresh coffee now or contact us for consultation',
      orderBtn: 'Order Coffee',
    },
  };

  const t = content[language];

  // Fetch hit products from API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products?.length > 0) {
          const hits = data.products.filter((p: Product) => p.badge === 'hit').slice(0, 3);
          if (hits.length > 0) {
            setTopProducts(hits);
          } else {
            setTopProducts(data.products.slice(0, 3));
          }
        } else {
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
              <Icons.Sparkles size={16} /> {t.badge}
            </span>
            <h1 className={styles.heroTitle}>
              {t.title}<br />
              <span className={styles.heroAccent}>{t.titleAccent}</span>
            </h1>
            <p className={styles.heroText}>{t.text}</p>
            <div className={styles.heroButtons}>
              <Link href="/shop" className={styles.heroBtn}>
                {t.shopBtn}
              </Link>
              <Link href="https://wa.me/77075845229?text=Hello! I'm interested in fresh coffee" className={styles.heroBtnSecondary} target="_blank">
                <Icons.Message size={18} /> {t.consult}
              </Link>
            </div>
          </div>

          <div className={styles.hero3DModel}>
            <CoffeeModel3D />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="reveal">
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}><Icons.Truck size={28} /></span>
            <h3>{t.freeDelivery}</h3>
            <p>{t.freeDeliveryDesc}</p>
          </div>
        </div>
        <div className="reveal" style={{ transitionDelay: '70ms' }}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}><Icons.Leaf size={28} /></span>
            <h3>{t.freshRoast}</h3>
            <p>{t.freshRoastDesc}</p>
          </div>
        </div>
        <div className="reveal" style={{ transitionDelay: '140ms' }}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}><Icons.Percent size={28} /></span>
            <h3>{t.discounts}</h3>
            <p>{t.discountsDesc}</p>
          </div>
        </div>
        <div className="reveal" style={{ transitionDelay: '210ms' }}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}><Icons.Shield size={28} /></span>
            <h3>{t.guarantee}</h3>
            <p>{t.guaranteeDesc}</p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className={styles.productsSection}>
        <div className="reveal">
          <h2 className={styles.sectionTitle}>{t.hits}</h2>
          <p className={styles.sectionSubtitle}>{t.hitsDesc}</p>
        </div>
        <div className="reveal" style={{ transitionDelay: '80ms' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
              {t.loading}
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
              {t.seeAll} <Icons.ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="reveal">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>{t.ready}</h2>
            <p className={styles.ctaText}>{t.readyDesc}</p>
            <div className={styles.ctaButtons}>
              <Link href="/shop" className={styles.ctaBtn}>
                <Icons.Cart size={20} /> {t.orderBtn}
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
