'use client';

import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import styles from './VolumeSlider.module.css';
import { getPriceForQuantity, getUpsellMessage } from '@/lib/pricing';

interface VolumeSliderProps {
    sku: string;
    onQuantityChange: (quantity: number, pricePerKg: number, total: number) => void;
}

// Define the tier breakpoints for visual markers - matching the reference image style
const TIER_STEPS = [
    { kg: 1, position: 0 },
    { kg: 5, position: 16, discount: '-5%' },
    { kg: 10, position: 32, discount: '-10%' },
    { kg: 30, position: 55, discount: '-15%' },
    { kg: 50, position: 75, discount: '-20%' },
    { kg: 100, position: 100, discount: '-25%' },
];

export default function VolumeSlider({ sku, onQuantityChange }: VolumeSliderProps) {
    const [quantity, setQuantity] = React.useState(1);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { pricePerKg, total } = useMemo(() => {
        return getPriceForQuantity(sku, quantity);
    }, [sku, quantity]);

    // Calculate slider percentage based on tier steps (non-linear)
    const getSliderPosition = (qty: number) => {
        for (let i = TIER_STEPS.length - 1; i >= 0; i--) {
            if (qty >= TIER_STEPS[i].kg) {
                if (i === TIER_STEPS.length - 1) return 100;
                const currentStep = TIER_STEPS[i];
                const nextStep = TIER_STEPS[i + 1];
                const rangeKg = nextStep.kg - currentStep.kg;
                const positionRange = nextStep.position - currentStep.position;
                const progress = (qty - currentStep.kg) / rangeKg;
                return currentStep.position + progress * positionRange;
            }
        }
        return 0;
    };

    // Calculate quantity from slider percentage (reverse of getSliderPosition)
    const getQuantityFromPosition = (pos: number) => {
        if (pos >= 100) return 100;
        if (pos <= 0) return 1;

        for (let i = 0; i < TIER_STEPS.length - 1; i++) {
            const currentStep = TIER_STEPS[i];
            const nextStep = TIER_STEPS[i + 1];

            if (pos >= currentStep.position && pos <= nextStep.position) {
                const positionRange = nextStep.position - currentStep.position;
                const progress = (pos - currentStep.position) / positionRange;
                const rangeKg = nextStep.kg - currentStep.kg;
                return Math.round(currentStep.kg + progress * rangeKg);
            }
        }
        return 1;
    };

    const sliderPercentage = getSliderPosition(quantity);

    const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newPos = parseFloat(e.target.value);
        const newQty = getQuantityFromPosition(newPos);

        setQuantity(newQty);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            const priceInfo = getPriceForQuantity(sku, newQty);
            onQuantityChange(newQty, priceInfo.pricePerKg, priceInfo.total);
        }, 50);
    }, [sku, onQuantityChange]);

    // Initial call + keep parent in sync when sku changes
    useEffect(() => {
        const priceInfo = getPriceForQuantity(sku, quantity);
        onQuantityChange(quantity, priceInfo.pricePerKg, priceInfo.total);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sku]);

    // Cleanup pending debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const upsell = useMemo(() => getUpsellMessage(sku, quantity), [sku, quantity]);

    return (
        <div className={styles.sliderContainer}>
            {/* Discount Percentage Row - Like Reference Image */}
            <div className={styles.discountRow}>
                {TIER_STEPS.filter(t => t.discount).map((tier) => {
                    const isActive = quantity >= tier.kg;
                    return (
                        <span
                            key={tier.kg}
                            className={`${styles.discountBadge} ${isActive ? styles.discountActive : ''}`}
                            style={{ left: `${tier.position}%` }}
                        >
                            {tier.discount}
                        </span>
                    );
                })}
            </div>

            {/* Weight Markers Row */}
            <div className={styles.weightMarkers}>
                {TIER_STEPS.map((tier) => (
                    <span
                        key={tier.kg}
                        className={`${styles.weightLabel} ${quantity >= tier.kg ? styles.weightActive : ''}`}
                        style={{ left: `${tier.position}%` }}
                    >
                        {tier.kg}кг
                    </span>
                ))}
            </div>

            {/* Slider Track */}
            <div className={styles.sliderTrack}>
                <div
                    className={styles.sliderFill}
                    style={{ width: `${sliderPercentage}%` }}
                />
                {/* Tier Dots on Track */}
                {TIER_STEPS.map((tier) => (
                    <div
                        key={tier.kg}
                        className={`${styles.tierDot} ${quantity >= tier.kg ? styles.tierDotActive : ''}`}
                        style={{ left: `${tier.position}%` }}
                    />
                ))}
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={sliderPercentage}
                    onChange={handleSliderChange}
                    className={styles.sliderInput}
                />
            </div>

            {/* Motivational Hint */}
            <div className={styles.hintRow}>
                {upsell ? (
                    <span className={styles.hintMedium}>{upsell}</span>
                ) : (
                    <>
                        {quantity < 5 && (
                            <span className={styles.hintSmall}>Увеличьте объём для скидки</span>
                        )}
                        {quantity >= 5 && quantity < 10 && (
                            <span className={styles.hintMedium}>Скидка -5% активна</span>
                        )}
                        {quantity >= 10 && quantity < 30 && (
                            <span className={styles.hintGood}>Скидка -10% активна</span>
                        )}
                        {quantity >= 30 && quantity < 50 && (
                            <span className={styles.hintGreat}>Скидка -15% активна</span>
                        )}
                        {quantity >= 50 && quantity < 100 && (
                            <span className={styles.hintBest}>Скидка -20% активна</span>
                        )}
                        {quantity === 100 && (
                            <span className={styles.hintMax}>Максимальная скидка -25%</span>
                        )}
                    </>
                )}
            </div>

            {/* Price Display Row */}
            <div className={styles.priceRow}>
                <div className={styles.quantityDisplay}>
                    <button
                        className={styles.quantityBtn}
                        onClick={() => {
                            const newQty = Math.max(1, quantity - 1);
                            setQuantity(newQty);
                            const priceInfo = getPriceForQuantity(sku, newQty);
                            onQuantityChange(newQty, priceInfo.pricePerKg, priceInfo.total);
                        }}
                        aria-label="Уменьшить"
                    >−</button>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={quantity}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            const newQty = Math.min(100, Math.max(1, val));
                            setQuantity(newQty);
                            const priceInfo = getPriceForQuantity(sku, newQty);
                            onQuantityChange(newQty, priceInfo.pricePerKg, priceInfo.total);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                const newQty = Math.min(100, quantity + 1);
                                setQuantity(newQty);
                                const priceInfo = getPriceForQuantity(sku, newQty);
                                onQuantityChange(newQty, priceInfo.pricePerKg, priceInfo.total);
                            } else if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                const newQty = Math.max(1, quantity - 1);
                                setQuantity(newQty);
                                const priceInfo = getPriceForQuantity(sku, newQty);
                                onQuantityChange(newQty, priceInfo.pricePerKg, priceInfo.total);
                            }
                        }}
                        className={styles.quantityInput}
                    />
                    <span className={styles.quantityUnit}>кг</span>
                    <button
                        className={styles.quantityBtn}
                        onClick={() => {
                            const newQty = Math.min(100, quantity + 1);
                            setQuantity(newQty);
                            const priceInfo = getPriceForQuantity(sku, newQty);
                            onQuantityChange(newQty, priceInfo.pricePerKg, priceInfo.total);
                        }}
                        aria-label="Увеличить"
                    >+</button>
                </div>
                <div className={styles.priceInfo}>
                    <span className={styles.pricePerKg}>{pricePerKg.toLocaleString('ru-RU')} ₸/кг</span>
                    <span className={styles.totalPrice}>{total.toLocaleString('ru-RU')} ₸</span>
                </div>
            </div>
        </div>
    );
}
