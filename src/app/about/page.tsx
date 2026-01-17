'use client';

import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { Icons } from '@/components/Icons';
import { useSettings } from '@/context/SettingsContext';

export default function AboutPage() {
    const { language } = useSettings();
    
    const content = {
        ru: {
            title: 'О нас',
            subtitle: 'Свежесть — это не обещание, это правило!',
            storyTitle: 'Наша история',
            storySubtitle: 'Малые партии, быстрая обжарка и честный подход к качеству.',
            storyText1: 'Мы обжариваем кофе уже <strong>2 года</strong> и за это время превратили малые партии в наше главное преимущество.',
            storyText2: 'Каждая поставка — свежая, подготовленная под заказ. Мы работаем быстро, чтобы вы получали продукт максимальной свежести.',
            facts: [
                { title: 'Обжарка в день заказа', text: 'Максимум свежести и стабильный вкус' },
                { title: 'Доставка по Казахстану', text: 'До ПВЗ Teez в 30 городах' },
                { title: 'Скидки от объёма', text: 'До -25% при заказе от 100 кг' },
            ],
            teamTitle: 'Команда',
            teamSubtitle: 'Люди, которые делают Fresh Coffee',
            missionTitle: 'Миссия',
            missionSubtitle: 'Коротко о том, зачем мы это делаем.',
            missionText: 'Развивать культуру спешелти кофе в Казахстане, задавая новые стандарты качества.',
            valuesTitle: 'Наши ценности',
            valuesSubtitle: 'То, на чём строится продукт и сервис.',
            values: [
                { icon: 'Leaf', title: 'Свежесть', text: 'Обжариваем в день заказа' },
                { icon: 'Search', title: 'Прозрачность', text: 'Открытость в ценах' },
                { icon: 'ThumbsUp', title: 'Партнёрство', text: 'Долгосрочные отношения' },
                { icon: 'Star', title: 'Качество', text: 'Лучшее зерно мира' },
            ],
            team: [
                { name: 'Вера', role: 'Digital Маркетолог', description: 'Создаёт удобные методы заказов и развивает digital-направление компании.' },
                { name: 'Нурия', role: 'Рук. отдела продаж', description: 'B2B консультант по выбору кофе. Подберет решение для кофейни и офиса.' },
                { name: 'Максат', role: 'Founder & CEO', description: 'Основал Fresh Coffee с нуля. Строит культуру спешелти кофе в Казахстане.', isCeo: true },
                { name: 'Ерназ', role: 'Менеджер продаж', description: 'Консультирует по розничным и оптовым закупкам. Поможет с первым заказом.' },
                { name: 'Азамат', role: 'Обжарщик', description: 'Обжарщик с 3-летним опытом. Также проводит тренинги для начинающих бариста.' },
            ],
        },
        en: {
            title: 'About Us',
            subtitle: 'Freshness is not a promise, it\'s a rule!',
            storyTitle: 'Our Story',
            storySubtitle: 'Small batches, fast roasting, and an honest approach to quality.',
            storyText1: 'We have been roasting coffee for <strong>2 years</strong> and during this time, small batches have become our main advantage.',
            storyText2: 'Every shipment is fresh, prepared to order. We work fast so you get the freshest product possible.',
            facts: [
                { title: 'Roasted on Order Day', text: 'Maximum freshness and consistent taste' },
                { title: 'Delivery Across Kazakhstan', text: 'To Teez pickup points in 30 cities' },
                { title: 'Volume Discounts', text: 'Up to -25% for orders over 100 kg' },
            ],
            teamTitle: 'Team',
            teamSubtitle: 'The people behind Fresh Coffee',
            missionTitle: 'Mission',
            missionSubtitle: 'Why we do what we do.',
            missionText: 'Developing specialty coffee culture in Kazakhstan, setting new quality standards.',
            valuesTitle: 'Our Values',
            valuesSubtitle: 'What our product and service are built on.',
            values: [
                { icon: 'Leaf', title: 'Freshness', text: 'Roasted on order day' },
                { icon: 'Search', title: 'Transparency', text: 'Open pricing' },
                { icon: 'ThumbsUp', title: 'Partnership', text: 'Long-term relationships' },
                { icon: 'Star', title: 'Quality', text: 'Best beans worldwide' },
            ],
            team: [
                { name: 'Vera', role: 'Digital Marketer', description: 'Creates convenient ordering methods and develops the company\'s digital direction.' },
                { name: 'Nuriya', role: 'Head of Sales', description: 'B2B coffee consultant. Will find the right solution for cafes and offices.' },
                { name: 'Maksat', role: 'Founder & CEO', description: 'Founded Fresh Coffee from scratch. Building specialty coffee culture in Kazakhstan.', isCeo: true },
                { name: 'Yernaz', role: 'Sales Manager', description: 'Consults on retail and wholesale purchases. Will help with your first order.' },
                { name: 'Azamat', role: 'Roaster', description: '3 years of roasting experience. Also conducts training for beginner baristas.' },
            ],
        },
    };

    const t = content[language];
    const TEAM_IMAGES = ['/assets/team/vera.jpeg', '/assets/team/nuriya.jpeg', '/assets/team/max.jpeg', '/assets/team/ernaz.jpeg', '/assets/team/aza.jpeg'];

    return (
        <div className={styles.aboutContainer}>
            <section className={styles.hero}>
                <div className="reveal">
                    <h1 className={styles.heroTitle}>{t.title}</h1>
                    <p className={styles.heroText}>{t.subtitle}</p>
                </div>
            </section>

            {/* Story Section */}
            <section className={styles.storySection}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionHeader}>
                        <div className="reveal">
                            <h2 className={styles.sectionTitle}>{t.storyTitle}</h2>
                            <p className={styles.sectionSubtitle}>{t.storySubtitle}</p>
                        </div>
                    </div>

                    <div className={styles.storyGrid}>
                        <div className={`${styles.storyCard} reveal`}>
                            <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: t.storyText1 }} />
                            <p className={styles.paragraph}>{t.storyText2}</p>
                        </div>
                        <div className={`${styles.imageCard} reveal`} style={{ transitionDelay: '80ms' }}>
                            <Image
                                src="/assets/banner.jpg"
                                alt="Fresh Coffee Beans"
                                width={600}
                                height={400}
                                className={styles.bannerImg}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Facts */}
            <section className={styles.factsSection}>
                <div className={styles.sectionInner}>
                    <div className={styles.factsGrid}>
                        {t.facts.map((fact, i) => (
                            <div key={i} className={`${styles.factCard} reveal`} style={{ transitionDelay: `${i * 70}ms` }}>
                                <span className={styles.factIcon}>
                                    {i === 0 && <Icons.Sparkles size={22} />}
                                    {i === 1 && <Icons.Truck size={22} />}
                                    {i === 2 && <Icons.Percent size={22} />}
                                </span>
                                <div>
                                    <div className={styles.factTitle}>{fact.title}</div>
                                    <div className={styles.factText}>{fact.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className={styles.teamSection}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionHeader}>
                        <div className="reveal">
                            <h2 className={styles.sectionTitle}>
                                <Icons.Team size={28} /> {t.teamTitle}
                            </h2>
                            <p className={styles.sectionSubtitle}>{t.teamSubtitle}</p>
                        </div>
                    </div>

                    <div className={styles.teamGrid}>
                        {t.team.map((member, i) => (
                            <div key={member.name} className={`${styles.teamCard} ${member.isCeo ? styles.teamCardCeo : ''} reveal`}>
                                <div className={styles.teamImageWrapper}>
                                    <Image
                                        src={TEAM_IMAGES[i]}
                                        alt={member.name}
                                        width={160}
                                        height={160}
                                        className={styles.teamImage}
                                    />
                                </div>
                                {member.isCeo && <span className={styles.ceoBadge}>CEO</span>}
                                <h3 className={styles.teamName}>{member.name}</h3>
                                <p className={styles.teamRole}>{member.role}</p>
                                <p className={styles.teamDesc}>{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className={styles.missionSection}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionHeader}>
                        <div className="reveal">
                            <h2 className={styles.sectionTitle}>{t.missionTitle}</h2>
                            <p className={styles.sectionSubtitle}>{t.missionSubtitle}</p>
                        </div>
                    </div>
                    <div className={`${styles.missionCard} reveal`}>
                        <p className={styles.missionText}>{t.missionText}</p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.valuesSection}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionHeader}>
                        <div className="reveal">
                            <h2 className={styles.sectionTitle}>{t.valuesTitle}</h2>
                            <p className={styles.sectionSubtitle}>{t.valuesSubtitle}</p>
                        </div>
                    </div>

                    <div className={styles.valuesGrid}>
                        {t.values.map((value, i) => (
                            <div key={value.title} className={`${styles.valueCard} reveal`} style={{ transitionDelay: `${i * 70}ms` }}>
                                <div className={styles.valueIcon}>
                                    {value.icon === 'Leaf' && <Icons.Leaf size={32} />}
                                    {value.icon === 'Search' && <Icons.Search size={32} />}
                                    {value.icon === 'ThumbsUp' && <Icons.ThumbsUp size={32} />}
                                    {value.icon === 'Star' && <Icons.Star size={32} />}
                                </div>
                                <h3>{value.title}</h3>
                                <p>{value.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
