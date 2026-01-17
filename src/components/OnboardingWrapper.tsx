'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import OnboardingModal from './OnboardingModal';

export default function OnboardingWrapper() {
    const { isOnboardingOpen, completeOnboarding } = useAuth();

    return (
        <OnboardingModal
            isOpen={isOnboardingOpen}
            onComplete={completeOnboarding}
        />
    );
}
