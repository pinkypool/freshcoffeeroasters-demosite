'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../account.module.css';
import managerStyles from './manager.module.css';
import { Icons } from '@/components/Icons';

export default function ManagerPage() {
    const manager = {
        name: 'Нурия',
        position: 'Персональный менеджер',
        phone: '+7 707 584 52 29',
        email: 'nuriya@freshcoffee.kz',
        whatsapp: '+77075845229',
        telegram: '@freshcoffee_nuriya',
        photo: '/assets/team/nuriya.jpeg',
    };

    const conditions = [
        {
            icon: Icons.Percent,
            title: 'Скидка от объёма',
            description: 'До 15% при заказе от 20 кг',
        },
        {
            icon: Icons.Truck,
            title: 'Бесплатная доставка',
            description: 'При заказе от 10 000 ₸',
        },
        {
            icon: Icons.Card,
            title: 'Оплата',
            description: 'Карта, наличные, счёт для ТОО/ИП',
        },
        {
            icon: Icons.Clock,
            title: 'Отсрочка платежа',
            description: 'До 14 дней для постоянных клиентов',
        },
    ];

    return (
        <div className={styles.pageContent}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Ваш менеджер</h1>
            </div>

            {/* Manager Card */}
            <div className={managerStyles.managerCard}>
                <div className={managerStyles.photoWrapper}>
                    <Image
                        src={manager.photo}
                        alt={manager.name}
                        width={120}
                        height={120}
                        className={managerStyles.photo}
                    />
                    <div className={managerStyles.statusBadge}>
                        <span className={managerStyles.statusDot}></span>
                        Онлайн
                    </div>
                </div>
                <div className={managerStyles.managerInfo}>
                    <h2 className={managerStyles.managerName}>{manager.name}</h2>
                    <p className={managerStyles.position}>{manager.position}</p>

                    <div className={managerStyles.contactList}>
                        <a href={`tel:${manager.phone}`} className={managerStyles.contactItem}>
                            <Icons.Phone size={18} />
                            {manager.phone}
                        </a>
                        <a href={`mailto:${manager.email}`} className={managerStyles.contactItem}>
                            <Icons.Mail size={18} />
                            {manager.email}
                        </a>
                    </div>

                    <div className={managerStyles.actionButtons}>
                        <a
                            href={`https://wa.me/${manager.whatsapp}`}
                            className={managerStyles.whatsappBtn}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icons.WhatsApp size={20} />
                            WhatsApp
                        </a>
                        <a
                            href={`https://t.me/${manager.telegram.replace('@', '')}`}
                            className={managerStyles.telegramBtn}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icons.Message size={20} />
                            Telegram
                        </a>
                    </div>
                </div>
            </div>

            {/* Conditions */}
            <h2 className={managerStyles.sectionTitle}>Ваши условия сотрудничества</h2>
            <div className={managerStyles.conditionsGrid}>
                {conditions.map((condition, index) => (
                    <div key={index} className={managerStyles.conditionCard}>
                        <div className={managerStyles.conditionIcon}>
                            <condition.icon size={24} />
                        </div>
                        <div className={managerStyles.conditionInfo}>
                            <h3>{condition.title}</h3>
                            <p>{condition.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Help */}
            <div className={managerStyles.helpSection}>
                <h3>Нужна помощь?</h3>
                <p>Ваш менеджер поможет подобрать оптимальные сорта кофе, рассчитает индивидуальную скидку и ответит на все вопросы.</p>
                <a
                    href={`https://wa.me/${manager.whatsapp}?text=Добрый день! Хочу задать вопрос по заказу.`}
                    className={managerStyles.helpBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Написать менеджеру
                </a>
            </div>
        </div>
    );
}
