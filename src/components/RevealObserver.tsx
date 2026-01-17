'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RevealObserver() {
    const pathname = usePathname();

    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('reveal-ready');

        const viewportH = () => window.innerHeight || document.documentElement.clientHeight;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const el = entry.target as HTMLElement;
                    if (entry.isIntersecting) {
                        el.classList.add('revealVisible');
                        el.dataset.revealObserved = '1';
                        observer.unobserve(el);
                    }
                }
            },
            { threshold: 0.12, rootMargin: '80px 0px -10% 0px' }
        );

        const observeAll = () => {
            const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
            if (els.length === 0) return;

            for (const el of els) {
                // Reset on navigation (new content)
                el.classList.remove('revealVisible');
                el.dataset.revealObserved = '';
            }

            // Immediately show what's already in viewport (avoid "empty page" flash)
            for (const el of els) {
                const r = el.getBoundingClientRect();
                const inView = r.top < viewportH() * 0.92 && r.bottom > 0;
                if (inView) {
                    el.classList.add('revealVisible');
                    el.dataset.revealObserved = '1';
                } else {
                    observer.observe(el);
                }
            }
        };

        // Initial pass for this route
        const raf = window.requestAnimationFrame(() => observeAll());

        // Observe reveals that appear later (e.g. async render, route change, etc.)
        const mo = new MutationObserver(() => {
            const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
            for (const el of els) {
                if (el.dataset.revealObserved === '1') continue;
                const r = el.getBoundingClientRect();
                const inView = r.top < viewportH() * 0.92 && r.bottom > 0;
                if (inView) {
                    el.classList.add('revealVisible');
                    el.dataset.revealObserved = '1';
                } else {
                    observer.observe(el);
                }
            }
        });

        mo.observe(document.body, { childList: true, subtree: true });

        // Fail-safe: if something went wrong, don't keep page hidden
        const failSafe = window.setTimeout(() => {
            const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
            for (const el of els) el.classList.add('revealVisible');
        }, 350);

        return () => {
            window.cancelAnimationFrame(raf);
            window.clearTimeout(failSafe);
            mo.disconnect();
            observer.disconnect();
        };
    }, [pathname]);

    return null;
}


