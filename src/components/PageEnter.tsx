'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function PageEnter({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div key={pathname} className="pageEnter">
            {children}
        </div>
    );
}



