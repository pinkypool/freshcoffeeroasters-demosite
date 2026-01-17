import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Icons } from '@/components/Icons';

export default function ServicesPage() {
    return (
        <div className={styles.servicesContainer}>
            <section className={styles.hero}>
                <h1 className={styles.heroTitle}>Услуги</h1>
                <p className={styles.heroText}>Кофе, обучение и партнёрство</p>
            </section>

            <div className={styles.servicesGrid}>
                {/* Для Бизнеса */}
                <div className={styles.serviceCard}>
                    <div className={styles.cardIcon}><Icons.Office size={48} /></div>
                    <h2 className={styles.cardTitle}>Для Бизнеса</h2>
                    <ul className={styles.cardList}>
                        <li>Скидка 30% на первый заказ</li>
                        <li>Персональный менеджер</li>
                        <li>Гибкие условия оплаты</li>
                        <li>Оптовые цены от 5 кг</li>
                        <li>Доставка по всему Казахстану</li>
                    </ul>
                    <Link href="https://wa.me/77075845229?text=Салем! Меня интересует сотрудничество для бизнеса" className={styles.cardBtn} target="_blank">
                        Получить консультацию
                    </Link>
                </div>

                {/* Для Дома */}
                <div className={styles.serviceCard}>
                    <div className={styles.cardIcon}><Icons.House size={48} /></div>
                    <h2 className={styles.cardTitle}>Для Дома</h2>
                    <ul className={styles.cardList}>
                        <li>Обжариваем в день заказа</li>
                        <li>Бесплатная доставка по Teez</li>
                        <li>Гарантия вкуса</li>
                        <li>Оплата через Kaspi</li>
                        <li>Подарочные наборы</li>
                    </ul>
                    <Link href="/shop" className={styles.cardBtn}>
                        Перейти в магазин
                    </Link>
                </div>
            </div>

            {/* Обучение бариста */}
            <section className={styles.trainingSection}>
                <h2 className={styles.sectionTitle}>
                    <Icons.Academy size={28} /> Обучение бариста
                </h2>
                <p className={styles.sectionSubtitle}>Научитесь готовить идеальный кофе с Fresh Coffee Academy</p>

                <div className={styles.trainingGrid}>
                    {/* СТАРТ */}
                    <div className={styles.trainingCard}>
                        <div className={styles.trainingBadge}>Популярный</div>
                        <h3 className={styles.trainingTitle}>СТАРТ</h3>
                        <p className={styles.trainingDesc}>
                            Базовый курс для начинающих бариста. Теория эспрессо, молочные напитки, работа с оборудованием.
                        </p>
                        <ul className={styles.trainingFeatures}>
                            <li><Icons.Calendar size={14} /> 2 дня практики</li>
                            <li><Icons.Badge size={14} /> Сертификат Fresh Coffee</li>
                            <li><Icons.Phone size={14} /> Поддержка после курса</li>
                        </ul>
                        <Link
                            href="https://wa.me/77075845229?text=Салем! Меня интересует программа обучения СТАРТ"
                            className={styles.trainingBtn}
                            target="_blank"
                        >
                            Записаться
                        </Link>
                    </div>

                    {/* HOME */}
                    <div className={styles.trainingCard}>
                        <h3 className={styles.trainingTitle}>HOME</h3>
                        <p className={styles.trainingDesc}>
                            Для любителей кофе дома. Приготовление без кофемашины: турка, воронка, аэропресс.
                        </p>
                        <ul className={styles.trainingFeatures}>
                            <li><Icons.Clock size={14} /> 1 день практики</li>
                            <li><Icons.Gift size={14} /> Подарочный набор</li>
                            <li><Icons.Book size={14} /> Рецепты Home Brewing</li>
                        </ul>
                        <Link
                            href="https://wa.me/77075845229?text=Салем! Меня интересует программа обучения HOME"
                            className={styles.trainingBtn}
                            target="_blank"
                        >
                            Записаться
                        </Link>
                    </div>

                    {/* CORPORATE */}
                    <div className={styles.trainingCard}>
                        <div className={styles.trainingBadge}>Для команд</div>
                        <h3 className={styles.trainingTitle}>CORPORATE</h3>
                        <p className={styles.trainingDesc}>
                            Тимбилдинг с кофе. Организуем мастер-класс для вашей команды или мероприятия.
                        </p>
                        <ul className={styles.trainingFeatures}>
                            <li><Icons.Location size={14} /> Выезд на локацию</li>
                            <li><Icons.Coffee size={14} /> Дегустация</li>
                            <li><Icons.Users size={14} /> Индивидуальная программа</li>
                        </ul>
                        <Link
                            href="https://wa.me/77075845229?text=Салем! Меня интересует программа обучения CORPORATE"
                            className={styles.trainingBtn}
                            target="_blank"
                        >
                            Получить предложение
                        </Link>
                    </div>
                </div>
            </section>

            {/* Дополнительные услуги */}
            <section className={styles.additionalServices}>
                <h2 className={styles.sectionTitle}>Ещё услуги</h2>
                <div className={styles.additionalGrid}>
                    <div className={styles.additionalCard}>
                        <h3><Icons.Coffee size={20} /> Подбор оборудования</h3>
                        <p>Поможем выбрать кофемашину и аксессуары под ваш бюджет</p>
                    </div>
                    <div className={styles.additionalCard}>
                        <h3><Icons.Gift size={20} /> Корпоративные подарки</h3>
                        <p>Индивидуальные наборы с вашим логотипом</p>
                    </div>
                    <div className={styles.additionalCard}>
                        <h3><Icons.Cog size={20} /> Сервис оборудования</h3>
                        <p>Обслуживание и ремонт кофемашин</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
