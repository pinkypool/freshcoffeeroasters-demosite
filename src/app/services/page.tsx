'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Icons } from '@/components/Icons';
import { useSettings } from '@/context/SettingsContext';

export default function ServicesPage() {
    const { language } = useSettings();

    const content = {
        ru: {
            title: 'Услуги',
            subtitle: 'Кофе, обучение и партнёрство',
            forBusiness: 'Для Бизнеса',
            forBusinessList: [
                'Скидка 30% на первый заказ',
                'Персональный менеджер',
                'Гибкие условия оплаты',
                'Оптовые цены от 5 кг',
                'Доставка по всему Казахстану',
            ],
            getConsultation: 'Получить консультацию',
            forHome: 'Для Дома',
            forHomeList: [
                'Обжариваем в день заказа',
                'Бесплатная доставка по Teez',
                'Гарантия вкуса',
                'Оплата через Kaspi',
                'Подарочные наборы',
            ],
            goToShop: 'Перейти в магазин',
            trainingTitle: 'Обучение бариста',
            trainingSubtitle: 'Научитесь готовить идеальный кофе с Fresh Coffee Academy',
            popular: 'Популярный',
            forTeams: 'Для команд',
            startTitle: 'СТАРТ',
            startDesc: 'Базовый курс для начинающих бариста. Теория эспрессо, молочные напитки, работа с оборудованием.',
            startFeatures: ['2 дня практики', 'Сертификат Fresh Coffee', 'Поддержка после курса'],
            homeTitle: 'HOME',
            homeDesc: 'Для любителей кофе дома. Приготовление без кофемашины: турка, воронка, аэропресс.',
            homeFeatures: ['1 день практики', 'Подарочный набор', 'Рецепты Home Brewing'],
            corporateTitle: 'CORPORATE',
            corporateDesc: 'Тимбилдинг с кофе. Организуем мастер-класс для вашей команды или мероприятия.',
            corporateFeatures: ['Выезд на локацию', 'Дегустация', 'Индивидуальная программа'],
            signUp: 'Записаться',
            getOffer: 'Получить предложение',
            moreServices: 'Ещё услуги',
            equipment: 'Подбор оборудования',
            equipmentDesc: 'Поможем выбрать кофемашину и аксессуары под ваш бюджет',
            corpGifts: 'Корпоративные подарки',
            corpGiftsDesc: 'Индивидуальные наборы с вашим логотипом',
            service: 'Сервис оборудования',
            serviceDesc: 'Обслуживание и ремонт кофемашин',
        },
        en: {
            title: 'Services',
            subtitle: 'Coffee, training and partnership',
            forBusiness: 'For Business',
            forBusinessList: [
                '30% off first order',
                'Personal manager',
                'Flexible payment terms',
                'Wholesale prices from 5 kg',
                'Delivery across Kazakhstan',
            ],
            getConsultation: 'Get Consultation',
            forHome: 'For Home',
            forHomeList: [
                'Roasted on order day',
                'Free delivery via Teez',
                'Taste guarantee',
                'Kaspi payment',
                'Gift sets',
            ],
            goToShop: 'Go to Shop',
            trainingTitle: 'Barista Training',
            trainingSubtitle: 'Learn to make the perfect coffee with Fresh Coffee Academy',
            popular: 'Popular',
            forTeams: 'For Teams',
            startTitle: 'START',
            startDesc: 'Basic course for beginner baristas. Espresso theory, milk drinks, equipment operation.',
            startFeatures: ['2 days practice', 'Fresh Coffee Certificate', 'Post-course support'],
            homeTitle: 'HOME',
            homeDesc: 'For home coffee lovers. Brewing without machines: ibrik, pour-over, aeropress.',
            homeFeatures: ['1 day practice', 'Gift set', 'Home Brewing recipes'],
            corporateTitle: 'CORPORATE',
            corporateDesc: 'Team building with coffee. We organize workshops for your team or events.',
            corporateFeatures: ['On-site visit', 'Tasting', 'Custom program'],
            signUp: 'Sign Up',
            getOffer: 'Get Offer',
            moreServices: 'More Services',
            equipment: 'Equipment Selection',
            equipmentDesc: 'We\'ll help choose a coffee machine and accessories for your budget',
            corpGifts: 'Corporate Gifts',
            corpGiftsDesc: 'Custom sets with your logo',
            service: 'Equipment Service',
            serviceDesc: 'Maintenance and repair of coffee machines',
        },
    };

    const t = content[language];

    return (
        <div className={styles.servicesContainer}>
            <section className={styles.hero}>
                <h1 className={styles.heroTitle}>{t.title}</h1>
                <p className={styles.heroText}>{t.subtitle}</p>
            </section>

            <div className={styles.servicesGrid}>
                {/* For Business */}
                <div className={styles.serviceCard}>
                    <div className={styles.cardIcon}><Icons.Office size={48} /></div>
                    <h2 className={styles.cardTitle}>{t.forBusiness}</h2>
                    <ul className={styles.cardList}>
                        {t.forBusinessList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <Link href="https://wa.me/77075845229?text=Hello! I'm interested in business partnership" className={styles.cardBtn} target="_blank">
                        {t.getConsultation}
                    </Link>
                </div>

                {/* For Home */}
                <div className={styles.serviceCard}>
                    <div className={styles.cardIcon}><Icons.House size={48} /></div>
                    <h2 className={styles.cardTitle}>{t.forHome}</h2>
                    <ul className={styles.cardList}>
                        {t.forHomeList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <Link href="/shop" className={styles.cardBtn}>
                        {t.goToShop}
                    </Link>
                </div>
            </div>

            {/* Barista Training */}
            <section className={styles.trainingSection}>
                <h2 className={styles.sectionTitle}>
                    <Icons.Academy size={28} /> {t.trainingTitle}
                </h2>
                <p className={styles.sectionSubtitle}>{t.trainingSubtitle}</p>

                <div className={styles.trainingGrid}>
                    {/* START */}
                    <div className={styles.trainingCard}>
                        <div className={styles.trainingBadge}>{t.popular}</div>
                        <h3 className={styles.trainingTitle}>{t.startTitle}</h3>
                        <p className={styles.trainingDesc}>{t.startDesc}</p>
                        <ul className={styles.trainingFeatures}>
                            <li><Icons.Calendar size={14} /> {t.startFeatures[0]}</li>
                            <li><Icons.Badge size={14} /> {t.startFeatures[1]}</li>
                            <li><Icons.Phone size={14} /> {t.startFeatures[2]}</li>
                        </ul>
                        <Link href="https://wa.me/77075845229?text=I'm interested in START training" className={styles.trainingBtn} target="_blank">
                            {t.signUp}
                        </Link>
                    </div>

                    {/* HOME */}
                    <div className={styles.trainingCard}>
                        <h3 className={styles.trainingTitle}>{t.homeTitle}</h3>
                        <p className={styles.trainingDesc}>{t.homeDesc}</p>
                        <ul className={styles.trainingFeatures}>
                            <li><Icons.Clock size={14} /> {t.homeFeatures[0]}</li>
                            <li><Icons.Gift size={14} /> {t.homeFeatures[1]}</li>
                            <li><Icons.Book size={14} /> {t.homeFeatures[2]}</li>
                        </ul>
                        <Link href="https://wa.me/77075845229?text=I'm interested in HOME training" className={styles.trainingBtn} target="_blank">
                            {t.signUp}
                        </Link>
                    </div>

                    {/* CORPORATE */}
                    <div className={styles.trainingCard}>
                        <div className={styles.trainingBadge}>{t.forTeams}</div>
                        <h3 className={styles.trainingTitle}>{t.corporateTitle}</h3>
                        <p className={styles.trainingDesc}>{t.corporateDesc}</p>
                        <ul className={styles.trainingFeatures}>
                            <li><Icons.Location size={14} /> {t.corporateFeatures[0]}</li>
                            <li><Icons.Coffee size={14} /> {t.corporateFeatures[1]}</li>
                            <li><Icons.Users size={14} /> {t.corporateFeatures[2]}</li>
                        </ul>
                        <Link href="https://wa.me/77075845229?text=I'm interested in CORPORATE training" className={styles.trainingBtn} target="_blank">
                            {t.getOffer}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Additional Services */}
            <section className={styles.additionalServices}>
                <h2 className={styles.sectionTitle}>{t.moreServices}</h2>
                <div className={styles.additionalGrid}>
                    <div className={styles.additionalCard}>
                        <h3><Icons.Coffee size={20} /> {t.equipment}</h3>
                        <p>{t.equipmentDesc}</p>
                    </div>
                    <div className={styles.additionalCard}>
                        <h3><Icons.Gift size={20} /> {t.corpGifts}</h3>
                        <p>{t.corpGiftsDesc}</p>
                    </div>
                    <div className={styles.additionalCard}>
                        <h3><Icons.Cog size={20} /> {t.service}</h3>
                        <p>{t.serviceDesc}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
