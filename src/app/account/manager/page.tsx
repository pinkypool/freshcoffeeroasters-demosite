'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../account.module.css';
import managerStyles from './manager.module.css';
import { Icons } from '@/components/Icons';

import { useSettings } from '@/context/SettingsContext';

export default function ManagerPage() {
    const { language } = useSettings();

    const content = {
        ru: {
            title: 'Ваш менеджер',
            position: 'Персональный менеджер',
            online: 'Онлайн',
            conditions: {
                title: 'Ваши условия сотрудничества',
                volume: {
                    title: 'Скидка от объёма',
                    desc: 'До 15% при заказе от 20 кг',
                },
                delivery: {
                    title: 'Бесплатная доставка',
                    desc: 'При заказе от 10 000 ₸',
                },
                payment: {
                    title: 'Оплата',
                    desc: 'Карта, наличные, счёт для ТОО/ИП',
                },
                deferral: {
                    title: 'Отсрочка платежа',
                    desc: 'До 14 дней для постоянных клиентов',
                },
            },
            help: {
                title: 'Нужна помощь?',
                text: 'Ваш менеджер поможет подобрать оптимальные сорта кофе, рассчитает индивидуальную скидку и ответит на все вопросы.',
                btn: 'Написать менеджеру',
                msg: 'Добрый день! Хочу задать вопрос по заказу.',
            }
        },
        en: {
            title: 'Your Manager',
            position: 'Personal Manager',
            online: 'Online',
            conditions: {
                title: 'Your Cooperation Terms',
                volume: {
                    title: 'Volume Discount',
                    desc: 'Up to 15% for orders over 20 kg',
                },
                delivery: {
                    title: 'Free Delivery',
                    desc: 'For orders over 10 000 ₸',
                },
                payment: {
                    title: 'Payment',
                    desc: 'Card, cash, invoice for LLC/IE',
                },
                deferral: {
                    title: 'Deferred Payment',
                    desc: 'Up to 14 days for regular clients',
                },
            },
            help: {
                title: 'Need Help?',
                text: 'Your manager will help you choose the best coffee varieties, calculate an individual discount, and answer all your questions.',
                btn: 'Contact Manager',
                msg: 'Hello! I have a question about my order.',
            }
        },
    };

    const t = content[language];

    const manager = {
        name: 'Нурия',
        position: t.position,
        phone: '+7 707 584 52 29',
        email: 'nuriya@freshcoffee.kz',
        whatsapp: '+77075845229',
        telegram: '@freshcoffee_nuriya',
        photo: '/assets/team/nuriya.jpeg',
    };

    const conditions = [
        {
            icon: Icons.Percent,
            title: t.conditions.volume.title,
            description: t.conditions.volume.desc,
        },
        {
            icon: Icons.Truck,
            title: t.conditions.delivery.title,
            description: t.conditions.delivery.desc,
        },
        {
            icon: Icons.Card,
            title: t.conditions.payment.title,
            description: t.conditions.payment.desc,
        },
        {
            icon: Icons.Clock,
            title: t.conditions.deferral.title,
            description: t.conditions.deferral.desc,
        },
    ];

    return (
        <div className={styles.pageContent}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{t.title}</h1>
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
                        {t.online}
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
            <h2 className={managerStyles.sectionTitle}>{t.conditions.title}</h2>
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
                <h3>{t.help.title}</h3>
                <p>{t.help.text}</p>
                <a
                    href={`https://wa.me/${manager.whatsapp}?text=${encodeURIComponent(t.help.msg)}`}
                    className={managerStyles.helpBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t.help.btn}
                </a>
            </div>
        </div>
    );
}
