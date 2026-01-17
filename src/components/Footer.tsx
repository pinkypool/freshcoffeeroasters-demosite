'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Icons } from './Icons';
import { useSettings } from '@/context/SettingsContext';

export default function Footer() {
    const { language } = useSettings();

    const content = {
        ru: {
            tagline: 'Свежесть — это не обещание, это правило!',
            navigation: 'Навигация',
            shop: 'Магазин',
            services: 'Услуги',
            about: 'О нас',
            faq: 'FAQ',
            contact: 'Контакты',
            contactTitle: 'Контакты',
            location: 'Алматы, Казахстан',
            documents: 'Документы',
            offer: 'Публичная оферта',
            privacy: 'Политика конфиденциальности',
            delivery: 'Доставка и оплата',
            rights: 'Все права защищены.',
        },
        en: {
            tagline: 'Freshness is not a promise, it\'s a rule!',
            navigation: 'Navigation',
            shop: 'Shop',
            services: 'Services',
            about: 'About',
            faq: 'FAQ',
            contact: 'Contact',
            contactTitle: 'Contact',
            location: 'Almaty, Kazakhstan',
            documents: 'Legal',
            offer: 'Terms & Conditions',
            privacy: 'Privacy Policy',
            delivery: 'Delivery & Payment',
            rights: 'All rights reserved.',
        },
    };

    const t = content[language];

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Fresh Coffee</h4>
                    <p className={styles.sectionText}>{t.tagline}</p>
                    <div className={styles.socialLinks}>
                        <a
                            href="https://www.instagram.com/freshcoffeekz/"
                            className={styles.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <Icons.Instagram size={22} />
                        </a>
                        <a
                            href="https://wa.me/77075845229"
                            className={`${styles.socialLink} ${styles.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                        >
                            <Icons.WhatsApp size={22} />
                        </a>
                    </div>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>{t.navigation}</h4>
                    <Link href="/shop" className={styles.link}>{t.shop}</Link>
                    <Link href="/services" className={styles.link}>{t.services}</Link>
                    <Link href="/about" className={styles.link}>{t.about}</Link>
                    <Link href="/faq" className={styles.link}>{t.faq}</Link>
                    <Link href="/contact" className={styles.link}>{t.contact}</Link>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>{t.contactTitle}</h4>
                    <a href="tel:+77075845229" className={styles.link}>
                        <Icons.Phone size={14} /> +7 707 584 52 29
                    </a>
                    <a href="mailto:info@freshcoffee.kz" className={styles.link}>
                        <Icons.Mail size={14} /> info@freshcoffee.kz
                    </a>
                    <span className={styles.linkText}>
                        <Icons.Location size={14} /> {t.location}
                    </span>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>{t.documents}</h4>
                    <Link href="/legal/offer" className={styles.link}>{t.offer}</Link>
                    <Link href="/legal/privacy" className={styles.link}>{t.privacy}</Link>
                    <Link href="/legal/delivery" className={styles.link}>{t.delivery}</Link>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>© {new Date().getFullYear()} Fresh Coffee. {t.rights}</p>
            </div>
        </footer>
    );
}
