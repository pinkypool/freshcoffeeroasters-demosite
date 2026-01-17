'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface FavoritesContextType {
    favorites: string[]; // Array of product slugs
    isFavorite: (slug: string) => boolean;
    toggleFavorite: (slug: string) => void;
    addFavorite: (slug: string) => void;
    removeFavorite: (slug: string) => void;
    clearFavorites: () => void;
    favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'freshcoffee_favorites';

function readFavoritesFromStorage(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const saved = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error('Failed to read favorites', e);
        return [];
    }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>(() => readFavoritesFromStorage());

    // Save to localStorage on change
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        } catch (e) {
            console.error('Failed to write favorites', e);
        }
    }, [favorites]);

    const isFavorite = (slug: string) => favorites.includes(slug);

    const toggleFavorite = (slug: string) => {
        if (isFavorite(slug)) {
            removeFavorite(slug);
        } else {
            addFavorite(slug);
        }
    };

    const addFavorite = (slug: string) => {
        if (!isFavorite(slug)) {
            setFavorites((prev) => [...prev, slug]);
        }
    };

    const removeFavorite = (slug: string) => {
        setFavorites((prev) => prev.filter(f => f !== slug));
    };

    const clearFavorites = () => {
        setFavorites([]);
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                isFavorite,
                toggleFavorite,
                addFavorite,
                removeFavorite,
                clearFavorites,
                favoritesCount: favorites.length,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
