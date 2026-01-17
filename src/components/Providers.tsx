// src/components/Providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SettingsProvider } from '@/context/SettingsContext';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <SettingsProvider>
                {children}
            </SettingsProvider>
        </SessionProvider>
    );
}
