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
        
        // Shop
        'shop.title': 'Наш кофе',
        'shop.subtitle': 'Свежая обжарка каждую неделю',
        'shop.addToCart': 'В корзину',
        'shop.kg': 'кг',
        'shop.perKg': '₸/кг',
        
        // Cart
        'cart.title': 'Корзина',
        'cart.empty': 'Корзина пуста',
        'cart.total': 'Итого',
        'cart.checkout': 'Оформить заказ',
        'cart.continue': 'Продолжить покупки',
        
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
        'about.story': 'Наша история',
        
        // Services
        'services.title': 'Услуги',
        'services.training': 'Обучение бариста',
        'services.equipment': 'Кофейное оборудование',
        
        // Contact
        'contact.title': 'Контакты',
        'contact.address': 'Адрес',
        'contact.phone': 'Телефон',
        'contact.email': 'Email',
        
        // FAQ
        'faq.title': 'Частые вопросы',
        
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
        
        // Shop
        'shop.title': 'Our Coffee',
        'shop.subtitle': 'Freshly roasted every week',
        'shop.addToCart': 'Add to Cart',
        'shop.kg': 'kg',
        'shop.perKg': '₸/kg',
        
        // Cart
        'cart.title': 'Cart',
        'cart.empty': 'Your cart is empty',
        'cart.total': 'Total',
        'cart.checkout': 'Checkout',
        'cart.continue': 'Continue Shopping',
        
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
        'about.story': 'Our Story',
        
        // Services
        'services.title': 'Services',
        'services.training': 'Barista Training',
        'services.equipment': 'Coffee Equipment',
        
        // Contact
        'contact.title': 'Contact',
        'contact.address': 'Address',
        'contact.phone': 'Phone',
        'contact.email': 'Email',
        
        // FAQ
        'faq.title': 'FAQ',
        
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
