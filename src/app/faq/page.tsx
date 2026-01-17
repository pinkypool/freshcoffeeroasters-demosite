'use client';

import React from 'react';
import styles from './page.module.css';
import { useSettings } from '@/context/SettingsContext';

export default function FAQPage() {
    const { language } = useSettings();

    const content = {
        ru: {
            title: 'Частые вопросы',
            subtitle: 'Ответы на самые популярные вопросы о нашем кофе',
            notFound: 'Не нашли ответ?',
            notFoundText: 'Напишите нам в WhatsApp и мы ответим в течение 5 минут!',
            whatsappBtn: '💬 Написать в WhatsApp',
            faqs: [
                {
                    question: 'Как быстро вы доставляете?',
                    answer: 'Мы обжариваем и отправляем кофе в день заказа. Доставка по Казахстану занимает 1-5 дней в зависимости от города.',
                },
                {
                    question: 'Какой минимальный заказ?',
                    answer: 'Минимальный заказ — 1 кг. Для оптовых клиентов действуют специальные условия от 5 кг.',
                },
                {
                    question: 'Как работает система скидок?',
                    answer: 'Чем больше заказ, тем ниже цена за кг:\n• 5-9 кг: -5%\n• 10-29 кг: -10%\n• 30-49 кг: -15%\n• 50-99 кг: -20%\n• 100+ кг: -25%',
                },
                {
                    question: 'Можно ли вернуть кофе?',
                    answer: 'Да! Если кофе вам не понравился, мы вернём деньги или заменим товар. Просто свяжитесь с нами в течение 7 дней после получения.',
                },
                {
                    question: 'Какие способы оплаты доступны?',
                    answer: 'Мы принимаем оплату через Kaspi Pay, банковский перевод и наличные при самовывозе.',
                },
                {
                    question: 'Есть ли у вас самовывоз?',
                    answer: 'Да, в городах присутствия Teez вы можете забрать заказ в пунктах выдачи. В других городах доступна курьерская доставка.',
                },
                {
                    question: 'Как хранить кофе?',
                    answer: 'Храните кофе в закрытой упаковке, в прохладном тёмном месте. После вскрытия рекомендуем использовать в течение 2-3 недель.',
                },
                {
                    question: 'Работаете ли вы с юридическими лицами?',
                    answer: 'Да! Мы работаем с кофейнями, ресторанами, отелями и офисами. Предоставляем документы, договор и счёт.',
                },
            ],
        },
        en: {
            title: 'FAQ',
            subtitle: 'Answers to the most popular questions about our coffee',
            notFound: 'Didn\'t find your answer?',
            notFoundText: 'Message us on WhatsApp and we\'ll respond within 5 minutes!',
            whatsappBtn: '💬 Message on WhatsApp',
            faqs: [
                {
                    question: 'How fast do you deliver?',
                    answer: 'We roast and ship coffee on the day of order. Delivery across Kazakhstan takes 1-5 days depending on the city.',
                },
                {
                    question: 'What\'s the minimum order?',
                    answer: 'Minimum order is 1 kg. For wholesale clients, special conditions apply from 5 kg.',
                },
                {
                    question: 'How does the discount system work?',
                    answer: 'The larger the order, the lower the price per kg:\n• 5-9 kg: -5%\n• 10-29 kg: -10%\n• 30-49 kg: -15%\n• 50-99 kg: -20%\n• 100+ kg: -25%',
                },
                {
                    question: 'Can I return the coffee?',
                    answer: 'Yes! If you don\'t like the coffee, we\'ll refund or replace it. Just contact us within 7 days of receiving it.',
                },
                {
                    question: 'What payment methods are available?',
                    answer: 'We accept Kaspi Pay, bank transfer, and cash on pickup.',
                },
                {
                    question: 'Do you have pickup?',
                    answer: 'Yes, in cities with Teez presence you can pick up your order at pickup points. Courier delivery is available in other cities.',
                },
                {
                    question: 'How to store coffee?',
                    answer: 'Store coffee in a closed package, in a cool dark place. After opening, we recommend using within 2-3 weeks.',
                },
                {
                    question: 'Do you work with legal entities?',
                    answer: 'Yes! We work with cafes, restaurants, hotels, and offices. We provide documents, contracts, and invoices.',
                },
            ],
        },
    };

    const t = content[language];

    return (
        <div className={styles.faqContainer}>
            <section className={styles.hero}>
                <h1 className={styles.heroTitle}>{t.title}</h1>
                <p className={styles.heroText}>{t.subtitle}</p>
            </section>

            <div className={styles.faqList}>
                {t.faqs.map((faq, index) => (
                    <details key={index} className={styles.faqItem}>
                        <summary className={styles.faqQuestion}>
                            {faq.question}
                            <span className={styles.faqIcon}>+</span>
                        </summary>
                        <div className={styles.faqAnswer}>
                            {faq.answer.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </details>
                ))}
            </div>

            <section className={styles.contactCta}>
                <h2>{t.notFound}</h2>
                <p>{t.notFoundText}</p>
                <a
                    href="https://wa.me/77075845229?text=Hello! I have a question about coffee."
                    className={styles.whatsappBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t.whatsappBtn}
                </a>
            </section>
        </div>
    );
}
