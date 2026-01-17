'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Icons } from '@/components/Icons';
import styles from '../account.module.css';

import { useSettings } from '@/context/SettingsContext';

export default function SettingsPage() {
    const { user } = useAuth();
    const { language } = useSettings();
    const [saved, setSaved] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const content = {
        ru: {
            title: 'Настройки профиля',
            subtitle: 'Управление личными данными и безопасностью',
            personal: {
                title: 'Личные данные',
                name: 'Имя',
                namePlaceholder: 'Ваше имя',
                phone: 'Телефон',
                phonePlaceholder: '+7 (___) ___-__-__',
                email: 'Email',
                emailPlaceholder: 'email@example.com',
            },
            company: {
                title: 'Реквизиты компании',
                name: 'Название организации',
                namePlaceholder: 'ТОО "Название"',
                inn: 'ИИН/БИН',
                innPlaceholder: '123456789012',
                kpp: 'КПП',
                kppPlaceholder: '770101001',
                legalAddress: 'Юридический адрес',
                legalAddressPlaceholder: 'Полный юридический адрес',
                actualAddress: 'Фактический адрес доставки',
                actualAddressPlaceholder: 'Адрес для доставки',
            },
            password: {
                title: 'Смена пароля',
                current: 'Текущий пароль',
                currentPlaceholder: '••••••••',
                new: 'Новый пароль',
                newPlaceholder: 'Минимум 6 символов',
                confirm: 'Подтвердите пароль',
                confirmPlaceholder: 'Повторите пароль',
                btn: 'Сменить пароль',
                success: 'Пароль изменён!',
                errors: {
                    length: 'Пароль должен быть минимум 6 символов',
                    match: 'Пароли не совпадают',
                    failed: 'Ошибка смены пароля',
                    connection: 'Ошибка соединения',
                }
            },
            notifications: {
                title: 'Уведомления',
                order: {
                    title: 'Статус заказов',
                    desc: 'Уведомления о изменении статуса заказов',
                },
                promo: {
                    title: 'Акции и скидки',
                    desc: 'Специальные предложения и промокоды',
                },
                news: {
                    title: 'Новости и статьи',
                    desc: 'Полезные материалы о кофе',
                }
            },
            danger: {
                title: 'Опасная зона',
                text: 'Эти действия невозможно отменить. Будьте осторожны.',
                btn: 'Удалить аккаунт',
                confirm: 'Вы уверены? Все ваши данные будут удалены безвозвратно.',
                wip: 'Функция удаления аккаунта в разработке',
            },
            save: {
                btn: 'Сохранить изменения',
                success: 'Сохранено!',
                failed: 'Ошибка сохранения',
            }
        },
        en: {
            title: 'Profile Settings',
            subtitle: 'Manage personal data and security',
            personal: {
                title: 'Personal Information',
                name: 'Name',
                namePlaceholder: 'Your name',
                phone: 'Phone',
                phonePlaceholder: '+7 (___) ___-__-__',
                email: 'Email',
                emailPlaceholder: 'email@example.com',
            },
            company: {
                title: 'Company Details',
                name: 'Company Name',
                namePlaceholder: 'LLC "Company Name"',
                inn: 'IIN/BIN',
                innPlaceholder: '123456789012',
                kpp: 'KPP',
                kppPlaceholder: '770101001',
                legalAddress: 'Legal Address',
                legalAddressPlaceholder: 'Full legal address',
                actualAddress: 'Delivery Address',
                actualAddressPlaceholder: 'Delivery address',
            },
            password: {
                title: 'Change Password',
                current: 'Current Password',
                currentPlaceholder: '••••••••',
                new: 'New Password',
                newPlaceholder: 'Minimum 6 characters',
                confirm: 'Confirm Password',
                confirmPlaceholder: 'Repeat password',
                btn: 'Change Password',
                success: 'Password Changed!',
                errors: {
                    length: 'Password must be at least 6 characters',
                    match: 'Passwords do not match',
                    failed: 'Password change failed',
                    connection: 'Connection error',
                }
            },
            notifications: {
                title: 'Notifications',
                order: {
                    title: 'Order Status',
                    desc: 'Notifications about order status changes',
                },
                promo: {
                    title: 'Promotions & Discounts',
                    desc: 'Special offers and promo codes',
                },
                news: {
                    title: 'News & Articles',
                    desc: 'Useful materials about coffee',
                }
            },
            danger: {
                title: 'Danger Zone',
                text: 'These actions cannot be undone. Be careful.',
                btn: 'Delete Account',
                confirm: 'Are you sure? All your data will be permanently deleted.',
                wip: 'Account deletion is under development',
            },
            save: {
                btn: 'Save Changes',
                success: 'Saved!',
                failed: 'Save failed',
            }
        },
    };

    const t = content[language];

    // Get default company for wholesale users
    const defaultCompany = user?.companies?.find(c => c.isDefault) || user?.companies?.[0];

    // Form state (pre-filled with user data)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        companyName: defaultCompany?.name || '',
        companyInn: defaultCompany?.bin || '',
        companyKpp: '',
        legalAddress: defaultCompany?.legalAddress || '',
        actualAddress: defaultCompany?.deliveryAddress || '',
    });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: false,
        newsletter: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSaved(false);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
        setPasswordError('');
        setPasswordSaved(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        // Validation
        if (passwordData.newPassword.length < 6) {
            setPasswordError(t.password.errors.length);
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError(t.password.errors.match);
            return;
        }

        try {
            const res = await fetch('/api/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            if (res.ok) {
                setPasswordSaved(true);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setPasswordSaved(false), 3000);
            } else {
                const data = await res.json();
                setPasswordError(data.error || t.password.errors.failed);
            }
        } catch (err) {
            console.error('Password change failed:', err);
            setPasswordError(t.password.errors.connection);
        }
    };

    return (
        <>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{t.title}</h1>
                <p className={styles.pageSubtitle}>{t.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Personal Info */}
                <div className={styles.formSection}>
                    <h3 className={styles.formTitle}>
                        <Icons.User size={20} /> {t.personal.title}
                    </h3>
                    <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                            <label>{t.personal.name}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t.personal.namePlaceholder}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>{t.personal.phone}</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder={t.personal.phonePlaceholder}
                            />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>{t.personal.email}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t.personal.emailPlaceholder}
                        />
                    </div>
                </div>

                {/* Company Info (only for wholesale) */}
                {user?.type === 'WHOLESALE' && (
                    <div className={styles.formSection}>
                        <h3 className={styles.formTitle}>
                            <Icons.Building size={20} /> {t.company.title}
                        </h3>
                        <div className={styles.inputGroup}>
                            <label>{t.company.name}</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder={t.company.namePlaceholder}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label>{t.company.inn}</label>
                                <input
                                    type="text"
                                    name="companyInn"
                                    value={formData.companyInn}
                                    onChange={handleChange}
                                    placeholder={t.company.innPlaceholder}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>{t.company.kpp}</label>
                                <input
                                    type="text"
                                    name="companyKpp"
                                    value={formData.companyKpp}
                                    onChange={handleChange}
                                    placeholder={t.company.kppPlaceholder}
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>{t.company.legalAddress}</label>
                            <input
                                type="text"
                                name="legalAddress"
                                value={formData.legalAddress}
                                onChange={handleChange}
                                placeholder={t.company.legalAddressPlaceholder}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>{t.company.actualAddress}</label>
                            <input
                                type="text"
                                name="actualAddress"
                                value={formData.actualAddress}
                                onChange={handleChange}
                                placeholder={t.company.actualAddressPlaceholder}
                            />
                        </div>
                    </div>
                )}

                <button type="submit" className={styles.saveBtn}>
                    {saved ? (
                        <>
                            <Icons.Check size={18} /> {t.save.success}
                        </>
                    ) : (
                        <>
                            <Icons.Edit size={18} /> {t.save.btn}
                        </>
                    )}
                </button>
            </form>

            {/* Password Change Section */}
            <form onSubmit={handlePasswordSubmit} style={{ marginTop: 32 }}>
                <div className={styles.formSection}>
                    <h3 className={styles.formTitle}>
                        <Icons.Lock size={20} /> {t.password.title}
                    </h3>
                    <div className={styles.inputGroup}>
                        <label>{t.password.current}</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder={t.password.currentPlaceholder}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                            <label>{t.password.new}</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder={t.password.newPlaceholder}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>{t.password.confirm}</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder={t.password.confirmPlaceholder}
                            />
                        </div>
                    </div>
                    {passwordError && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: 8 }}>
                            {passwordError}
                        </div>
                    )}
                </div>
                <button type="submit" className={styles.saveBtn} style={{ background: '#6366f1' }}>
                    {passwordSaved ? (
                        <>
                            <Icons.Check size={18} /> {t.password.success}
                        </>
                    ) : (
                        <>
                            <Icons.Lock size={18} /> {t.password.btn}
                        </>
                    )}
                </button>
            </form>

            {/* Notification Settings */}
            <div className={styles.formSection} style={{ marginTop: 32 }}>
                <h3 className={styles.formTitle}>
                    <Icons.Bell size={20} /> {t.notifications.title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={notifications.orderUpdates}
                            onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
                            style={{ width: 20, height: 20, accentColor: '#4849e8' }}
                        />
                        <div>
                            <div style={{ fontWeight: 600 }}>{t.notifications.order.title}</div>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>{t.notifications.order.desc}</div>
                        </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={notifications.promotions}
                            onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
                            style={{ width: 20, height: 20, accentColor: '#4849e8' }}
                        />
                        <div>
                            <div style={{ fontWeight: 600 }}>{t.notifications.promo.title}</div>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>{t.notifications.promo.desc}</div>
                        </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={notifications.newsletter}
                            onChange={(e) => setNotifications({ ...notifications, newsletter: e.target.checked })}
                            style={{ width: 20, height: 20, accentColor: '#4849e8' }}
                        />
                        <div>
                            <div style={{ fontWeight: 600 }}>{t.notifications.news.title}</div>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>{t.notifications.news.desc}</div>
                        </div>
                    </label>
                </div>
            </div>

            {/* Danger Zone */}
            <div className={styles.formSection} style={{ marginTop: 32, borderColor: '#fee2e2' }}>
                <h3 className={styles.formTitle} style={{ color: '#ef4444' }}>
                    <Icons.Warning size={20} /> {t.danger.title}
                </h3>
                <p style={{ color: '#666', marginBottom: 16, fontSize: '0.875rem' }}>
                    {t.danger.text}
                </p>
                <button
                    type="button"
                    onClick={() => {
                        if (confirm(t.danger.confirm)) {
                            alert(t.danger.wip);
                        }
                    }}
                    style={{
                        background: 'white',
                        color: '#ef4444',
                        border: '2px solid #ef4444',
                        padding: '12px 24px',
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    {t.danger.btn}
                </button>
            </div>
        </>
    );
}
