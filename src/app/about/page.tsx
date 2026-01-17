import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { Icons } from '@/components/Icons';

// Team members - 5 in a row: Vera, Nuriya, Maksat (CEO), Ernaz, Azamat
const TEAM_MEMBERS = [
    {
        name: 'Вера',
        role: 'Digital Маркетолог',
        image: '/assets/team/vera.jpeg',
        description: 'Создаёт удобные методы заказов и развивает digital-направление компании.',
    },
    {
        name: 'Нурия',
        role: 'Рук. отдела продаж',
        image: '/assets/team/nuriya.jpeg',
        description: 'B2B консультант по выбору кофе. Подберет решение для кофейни и офиса.',
    },
    {
        name: 'Максат',
        role: 'Founder & CEO',
        image: '/assets/team/max.jpeg',
        isCeo: true,
        description: 'Основал Fresh Coffee с нуля. Строит культуру спешелти кофе в Казахстане.',
    },
    {
        name: 'Ерназ',
        role: 'Менеджер продаж',
        image: '/assets/team/ernaz.jpeg',
        description: 'Консультирует по розничным и оптовым закупкам. Поможет с первым заказом.',
    },
    {
        name: 'Азамат',
        role: 'Обжарщик',
        image: '/assets/team/aza.jpeg',
        description: 'Обжарщик с 3-летним опытом. Также проводит тренинги для начинающих бариста.',
    },
];



export default function AboutPage() {
    return (
        <div className={styles.aboutContainer}>
            <section className={styles.hero}>
                <div className="reveal">
                    <h1 className={styles.heroTitle}>О нас</h1>
                    <p className={styles.heroText}>Свежесть — это не обещание, это правило!</p>
                </div>
            </section>

            {/* Story Section */}
            <section className={styles.storySection}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionHeader}>
                        <div className="reveal">
                            <h2 className={styles.sectionTitle}>Наша история</h2>
                            <p className={styles.sectionSubtitle}>
                                Малые партии, быстрая обжарка и честный подход к качеству.
                            </p>
                        </div>
                    </div>

                    <div className={styles.storyGrid}>
                        <div className={`${styles.storyCard} reveal`}>
                            <p className={styles.paragraph}>
                                Мы обжариваем кофе уже <strong>2 года</strong> и за это время превратили малые партии в наше главное преимущество.
                            </p>
                            <p className={styles.paragraph}>
                                Каждая поставка — свежая, подготовленная под заказ. Мы работаем быстро, чтобы вы получали продукт максимальной свежести.
                            </p>
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
                        <div className={`${styles.factCard} reveal`}>
                            <span className={styles.factIcon}><Icons.Sparkles size={22} /></span>
                            <div>
                                <div className={styles.factTitle}>Обжарка в день заказа</div>
                                <div className={styles.factText}>Максимум свежести и стабильный вкус</div>
                            </div>
                        </div>
                        <div className={`${styles.factCard} reveal`} style={{ transitionDelay: '70ms' }}>
                            <span className={styles.factIcon}><Icons.Truck size={22} /></span>
                            <div>
                                <div className={styles.factTitle}>Доставка по Казахстану</div>
                                <div className={styles.factText}>До ПВЗ Teez в 30 городах</div>
                            </div>
                        </div>
                        <div className={`${styles.factCard} reveal`} style={{ transitionDelay: '140ms' }}>
                            <span className={styles.factIcon}><Icons.Percent size={22} /></span>
                            <div>
                                <div className={styles.factTitle}>Скидки от объёма</div>
                                <div className={styles.factText}>До -25% при заказе от 100 кг</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section - 5 in a row */}
            <section className={styles.teamSection}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionHeader}>
                        <div className="reveal">
                            <h2 className={styles.sectionTitle}>
                                <Icons.Team size={28} /> Команда
                            </h2>
                            <p className={styles.sectionSubtitle}>Люди, которые делают Fresh Coffee</p>
                        </div>
                    </div>

                    <div className={styles.teamGrid}>
                        {TEAM_MEMBERS.map((member) => (
                            <div key={member.name} className={`${styles.teamCard} ${member.isCeo ? styles.teamCardCeo : ''} reveal`}>
                                <div className={styles.teamImageWrapper}>
                                    <Image
                                        src={member.image}
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
                            <h2 className={styles.sectionTitle}>Миссия</h2>
                            <p className={styles.sectionSubtitle}>Коротко о том, зачем мы это делаем.</p>
                        </div>
                    </div>
                    <div className={`${styles.missionCard} reveal`}>
                        <p className={styles.missionText}>
                            Развивать культуру спешелти кофе в Казахстане, задавая новые стандарты качества.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.valuesSection}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionHeader}>
                        <div className="reveal">
                            <h2 className={styles.sectionTitle}>Наши ценности</h2>
                            <p className={styles.sectionSubtitle}>То, на чём строится продукт и сервис.</p>
                        </div>
                    </div>

                    <div className={styles.valuesGrid}>
                        <div className={`${styles.valueCard} reveal`}>
                            <div className={styles.valueIcon}><Icons.Leaf size={32} /></div>
                            <h3>Свежесть</h3>
                            <p>Обжариваем в день заказа</p>
                        </div>
                        <div className={`${styles.valueCard} reveal`} style={{ transitionDelay: '70ms' }}>
                            <div className={styles.valueIcon}><Icons.Search size={32} /></div>
                            <h3>Прозрачность</h3>
                            <p>Открытость в ценах</p>
                        </div>
                        <div className={`${styles.valueCard} reveal`} style={{ transitionDelay: '140ms' }}>
                            <div className={styles.valueIcon}><Icons.ThumbsUp size={32} /></div>
                            <h3>Партнёрство</h3>
                            <p>Долгосрочные отношения</p>
                        </div>
                        <div className={`${styles.valueCard} reveal`} style={{ transitionDelay: '210ms' }}>
                            <div className={styles.valueIcon}><Icons.Star size={32} /></div>
                            <h3>Качество</h3>
                            <p>Лучшее зерно мира</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
