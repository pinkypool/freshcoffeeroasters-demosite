'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { Icons } from '@/components/Icons';
import { TEEZ_CITIES_LIST, getPickupPointsForCity } from '@/lib/logistics';

type DeliveryMethod = 'teez' | 'courier';
type PaymentMethod = 'robokassa' | 'invoice';

export default function CheckoutPage() {
    const { items, getCartTotal, clearCart } = useCart();
    const { data: session } = useSession();
    const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('teez');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedPvz, setSelectedPvz] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [isAutofilled, setIsAutofilled] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        comment: '',
    });

    // Autofill from saved addresses for logged in users
    useEffect(() => {
        if (session?.user && !isAutofilled) {
            fetch('/api/user/addresses')
                .then(res => res.json())
                .then(data => {
                    if (data.savedData) {
                        setFormData(prev => ({
                            ...prev,
                            name: data.savedData.name || prev.name,
                            phone: data.savedData.phone || prev.phone,
                            email: data.savedData.email || prev.email,
                            address: data.savedData.address || prev.address,
                        }));
                        if (data.savedData.city) {
                            setSelectedCity(data.savedData.city);
                        }
                        if (data.savedData.deliveryMethod) {
                            setDeliveryMethod(data.savedData.deliveryMethod as DeliveryMethod);
                        }
                        if (data.savedData.pickupPointId) {
                            setSelectedPvz(data.savedData.pickupPointId);
                        }
                        setIsAutofilled(true);
                    }
                })
                .catch(err => console.error('Autofill error:', err));
        }
    }, [session, isAutofilled]);

    // Get pickup points for selected city
    const cityPickupPoints = useMemo(() => {
        if (!selectedCity) return [];
        return getPickupPointsForCity(selectedCity);
    }, [selectedCity]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(e.target.value);
        setSelectedPvz(''); // Reset PVZ when city changes
    };

    const handleSubmitInfo = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePaymentSelect = (method: PaymentMethod) => {
        setPaymentMethod(method);
    };

    const handleConfirmOrder = async () => {
        setIsSubmitting(true);
        setOrderError(null);

        try {
            // Build full delivery address
            let fullAddress = '';
            if (deliveryMethod === 'teez' && selectedPvz) {
                // Find PVZ address by ID
                const pvz = cityPickupPoints.find(p => p.id === selectedPvz);
                fullAddress = pvz ? pvz.address : selectedPvz;
            } else if (deliveryMethod === 'courier' && formData.address) {
                fullAddress = formData.address;
            }

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    customerEmail: formData.email || null,
                    city: selectedCity,
                    address: fullAddress, // Full PVZ or courier address
                    deliveryMethod,
                    pickupPointId: deliveryMethod === 'teez' ? selectedPvz : null,
                    comment: formData.comment || null,
                    paymentMethod,
                    items: items.map(item => ({
                        sku: item.sku, // This is the slug used for UUID lookup
                        name: item.name,
                        quantity: item.quantity,
                        pricePerKg: item.pricePerKg, // Already discounted
                        total: item.total,
                    })),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Ошибка создания заказа');
            }

            setOrderNumber(result.order.orderNumber);
            setStep('success');
            clearCart();
        } catch (error) {
            console.error('Order error:', error);
            setOrderError(error instanceof Error ? error.message : 'Ошибка создания заказа');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if form is valid
    const isFormValid = () => {
        if (!formData.name || !formData.phone) return false;
        if (deliveryMethod === 'teez') {
            return selectedCity && selectedPvz;
        } else {
            return selectedCity && formData.address;
        }
    };

    const phoneHelperText = useMemo(() => {
        const digits = formData.phone.replace(/\D/g, '');
        if (!digits) return 'Формат: +7 (777) 123-45-67';
        if (digits.length < 10) return 'Введите телефон полностью — так мы быстрее подтвердим заказ';
        return 'Ок';
    }, [formData.phone]);

    if (items.length === 0 && step !== 'success') {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyIcon}><Icons.Cart size={64} /></div>
                <h1>Корзина пуста</h1>
                <p>Добавьте товары для оформления заказа</p>
                <Link href="/shop" className={styles.shopBtn}>
                    Перейти в магазин
                </Link>
            </div>
        );
    }

    return (
        <div className={`${styles.checkoutContainer} animate-fade-in`}>
            {/* Progress Steps */}
            <div className={styles.progressBar}>
                <div className={`${styles.progressStep} ${step === 'info' || step === 'payment' || step === 'success' ? styles.active : ''}`}>
                    <span className={styles.stepNumber}>1</span>
                    <span className={styles.stepLabel}>Данные</span>
                </div>
                <div className={styles.progressLine}></div>
                <div className={`${styles.progressStep} ${step === 'payment' || step === 'success' ? styles.active : ''}`}>
                    <span className={styles.stepNumber}>2</span>
                    <span className={styles.stepLabel}>Оплата</span>
                </div>
                <div className={styles.progressLine}></div>
                <div className={`${styles.progressStep} ${step === 'success' ? styles.active : ''}`}>
                    <span className={styles.stepNumber}>3</span>
                    <span className={styles.stepLabel}>Готово</span>
                </div>
            </div>

            {/* Step 1: Customer Info */}
            {step === 'info' && (
                <div className={styles.stepContent}>
                    <div className={styles.formSection}>
                        <h1 className={styles.stepTitle}>Оформление заказа</h1>

                        <form onSubmit={handleSubmitInfo}>
                            {/* Contact Info */}
                            <div className={styles.formGroup}>
                                <h2 className={styles.groupTitle}>
                                    <Icons.User className={styles.groupIcon} /> Контактные данные
                                </h2>
                                <div className={styles.inputRow}>
                                    <div className={styles.inputWrapper}>
                                        <label>Имя *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Ваше имя"
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.inputWrapper}>
                                        <label>Телефон *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+7 (___) ___-__-__"
                                            required
                                            className={styles.input}
                                        />
                                        <div className={`${styles.helperText} ${phoneHelperText === 'Ок' ? styles.helperOk : ''}`}>
                                            {phoneHelperText}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.inputWrapper}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="email@example.com"
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            {/* Delivery */}
                            <div className={styles.formGroup}>
                                <h2 className={styles.groupTitle}>
                                    <Icons.Truck className={styles.groupIcon} /> Доставка
                                </h2>

                                <div className={styles.subHint}>
                                    Бесплатно до ПВЗ Teez (если есть в городе). Курьер — по согласованию.
                                </div>

                                <div className={styles.deliveryOptions}>
                                    <label className={`${styles.deliveryOption} ${deliveryMethod === 'teez' ? styles.selected : ''}`}>
                                        <input
                                            type="radio"
                                            name="delivery"
                                            checked={deliveryMethod === 'teez'}
                                            onChange={() => setDeliveryMethod('teez')}
                                        />
                                        <div className={styles.deliveryContent}>
                                            <span className={styles.deliveryIcon}><Icons.Package size={24} /></span>
                                            <div>
                                                <strong>Пункт выдачи Teez</strong>
                                                <span className={styles.deliveryPrice}>Бесплатно</span>
                                            </div>
                                        </div>
                                    </label>
                                    <label className={`${styles.deliveryOption} ${deliveryMethod === 'courier' ? styles.selected : ''}`}>
                                        <input
                                            type="radio"
                                            name="delivery"
                                            checked={deliveryMethod === 'courier'}
                                            onChange={() => setDeliveryMethod('courier')}
                                        />
                                        <div className={styles.deliveryContent}>
                                            <span className={styles.deliveryIcon}><Icons.Delivery size={24} /></span>
                                            <div>
                                                <strong>Курьер / Почта</strong>
                                                <span className={styles.deliveryPrice}>Рассчитывается отдельно</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                {/* City Selection */}
                                <div className={styles.inputWrapper}>
                                    <label>Город *</label>
                                    <select
                                        value={selectedCity}
                                        onChange={handleCityChange}
                                        required
                                        className={styles.select}
                                    >
                                        <option value="">Выберите город</option>
                                        {TEEZ_CITIES_LIST.map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* PVZ Selection (only for Teez delivery) */}
                                {deliveryMethod === 'teez' && selectedCity && (
                                    <div className={styles.inputWrapper}>
                                        <label>Пункт выдачи *</label>
                                        {cityPickupPoints.length > 0 ? (
                                            <select
                                                value={selectedPvz}
                                                onChange={(e) => setSelectedPvz(e.target.value)}
                                                required
                                                className={styles.select}
                                            >
                                                <option value="">Выберите ПВЗ</option>
                                                {cityPickupPoints.map((point) => (
                                                    <option key={point.id} value={point.id}>
                                                        {point.address}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className={styles.noPvzMessage}>
                                                <Icons.Location size={16} />
                                                В этом городе нет ПВЗ Teez. Выберите курьерскую доставку.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Address (only for courier) */}
                                {deliveryMethod === 'courier' && (
                                    <div className={styles.inputWrapper}>
                                        <label>Адрес доставки *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Улица, дом, квартира"
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Comment */}
                            <div className={styles.formGroup}>
                                <h2 className={styles.groupTitle}>
                                    <Icons.Message className={styles.groupIcon} /> Комментарий
                                </h2>
                                <textarea
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    placeholder="Пожелания к заказу..."
                                    className={styles.textarea}
                                    rows={3}
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={!isFormValid()}
                            >
                                Продолжить к оплате <Icons.ArrowRight />
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className={styles.summarySection}>
                        <h2 className={styles.summaryTitle}>Ваш заказ</h2>
                        <div className={styles.summaryItems}>
                            {items.map((item) => (
                                <div key={item.sku} className={styles.summaryItem}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <span className={styles.itemQty}>{item.quantity} кг</span>
                                    <span className={styles.itemPrice}>{item.total.toLocaleString('ru-RU')} ₸</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.summaryTotal}>
                            <span>Итого:</span>
                            <strong>{getCartTotal().toLocaleString('ru-RU')} ₸</strong>
                        </div>
                        <div className={styles.summaryNote}>
                            Нажимая «Продолжить», вы переходите к выбору оплаты.
                        </div>
                        {deliveryMethod === 'teez' && (
                            <div className={styles.freeDeliveryNote}>
                                <Icons.Check size={16} /> Бесплатная доставка до ПВЗ
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Step 2: Payment Selection */}
            {step === 'payment' && (
                <div className={styles.paymentStep}>
                    <h1 className={styles.stepTitle}>Выберите способ оплаты</h1>

                    <div className={styles.paymentGrid}>
                        {/* Robokassa - for everyone */}
                        <button
                            className={`${styles.paymentCard} ${paymentMethod === 'robokassa' ? styles.selected : ''}`}
                            onClick={() => handlePaymentSelect('robokassa')}
                        >
                            <div className={styles.paymentIcon}>
                                <Icons.Card size={40} />
                            </div>
                            <h3>Онлайн оплата</h3>
                            <p>Kaspi, карта, Apple Pay и др.</p>
                            <span className={styles.paymentBadge}>Робокасса</span>
                        </button>

                        {/* Invoice - only for wholesale users */}
                        {session?.user?.type === 'WHOLESALE' && (
                            <button
                                className={`${styles.paymentCard} ${paymentMethod === 'invoice' ? styles.selected : ''}`}
                                onClick={() => handlePaymentSelect('invoice')}
                            >
                                <div className={styles.paymentIcon}>
                                    <Icons.FileText size={40} />
                                </div>
                                <h3>Счёт на оплату</h3>
                                <p>Безналичный расчёт для юрлиц</p>
                                <span className={styles.paymentBadge} style={{ background: '#E3F2FD', color: '#1976D2' }}>
                                    Для оптовиков
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Invoice info message */}
                    {paymentMethod === 'invoice' && (
                        <div className={styles.invoiceInfo} style={{
                            background: '#FFF8E1',
                            border: '1px solid #FFE082',
                            borderRadius: '12px',
                            padding: '16px',
                            marginTop: '20px',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start',
                        }}>
                            <Icons.Info size={24} style={{ color: '#F9A825', flexShrink: 0 }} />
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Как это работает:</strong>
                                <p style={{ margin: 0, fontSize: '14px', color: '#5D4037' }}>
                                    После оформления заказа счёт на оплату появится в вашем профиле
                                    в разделе <strong>Заказы → Документы</strong> в рабочее время (пн-пт, 9:00-18:00).
                                </p>
                            </div>
                        </div>
                    )}

                    <div className={styles.paymentSummary}>
                        <div className={styles.summaryLine}>
                            <span>К оплате:</span>
                            <strong className={styles.totalAmount}>{getCartTotal().toLocaleString('ru-RU')} ₸</strong>
                        </div>
                    </div>

                    {orderError && (
                        <div className={styles.error} style={{ color: '#e74c3c', marginBottom: '1rem', textAlign: 'center' }}>
                            {orderError}
                        </div>
                    )}

                    <div className={styles.paymentActions}>
                        <button className={styles.backBtn} onClick={() => setStep('info')} disabled={isSubmitting}>
                            <Icons.ArrowLeft /> Назад
                        </button>
                        <button
                            className={styles.confirmBtn}
                            disabled={!paymentMethod || isSubmitting}
                            onClick={handleConfirmOrder}
                        >
                            {isSubmitting ? 'Оформление...' : paymentMethod === 'invoice' ? 'Запросить счёт' : 'Перейти к оплате'} <Icons.Check />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
                <div className={styles.successStep}>
                    <div className={styles.successIcon}><Icons.Check size={40} /></div>
                    <h1 className={styles.successTitle}>
                        {paymentMethod === 'invoice' ? 'Заявка принята!' : 'Заказ оформлен!'}
                    </h1>
                    {orderNumber && (
                        <p className={styles.orderNumber} style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem' }}>
                            Номер заказа: {orderNumber}
                        </p>
                    )}

                    {paymentMethod === 'invoice' ? (
                        <>
                            <p className={styles.successText}>
                                Ваша заявка на счёт принята. Документ появится в личном кабинете.
                            </p>
                            <div className={styles.successInfo} style={{
                                background: '#E3F2FD',
                                padding: '16px',
                                borderRadius: '12px',
                                marginBottom: '20px'
                            }}>
                                <p><Icons.Clock size={18} /> Счёт формируется в рабочие дни: пн-пт, 9:00-18:00</p>
                                <p><Icons.FileText size={18} /> Документ появится в разделе Заказы → Документы</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className={styles.successText}>
                                Спасибо за заказ! Мы свяжемся с вами в ближайшее время для подтверждения.
                            </p>
                            <div className={styles.successInfo}>
                                <p><Icons.Phone size={18} /> Вам позвонят в течение 30 минут</p>
                                <p><Icons.Package size={18} /> Кофе будет обжарен в день отправки</p>
                            </div>
                        </>
                    )}

                    <Link href="/account/orders" className={styles.continueBtn}>
                        Перейти к заказам
                    </Link>
                </div>
            )}
        </div>
    );
}
