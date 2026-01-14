'use client';

import { useEffect } from 'react';
import '../lib/i18n';
import Navigation from '@/components/Navigation';
import IntegratedBooking from '@/components/IntegratedBooking';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import PricingSlider from '@/components/PricingSlider';
import Testimonials from '@/components/Testimonials';
import Trust from '@/components/Trust';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  useEffect(() => {
    // Initialize i18n language from localStorage or browser
    const savedLang = localStorage.getItem('i18nextLng');
    if (!savedLang) {
      const browserLang = navigator.language.split('-')[0];
      if (['lv', 'en', 'ru'].includes(browserLang)) {
        localStorage.setItem('i18nextLng', browserLang);
      } else {
        localStorage.setItem('i18nextLng', 'lv');
      }
    }
  }, []);

  return (
    <main className="min-h-screen">
      <Navigation />
      <IntegratedBooking />
      <HowItWorks />
      <Benefits />
      <PricingSlider />
      <Testimonials />
      <Trust />
      <FAQ />
      <Footer />
    </main>
  );
}
