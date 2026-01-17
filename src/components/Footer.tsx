'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Icons } from './Icons';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Fresh Coffee</h4>
                    <p className={styles.sectionText}>
                        Свежесть — это не обещание, это правило!
                    </p>
                    <div className={styles.socialLinks}>
                        <a
                            href="https://www.instagram.com/freshcoffeekz/"
                            className={styles.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Наш Instagram"
                        >
                            <Icons.Instagram size={22} />
                        </a>
                        <a
                            href="https://wa.me/77075845229"
                            className={`${styles.socialLink} ${styles.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Написать в WhatsApp"
                        >
                            <Icons.WhatsApp size={22} />
                        </a>
                    </div>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Навигация</h4>
                    <Link href="/shop" className={styles.link}>Магазин</Link>
                    <Link href="/services" className={styles.link}>Услуги</Link>
                    <Link href="/about" className={styles.link}>О нас</Link>
                    <Link href="/faq" className={styles.link}>FAQ</Link>
                    <Link href="/contact" className={styles.link}>Контакты</Link>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Контакты</h4>
                    <a href="tel:+77075845229" className={styles.link}>
                        <Icons.Phone size={14} /> +7 707 584 52 29
                    </a>
                    <a href="mailto:info@freshcoffee.kz" className={styles.link}>
                        <Icons.Mail size={14} /> info@freshcoffee.kz
                    </a>
                    <span className={styles.linkText}>
                        <Icons.Location size={14} /> Алматы, Казахстан
                    </span>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Документы</h4>
                    <Link href="/legal/offer" className={styles.link}>Публичная оферта</Link>
                    <Link href="/legal/privacy" className={styles.link}>Политика конфиденциальности</Link>
                    <Link href="/legal/delivery" className={styles.link}>Доставка и оплата</Link>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>© {new Date().getFullYear()} Fresh Coffee. Все права защищены.</p>
            </div>
        </footer>
    );
}
