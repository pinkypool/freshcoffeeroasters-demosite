'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ru' | 'en';
type Theme = 'light' | 'dark';

interface SettingsContextType {
    language: Language;
    theme: Theme;
    setLanguage: (lang: Language) => void;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    ru: {
        // Header
        'nav.shop': 'Магазин',
        'nav.services': 'Услуги',
        'nav.about': 'О нас',
        'nav.faq': 'FAQ',
        'nav.contact': 'Контакты',
        'nav.login': 'Войти',
        'nav.logout': 'Выйти',
        'nav.account': 'Личный кабинет',
        'nav.orders': 'Мои заказы',
        'nav.documents': 'Документы',
        'nav.settings': 'Настройки',
        'user.wholesale': 'Оптовик',
        'user.retail': 'Розница',
        
        // Shop Page
        'shop.title': 'Магазин',
        'shop.subtitle': 'Выберите свежий кофе для вашего бизнеса или дома',
        'shop.search': 'Поиск: эспрессо, шоколад, Бразилия…',
        'shop.sort': 'Сортировка',
        'shop.sort.popular': 'Популярные',
        'shop.sort.rating': 'По рейтингу',
        'shop.sort.priceAsc': 'Цена: дешевле',
        'shop.sort.priceDesc': 'Цена: дороже',
        'shop.filter.all': 'Все',
        'shop.filter.espresso': 'Эспрессо-смеси',
        'shop.filter.arabica': '100% Арабика',
        'shop.filter.robusta': 'С робустой',
        'shop.loading': 'Загрузка товаров...',
        'shop.empty': 'Товары не найдены',
        'shop.addToCart': 'В корзину',
        'shop.kg': 'кг',
        'shop.perKg': '₸/кг',
        
        // Cart
        'cart.title': 'Корзина',
        'cart.empty': 'Корзина пуста',
        'cart.total': 'Итого',
        'cart.checkout': 'Оформить заказ',
        'cart.continue': 'Продолжить покупки',
        'cart.remove': 'Удалить',
        
        // Checkout
        'checkout.title': 'Оформление заказа',
        'checkout.name': 'Имя',
        'checkout.phone': 'Телефон',
        'checkout.email': 'Email',
        'checkout.city': 'Город',
        'checkout.address': 'Адрес доставки',
        'checkout.comment': 'Комментарий',
        'checkout.delivery': 'Способ доставки',
        'checkout.payment': 'Оплата',
        'checkout.submit': 'Подтвердить заказ',
        
        // Hero
        'hero.title': 'Свежеобжаренный кофе',
        'hero.subtitle': 'от производителя',
        'hero.cta': 'Перейти в магазин',
        
        // Footer
        'footer.rights': 'Все права защищены',
        'footer.made': 'Сделано с ❤️ в Казахстане',
        
        // Common
        'common.loading': 'Загрузка...',
        'common.error': 'Ошибка',
        'common.success': 'Успешно',
        'common.save': 'Сохранить',
        'common.cancel': 'Отмена',
        'common.close': 'Закрыть',
        
        // About
        'about.title': 'О компании',
        'about.subtitle': 'Мы обжариваем кофе с 2018 года',
        'about.story': 'Наша история',
        
        // Services
        'services.title': 'Услуги',
        'services.subtitle': 'Комплексные решения для вашего бизнеса',
        'services.training': 'Обучение бариста',
        'services.equipment': 'Кофейное оборудование',
        
        // Contact
        'contact.title': 'Контакты',
        'contact.subtitle': 'Свяжитесь с нами',
        'contact.address': 'Адрес',
        'contact.phone': 'Телефон',
        'contact.email': 'Email',
        
        // FAQ
        'faq.title': 'Частые вопросы',
        'faq.subtitle': 'Ответы на популярные вопросы',
        
        // Auth
        'auth.login': 'Вход',
        'auth.register': 'Регистрация',
        'auth.email': 'Email',
        'auth.password': 'Пароль',
        'auth.name': 'Имя',
        'auth.phone': 'Телефон',
        'auth.submit': 'Войти',
        'auth.noAccount': 'Нет аккаунта?',
        'auth.hasAccount': 'Уже есть аккаунт?',
    },
    en: {
        // Header
        'nav.shop': 'Shop',
        'nav.services': 'Services',
        'nav.about': 'About',
        'nav.faq': 'FAQ',
        'nav.contact': 'Contact',
        'nav.login': 'Sign In',
        'nav.logout': 'Sign Out',
        'nav.account': 'My Account',
        'nav.orders': 'My Orders',
        'nav.documents': 'Documents',
        'nav.settings': 'Settings',
        'user.wholesale': 'Wholesale',
        'user.retail': 'Retail',
        
        // Shop Page
        'shop.title': 'Shop',
        'shop.subtitle': 'Choose fresh coffee for your business or home',
        'shop.search': 'Search: espresso, chocolate, Brazil…',
        'shop.sort': 'Sort by',
        'shop.sort.popular': 'Popular',
        'shop.sort.rating': 'Rating',
        'shop.sort.priceAsc': 'Price: Low to High',
        'shop.sort.priceDesc': 'Price: High to Low',
        'shop.filter.all': 'All',
        'shop.filter.espresso': 'Espresso Blends',
        'shop.filter.arabica': '100% Arabica',
        'shop.filter.robusta': 'With Robusta',
        'shop.loading': 'Loading products...',
        'shop.empty': 'No products found',
        'shop.addToCart': 'Add to Cart',
        'shop.kg': 'kg',
        'shop.perKg': '₸/kg',
        
        // Cart
        'cart.title': 'Cart',
        'cart.empty': 'Your cart is empty',
        'cart.total': 'Total',
        'cart.checkout': 'Checkout',
        'cart.continue': 'Continue Shopping',
        'cart.remove': 'Remove',
        
        // Checkout
        'checkout.title': 'Checkout',
        'checkout.name': 'Name',
        'checkout.phone': 'Phone',
        'checkout.email': 'Email',
        'checkout.city': 'City',
        'checkout.address': 'Delivery Address',
        'checkout.comment': 'Comment',
        'checkout.delivery': 'Delivery Method',
        'checkout.payment': 'Payment',
        'checkout.submit': 'Place Order',
        
        // Hero
        'hero.title': 'Freshly Roasted Coffee',
        'hero.subtitle': 'from the manufacturer',
        'hero.cta': 'Shop Now',
        
        // Footer
        'footer.rights': 'All rights reserved',
        'footer.made': 'Made with ❤️ in Kazakhstan',
        
        // Common
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.close': 'Close',
        
        // About
        'about.title': 'About Us',
        'about.subtitle': 'Roasting coffee since 2018',
        'about.story': 'Our Story',
        
        // Services
        'services.title': 'Services',
        'services.subtitle': 'Complete solutions for your business',
        'services.training': 'Barista Training',
        'services.equipment': 'Coffee Equipment',
        
        // Contact
        'contact.title': 'Contact',
        'contact.subtitle': 'Get in touch',
        'contact.address': 'Address',
        'contact.phone': 'Phone',
        'contact.email': 'Email',
        
        // FAQ
        'faq.title': 'FAQ',
        'faq.subtitle': 'Answers to common questions',
        
        // Auth
        'auth.login': 'Sign In',
        'auth.register': 'Sign Up',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.name': 'Name',
        'auth.phone': 'Phone',
        'auth.submit': 'Sign In',
        'auth.noAccount': "Don't have an account?",
        'auth.hasAccount': 'Already have an account?',
    },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('ru');
    const [theme, setThemeState] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        const savedTheme = localStorage.getItem('theme') as Theme;
        
        if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
            setLanguageState(savedLang);
        }
        
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            setThemeState(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setThemeState('dark');
        }
        
        setMounted(true);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return;
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    // Save language to localStorage
    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem('language', language);
    }, [language, mounted]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <SettingsContext.Provider value={{ language, theme, setLanguage, setTheme, toggleTheme, t }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
