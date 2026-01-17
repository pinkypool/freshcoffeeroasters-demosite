'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Icons } from '@/components/Icons';
import styles from '../account.module.css';

export default function SettingsPage() {
    const { user } = useAuth();
    const [saved, setSaved] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [passwordError, setPasswordError] = useState('');

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
            setPasswordError('Пароль должен быть минимум 6 символов');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Пароли не совпадают');
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
                setPasswordError(data.error || 'Ошибка смены пароля');
            }
        } catch (err) {
            console.error('Password change failed:', err);
            setPasswordError('Ошибка соединения');
        }
    };

    return (
        <>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Настройки профиля</h1>
                <p className={styles.pageSubtitle}>Управление личными данными и безопасностью</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Personal Info */}
                <div className={styles.formSection}>
                    <h3 className={styles.formTitle}>
                        <Icons.User size={20} /> Личные данные
                    </h3>
                    <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                            <label>Имя</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ваше имя"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Телефон</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+7 (___) ___-__-__"
                            />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                        />
                    </div>
                </div>

                {/* Company Info (only for wholesale) */}
                {user?.type === 'WHOLESALE' && (
                    <div className={styles.formSection}>
                        <h3 className={styles.formTitle}>
                            <Icons.Building size={20} /> Реквизиты компании
                        </h3>
                        <div className={styles.inputGroup}>
                            <label>Название организации</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder='ТОО "Название"'
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label>ИИН/БИН</label>
                                <input
                                    type="text"
                                    name="companyInn"
                                    value={formData.companyInn}
                                    onChange={handleChange}
                                    placeholder="123456789012"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>КПП</label>
                                <input
                                    type="text"
                                    name="companyKpp"
                                    value={formData.companyKpp}
                                    onChange={handleChange}
                                    placeholder="770101001"
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Юридический адрес</label>
                            <input
                                type="text"
                                name="legalAddress"
                                value={formData.legalAddress}
                                onChange={handleChange}
                                placeholder="Полный юридический адрес"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Фактический адрес доставки</label>
                            <input
                                type="text"
                                name="actualAddress"
                                value={formData.actualAddress}
                                onChange={handleChange}
                                placeholder="Адрес для доставки"
                            />
                        </div>
                    </div>
                )}

                <button type="submit" className={styles.saveBtn}>
                    {saved ? (
                        <>
                            <Icons.Check size={18} /> Сохранено!
                        </>
                    ) : (
                        <>
                            <Icons.Edit size={18} /> Сохранить изменения
                        </>
                    )}
                </button>
            </form>

            {/* Password Change Section */}
            <form onSubmit={handlePasswordSubmit} style={{ marginTop: 32 }}>
                <div className={styles.formSection}>
                    <h3 className={styles.formTitle}>
                        <Icons.Lock size={20} /> Смена пароля
                    </h3>
                    <div className={styles.inputGroup}>
                        <label>Текущий пароль</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                            <label>Новый пароль</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Минимум 6 символов"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Подтвердите пароль</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="Повторите пароль"
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
                            <Icons.Check size={18} /> Пароль изменён!
                        </>
                    ) : (
                        <>
                            <Icons.Lock size={18} /> Сменить пароль
                        </>
                    )}
                </button>
            </form>

            {/* Notification Settings */}
            <div className={styles.formSection} style={{ marginTop: 32 }}>
                <h3 className={styles.formTitle}>
                    <Icons.Bell size={20} /> Уведомления
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
                            <div style={{ fontWeight: 600 }}>Статус заказов</div>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>Уведомления о изменении статуса заказов</div>
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
                            <div style={{ fontWeight: 600 }}>Акции и скидки</div>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>Специальные предложения и промокоды</div>
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
                            <div style={{ fontWeight: 600 }}>Новости и статьи</div>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>Полезные материалы о кофе</div>
                        </div>
                    </label>
                </div>
            </div>

            {/* Danger Zone */}
            <div className={styles.formSection} style={{ marginTop: 32, borderColor: '#fee2e2' }}>
                <h3 className={styles.formTitle} style={{ color: '#ef4444' }}>
                    <Icons.Warning size={20} /> Опасная зона
                </h3>
                <p style={{ color: '#666', marginBottom: 16, fontSize: '0.875rem' }}>
                    Эти действия невозможно отменить. Будьте осторожны.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        if (confirm('Вы уверены? Все ваши данные будут удалены безвозвратно.')) {
                            alert('Функция удаления аккаунта в разработке');
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
                    Удалить аккаунт
                </button>
            </div>
        </>
    );
}
