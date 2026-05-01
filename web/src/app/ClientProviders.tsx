'use client';

import AppHeader from '@/modules/layout/components/AppHeader';
import Footer from '@/modules/layout/components/Footer';
import BackToTop from '@/shared/components/BackToTop';
import FloatingAd from '@/components/FloatingAd';
import MobileBottomNav from '@/modules/layout/components/MobileBottomNav';
import ActivityBarrage from '@/components/ActivityBarrage';
import SEOStructuredData from '@/components/SEOStructuredData';
import { I18nProvider } from '@/components/I18nProvider';
import ToastProvider from '@/shared/components/ToastProvider';
import ErrorBoundary from '@/shared/components/ErrorBoundary';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ErrorBoundary>
        <ToastProvider>
          <SEOStructuredData />
          <AppHeader />
          <main className="flex-1 pb-20 sm:pb-0">{children}</main>
          <Footer />
          <BackToTop />
          <FloatingAd />
          <MobileBottomNav />
          <ActivityBarrage />
        </ToastProvider>
      </ErrorBoundary>
    </I18nProvider>
  );
}
