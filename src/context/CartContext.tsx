'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { calculatePrice } from '@/lib/pricing';

export interface CartItem {
    sku: string;
    name: string;
    slug: string;
    quantity: number; // in kg
    pricePerKg: number;
    total: number;
    image: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (sku: string) => void;
    updateQuantity: (sku: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemCount: () => number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'freshcoffee_cart';

function readCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!savedCart) return [];
        const parsed = JSON.parse(savedCart);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error('Failed to read cart from localStorage', e);
        return [];
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => readCartFromStorage());
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save cart to localStorage on change
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error('Failed to write cart to localStorage', e);
        }
    }, [items]);

    const addToCart = (item: CartItem) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((i) => i.sku === item.sku);
            if (existingIndex > -1) {
                // Add to existing item quantity
                const updated = [...prev];
                const existingItem = updated[existingIndex];
                const newQuantity = existingItem.quantity + item.quantity;
                const newPricePerKg = calculatePrice(item.sku, newQuantity);
                updated[existingIndex] = {
                    ...existingItem,
                    quantity: newQuantity,
                    pricePerKg: newPricePerKg,
                    total: newQuantity * newPricePerKg,
                };
                return updated;
            }
            // Add new item
            return [...prev, item];
        });
        setIsCartOpen(true); // Open cart when item is added
    };

    const removeFromCart = (sku: string) => {
        setItems((prev) => prev.filter((i) => i.sku !== sku));
    };

    const updateQuantity = (sku: string, quantity: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.sku === sku
                    ? (() => {
                        const nextQty = Math.max(1, Number.isFinite(quantity) ? quantity : 1);
                        const nextPricePerKg = calculatePrice(item.sku, nextQty);
                        return { ...item, quantity: nextQty, pricePerKg: nextPricePerKg, total: nextQty * nextPricePerKg };
                    })()
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getCartTotal = () => {
        return items.reduce((sum, item) => sum + item.total, 0);
    };

    const getItemCount = () => {
        return items.length;
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getItemCount,
                isCartOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
