'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { Icons } from '@/components/Icons';
import { useSettings } from '@/context/SettingsContext';

export default function ContactPage() {
    const { language } = useSettings();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const content = {
        ru: {
            title: 'Контакты',
            subtitle: 'Свяжитесь с нами любым удобным способом',
            phone: 'Телефон',
            whatsapp: 'WhatsApp',
            whatsappBtn: 'Написать в WhatsApp',
            instagram: 'Instagram',
            address: 'Адрес',
            addressText: 'Алматы, Казахстан',
            hours: 'Время работы',
            hoursText: 'Пн-Пт: 9:00 - 18:00',
            formTitle: 'Напишите нам',
            formSubtitle: 'Мы ответим в течение 30 минут',
            name: 'Имя',
            namePlaceholder: 'Ваше имя',
            phonePlaceholder: '+7 (___) ___-__-__',
            message: 'Сообщение',
            messagePlaceholder: 'Ваш вопрос или пожелание...',
            submit: 'Отправить',
            thankYou: 'Спасибо!',
            thankYouText: 'Мы получили ваше сообщение и свяжемся с вами в ближайшее время.',
            quickActions: 'Быстрые действия',
            orderCoffee: 'Заказать кофе',
            forBusiness: 'Для бизнеса',
            training: 'Обучение',
        },
        en: {
            title: 'Contact',
            subtitle: 'Get in touch with us any way you prefer',
            phone: 'Phone',
            whatsapp: 'WhatsApp',
            whatsappBtn: 'Message on WhatsApp',
            instagram: 'Instagram',
            address: 'Address',
            addressText: 'Almaty, Kazakhstan',
            hours: 'Business Hours',
            hoursText: 'Mon-Fri: 9:00 AM - 6:00 PM',
            formTitle: 'Send us a message',
            formSubtitle: 'We\'ll respond within 30 minutes',
            name: 'Name',
            namePlaceholder: 'Your name',
            phonePlaceholder: '+7 (___) ___-__-__',
            message: 'Message',
            messagePlaceholder: 'Your question or request...',
            submit: 'Send',
            thankYou: 'Thank you!',
            thankYouText: 'We received your message and will contact you soon.',
            quickActions: 'Quick Actions',
            orderCoffee: 'Order Coffee',
            forBusiness: 'For Business',
            training: 'Training',
        },
    };

    const t = content[language];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

    return (
        <div className={styles.contactContainer}>
            <section className={styles.hero}>
                <div className="reveal">
                    <h1 className={styles.heroTitle}>{t.title}</h1>
                    <p className={styles.heroText}>{t.subtitle}</p>
                </div>
            </section>

            <div className={styles.contactContent}>
                <div className={styles.contactGrid}>
                    {/* Contact Info */}
                    <div className={styles.contactInfo}>
                        <div className={`${styles.infoCard} reveal`}>
                            <div className={styles.infoIcon}><Icons.Phone size={24} /></div>
                            <div className={styles.infoContent}>
                                <h3>{t.phone}</h3>
                                <a href="tel:+77075845229" className={styles.infoLink}>+7 707 584 52 29</a>
                            </div>
                        </div>

                        <div className={`${styles.infoCard} reveal`} style={{ transitionDelay: '70ms' }}>
                            <div className={styles.infoIconWhatsapp}>
                                <Icons.WhatsApp size={26} />
                            </div>
                            <div className={styles.infoContent}>
                                <h3>{t.whatsapp}</h3>
                                <a
                                    href="https://wa.me/77075845229?text=Hello! I'm interested in fresh coffee"
                                    className={styles.whatsappBtn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t.whatsappBtn}
                                </a>
                            </div>
                        </div>

                        <div className={`${styles.infoCard} reveal`} style={{ transitionDelay: '140ms' }}>
                            <div className={styles.infoIcon}><Icons.Heart size={24} /></div>
                            <div className={styles.infoContent}>
                                <h3>{t.instagram}</h3>
                                <a
                                    href="https://www.instagram.com/freshcoffeekz/"
                                    className={styles.infoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    @freshcoffeekz
                                </a>
                            </div>
                        </div>

                        <div className={`${styles.infoCard} reveal`} style={{ transitionDelay: '210ms' }}>
                            <div className={styles.infoIcon}><Icons.Location size={24} /></div>
                            <div className={styles.infoContent}>
                                <h3>{t.address}</h3>
                                <p className={styles.infoText}>{t.addressText}</p>
                            </div>
                        </div>

                        <div className={`${styles.infoCard} reveal`} style={{ transitionDelay: '280ms' }}>
                            <div className={styles.infoIcon}><Icons.Clock size={24} /></div>
                            <div className={styles.infoContent}>
                                <h3>{t.hours}</h3>
                                <p className={styles.infoText}>{t.hoursText}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={`${styles.contactForm} reveal`} style={{ transitionDelay: '90ms' }}>
                        {submitted ? (
                            <div className={styles.successMessage}>
                                <div className={styles.successIcon}><Icons.Check size={40} /></div>
                                <h2>{t.thankYou}</h2>
                                <p>{t.thankYouText}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h2 className={styles.formTitle}>{t.formTitle}</h2>
                                <p className={styles.formSubtitle}>{t.formSubtitle}</p>

                                <div className={styles.formGroup}>
                                    <label htmlFor="name">
                                        <Icons.User size={16} /> {t.name}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder={t.namePlaceholder}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="phone">
                                        <Icons.Phone size={16} /> {t.phone}
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        placeholder={t.phonePlaceholder}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message">
                                        <Icons.Message size={16} /> {t.message}
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        placeholder={t.messagePlaceholder}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>

                                <button type="submit" className={styles.submitBtn}>
                                    <Icons.Mail size={18} /> {t.submit}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <section className={styles.quickActions}>
                <div className="reveal">
                    <h2>{t.quickActions}</h2>
                </div>
                <div className={styles.actionsGrid}>
                    <a href="https://wa.me/77075845229?text=I want to order coffee" className={`${styles.actionCard} reveal`} target="_blank" rel="noopener noreferrer">
                        <Icons.Cart size={24} />
                        <span>{t.orderCoffee}</span>
                    </a>
                    <a href="https://wa.me/77075845229?text=I'm interested in business partnership" className={`${styles.actionCard} reveal`} style={{ transitionDelay: '70ms' }} target="_blank" rel="noopener noreferrer">
                        <Icons.Office size={24} />
                        <span>{t.forBusiness}</span>
                    </a>
                    <a href="https://wa.me/77075845229?text=I want to sign up for training" className={`${styles.actionCard} reveal`} style={{ transitionDelay: '140ms' }} target="_blank" rel="noopener noreferrer">
                        <Icons.Academy size={24} />
                        <span>{t.training}</span>
                    </a>
                </div>
            </section>
        </div>
    );
}
