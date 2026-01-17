'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'RETAIL' | 'WHOLESALE';

export interface Company {
    id: string;
    name: string;
    bin: string; // БИН/ИИН
    legalAddress: string;
    deliveryAddress: string;
    contactPerson: string;
    contactPhone: string;
    isDefault: boolean;
}

export interface OnboardingData {
    businessType: string;
    orderVolume: string;
    source: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    type: UserType;
    isOnboardingComplete: boolean;
    onboardingData?: OnboardingData;
    companies: Company[];
    // Legacy B2B fields (for backward compatibility)
    company?: {
        name: string;
        inn: string;
        kpp: string;
        legalAddress: string;
        actualAddress: string;
    };
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isAuthModalOpen: boolean;
    isOnboardingOpen: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    completeOnboarding: (data: OnboardingData) => void;
    skipOnboarding: () => void;
    // Companies management
    addCompany: (company: Omit<Company, 'id'>) => void;
    updateCompany: (id: string, company: Partial<Company>) => void;
    deleteCompany: (id: string) => void;
    setDefaultCompany: (id: string) => void;
    getDefaultCompany: () => Company | undefined;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone: string;
    type: UserType;
    company?: {
        name: string;
        inn: string;
        kpp: string;
        legalAddress: string;
    };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo
const MOCK_USER: User = {
    id: 'user-001',
    email: 'demo@freshcoffee.kz',
    name: 'Алексей Иванов',
    phone: '+7 (777) 123-45-67',
    type: 'WHOLESALE',
    isOnboardingComplete: false,
    companies: [],
    company: {
        name: 'ТОО "Кофейный Дом"',
        inn: '123456789012',
        kpp: '770101001',
        legalAddress: 'г. Алматы, ул. Абая 150, офис 12',
        actualAddress: 'г. Алматы, ул. Абая 150, офис 12',
    },
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

    // Load auth state from localStorage on mount
    useEffect(() => {
        const savedAuth = localStorage.getItem('freshcoffee_auth');
        if (savedAuth) {
            try {
                const parsed = JSON.parse(savedAuth);
                setUser(parsed.user);
            } catch (e) {
                console.error('Failed to parse auth from localStorage', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save auth state to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            if (user) {
                localStorage.setItem('freshcoffee_auth', JSON.stringify({ user }));
            } else {
                localStorage.removeItem('freshcoffee_auth');
            }
        }
    }, [user, isLoaded]);

    // Show onboarding for new users
    useEffect(() => {
        if (user && !user.isOnboardingComplete && user.type === 'WHOLESALE') {
            setIsOnboardingOpen(true);
        }
    }, [user]);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            // Dynamic import to avoid SSR issues
            const { signIn } = await import('next-auth/react');

            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                return { success: false, error: result.error };
            }

            if (result?.ok) {
                // Fetch user session
                const { getSession } = await import('next-auth/react');
                const session = await getSession();

                if (session?.user) {
                    const userData: User = {
                        id: session.user.id || '',
                        email: session.user.email || '',
                        name: session.user.name || '',
                        phone: '',
                        type: (session.user.type as UserType) || 'RETAIL',
                        isOnboardingComplete: true,
                        companies: [],
                    };
                    setUser(userData);
                    setIsAuthModalOpen(false);
                    return { success: true };
                }
            }

            return { success: false, error: 'Ошибка входа' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Ошибка сервера' };
        }
    };

    const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        // Registration is done via WhatsApp, not directly
        return { success: false, error: 'Регистрация через WhatsApp' };
    };

    const logout = () => {
        setUser(null);
        setIsOnboardingOpen(false);
    };

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const completeOnboarding = (data: OnboardingData) => {
        if (user) {
            setUser({
                ...user,
                isOnboardingComplete: true,
                onboardingData: data,
            });
        }
        setIsOnboardingOpen(false);
    };

    const skipOnboarding = () => {
        if (user) {
            setUser({
                ...user,
                isOnboardingComplete: true,
            });
        }
        setIsOnboardingOpen(false);
    };

    // Companies management
    const addCompany = (company: Omit<Company, 'id'>) => {
        if (!user) return;
        const newCompany: Company = {
            ...company,
            id: 'company-' + Date.now(),
        };
        const updatedCompanies = [...user.companies, newCompany];
        // If this is the first company, make it default
        if (updatedCompanies.length === 1) {
            newCompany.isDefault = true;
        }
        setUser({ ...user, companies: updatedCompanies });
    };

    const updateCompany = (id: string, updates: Partial<Company>) => {
        if (!user) return;
        const updatedCompanies = user.companies.map(c =>
            c.id === id ? { ...c, ...updates } : c
        );
        setUser({ ...user, companies: updatedCompanies });
    };

    const deleteCompany = (id: string) => {
        if (!user) return;
        const updatedCompanies = user.companies.filter(c => c.id !== id);
        // If deleted company was default, set first remaining as default
        if (updatedCompanies.length > 0 && !updatedCompanies.some(c => c.isDefault)) {
            updatedCompanies[0].isDefault = true;
        }
        setUser({ ...user, companies: updatedCompanies });
    };

    const setDefaultCompany = (id: string) => {
        if (!user) return;
        const updatedCompanies = user.companies.map(c => ({
            ...c,
            isDefault: c.id === id,
        }));
        setUser({ ...user, companies: updatedCompanies });
    };

    const getDefaultCompany = () => {
        return user?.companies.find(c => c.isDefault);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                isAuthModalOpen,
                isOnboardingOpen,
                login,
                register,
                logout,
                openAuthModal,
                closeAuthModal,
                completeOnboarding,
                skipOnboarding,
                addCompany,
                updateCompany,
                deleteCompany,
                setDefaultCompany,
                getDefaultCompany,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
