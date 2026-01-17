import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import CartSidebar from "@/components/CartSidebar";
import AuthModal from "@/components/AuthModal";
import BackToTop from "@/components/BackToTop";
import OnboardingWrapper from "@/components/OnboardingWrapper";
import PageEnter from "@/components/PageEnter";
import RevealObserver from "@/components/RevealObserver";
import Providers from "@/components/Providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { YandexMetrika } from "@/components/YandexMetrika";
import DemoBanner from "@/components/DemoBanner";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freshcoffee.kz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fresh Coffee — Свежеобжаренный кофе с доставкой по Казахстану",
    template: "%s | Fresh Coffee",
  },
  description: "Обжариваем и отправляем в день заказа. Арабика и эспрессо-смеси от 9 765 ₸/кг. Бесплатная доставка в 30+ городов через Teez.",
  keywords: [
    "кофе", "свежий кофе", "обжарка", "арабика", "эспрессо", "робуста",
    "купить кофе", "кофе Алматы", "кофе Астана", "кофе Казахстан",
    "зерновой кофе", "молотый кофе", "coffee", "fresh coffee",
    "кофе оптом", "кофе для бизнеса", "вендинг кофе"
  ],
  authors: [{ name: "Fresh Coffee KZ" }],
  creator: "Fresh Coffee",
  publisher: "Fresh Coffee",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_KZ",
    url: siteUrl,
    siteName: "Fresh Coffee",
    title: "Fresh Coffee — Свежеобжаренный кофе с доставкой",
    description: "Обжариваем и отправляем в день заказа. Арабика и эспрессо-смеси от 9 765 ₸/кг.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fresh Coffee — Свежий кофе",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fresh Coffee — Свежеобжаренный кофе",
    description: "Обжариваем и отправляем в день заказа. Доставка по всему Казахстану.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code', // Add after verification
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className} suppressHydrationWarning={true}>
        <GoogleAnalytics />
        <Providers>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <Header />
                <CartSidebar />
                <AuthModal />
                <OnboardingWrapper />
                <RevealObserver />
                <main style={{ minHeight: 'calc(100vh - 200px)' }}>
                  <PageEnter>
                    {children}
                  </PageEnter>
                </main>
                <Footer />
                <BackToTop />
                <DemoBanner />
                <YandexMetrika />
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

