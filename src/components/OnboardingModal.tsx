'use client';

import React, { useState } from 'react';
import styles from './OnboardingModal.module.css';
import { Icons } from './Icons';

interface OnboardingModalProps {
    isOpen: boolean;
    onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
    businessType: string;
    orderVolume: string;
    source: string;
}

const businessTypes = [
    { id: 'coffee_shop', label: 'Кофейня', icon: Icons.Coffee },
    { id: 'restaurant', label: 'Ресторан / Кафе / Пекарня', icon: Icons.Office },
    { id: 'shop', label: 'Магазин кофе и чая', icon: Icons.Package },
    { id: 'office', label: 'Офис', icon: Icons.Office },
    { id: 'marketplace', label: 'Маркетплейс', icon: Icons.Cart },
    { id: 'other', label: 'Другое', icon: Icons.Sparkles },
];

const orderVolumes = [
    { id: 'small', label: 'До 5 кг в месяц', description: 'Для небольших компаний' },
    { id: 'medium', label: '5 - 20 кг в месяц', description: 'Средний объём' },
    { id: 'large', label: '20 - 50 кг в месяц', description: 'Оптовые закупки' },
    { id: 'enterprise', label: 'Более 50 кг в месяц', description: 'Крупный опт' },
];

const sources = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'google', label: 'Google / Яндекс' },
    { id: 'recommendation', label: 'Рекомендация' },
    { id: 'exhibition', label: 'Выставка / Мероприятие' },
    { id: 'other', label: 'Другое' },
];

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>({
        businessType: '',
        orderVolume: '',
        source: '',
    });

    if (!isOpen) return null;

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            onComplete(data);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1: return data.businessType !== '';
            case 2: return data.orderVolume !== '';
            case 3: return data.source !== '';
            default: return false;
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Progress Bar */}
                <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                    <span className={styles.progressText}>Шаг {step} из {totalSteps}</span>
                </div>

                {/* Step 1: Business Type */}
                {step === 1 && (
                    <div className={styles.stepContent}>
                        <h2 className={styles.title}>Расскажите о вашем бизнесе</h2>
                        <p className={styles.subtitle}>Выберите вид деятельности вашей компании</p>

                        <div className={styles.optionsGrid}>
                            {businessTypes.map((type) => (
                                <button
                                    key={type.id}
                                    className={`${styles.optionCard} ${data.businessType === type.id ? styles.selected : ''}`}
                                    onClick={() => setData({ ...data, businessType: type.id })}
                                >
                                    <type.icon size={28} />
                                    <span>{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Order Volume */}
                {step === 2 && (
                    <div className={styles.stepContent}>
                        <h2 className={styles.title}>Примерный объём закупок</h2>
                        <p className={styles.subtitle}>Это поможет подобрать оптимальные условия</p>

                        <div className={styles.volumeOptions}>
                            {orderVolumes.map((volume) => (
                                <button
                                    key={volume.id}
                                    className={`${styles.volumeCard} ${data.orderVolume === volume.id ? styles.selected : ''}`}
                                    onClick={() => setData({ ...data, orderVolume: volume.id })}
                                >
                                    <div className={styles.volumeInfo}>
                                        <strong>{volume.label}</strong>
                                        <span>{volume.description}</span>
                                    </div>
                                    <div className={styles.radioCircle}>
                                        {data.orderVolume === volume.id && <div className={styles.radioFill} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Source */}
                {step === 3 && (
                    <div className={styles.stepContent}>
                        <h2 className={styles.title}>Как вы узнали о нас?</h2>
                        <p className={styles.subtitle}>Поможет нам стать лучше</p>

                        <div className={styles.sourceOptions}>
                            {sources.map((source) => (
                                <button
                                    key={source.id}
                                    className={`${styles.sourceChip} ${data.source === source.id ? styles.selected : ''}`}
                                    onClick={() => setData({ ...data, source: source.id })}
                                >
                                    {source.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className={styles.navigation}>
                    {step > 1 && (
                        <button className={styles.backBtn} onClick={handleBack}>
                            <Icons.ArrowLeft size={18} />
                            Назад
                        </button>
                    )}
                    <button
                        className={styles.nextBtn}
                        onClick={handleNext}
                        disabled={!canProceed()}
                    >
                        {step === totalSteps ? 'Готово' : 'Далее'}
                        {step < totalSteps && <Icons.ArrowRight size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
