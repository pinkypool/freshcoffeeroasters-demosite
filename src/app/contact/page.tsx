'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { Icons } from '@/components/Icons';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

    return (
        <div className={styles.contactContainer}>
            <section className={styles.hero}>
                <div className="reveal">
                    <h1 className={styles.heroTitle}>Контакты</h1>
                    <p className={styles.heroText}>Свяжитесь с нами любым удобным способом</p>
                </div>
            </section>

            <div className={styles.contactContent}>
                <div className={styles.contactGrid}>
                    {/* Contact Info */}
                    <div className={styles.contactInfo}>
                        <div className={`${styles.infoCard} reveal`}>
                            <div className={styles.infoIcon}><Icons.Phone size={24} /></div>
                            <div className={styles.infoContent}>
                                <h3>Телефон</h3>
                                <a href="tel:+77075845229" className={styles.infoLink}>+7 707 584 52 29</a>
                            </div>
                        </div>

                        <div className={`${styles.infoCard} reveal`} style={{ transitionDelay: '70ms' }}>
                            <div className={styles.infoIconWhatsapp}>
                                <Icons.WhatsApp size={26} />
                            </div>
                            <div className={styles.infoContent}>
                                <h3>WhatsApp</h3>
                                <a
                                    href="https://wa.me/77075845229?text=Салем! Меня интересует свежий кофе"
                                    className={styles.whatsappBtn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Написать в WhatsApp
                                </a>
                            </div>
                        </div>

                        <div className={`${styles.infoCard} reveal`} style={{ transitionDelay: '140ms' }}>
                            <div className={styles.infoIcon}><Icons.Heart size={24} /></div>
                            <div className={styles.infoContent}>
                                <h3>Instagram</h3>
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
                                <h3>Адрес</h3>
                                <p className={styles.infoText}>Алматы, Казахстан</p>
                            </div>
                        </div>

                        <div className={`${styles.infoCard} reveal`} style={{ transitionDelay: '280ms' }}>
                            <div className={styles.infoIcon}><Icons.Clock size={24} /></div>
                            <div className={styles.infoContent}>
                                <h3>Время работы</h3>
                                <p className={styles.infoText}>Пн-Пт: 9:00 - 18:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={`${styles.contactForm} reveal`} style={{ transitionDelay: '90ms' }}>
                        {submitted ? (
                            <div className={styles.successMessage}>
                                <div className={styles.successIcon}><Icons.Check size={40} /></div>
                                <h2>Спасибо!</h2>
                                <p>Мы получили ваше сообщение и свяжемся с вами в ближайшее время.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h2 className={styles.formTitle}>Напишите нам</h2>
                                <p className={styles.formSubtitle}>Мы ответим в течение 30 минут</p>

                                <div className={styles.formGroup}>
                                    <label htmlFor="name">
                                        <Icons.User size={16} /> Имя
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Ваше имя"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="phone">
                                        <Icons.Phone size={16} /> Телефон
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        placeholder="+7 (___) ___-__-__"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message">
                                        <Icons.Message size={16} /> Сообщение
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        placeholder="Ваш вопрос или пожелание..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>

                                <button type="submit" className={styles.submitBtn}>
                                    <Icons.Mail size={18} /> Отправить
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <section className={styles.quickActions}>
                <div className="reveal">
                    <h2>Быстрые действия</h2>
                </div>
                <div className={styles.actionsGrid}>
                    <a href="https://wa.me/77075845229?text=Хочу заказать кофе" className={`${styles.actionCard} reveal`} target="_blank" rel="noopener noreferrer">
                        <Icons.Cart size={24} />
                        <span>Заказать кофе</span>
                    </a>
                    <a href="https://wa.me/77075845229?text=Меня интересует сотрудничество" className={`${styles.actionCard} reveal`} style={{ transitionDelay: '70ms' }} target="_blank" rel="noopener noreferrer">
                        <Icons.Office size={24} />
                        <span>Для бизнеса</span>
                    </a>
                    <a href="https://wa.me/77075845229?text=Хочу записаться на обучение" className={`${styles.actionCard} reveal`} style={{ transitionDelay: '140ms' }} target="_blank" rel="noopener noreferrer">
                        <Icons.Academy size={24} />
                        <span>Обучение</span>
                    </a>
                </div>
            </section>
        </div>
    );
}
