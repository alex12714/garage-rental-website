'use client';

import { useEffect } from 'react';
import '../lib/i18n';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import GarageDetails from '@/components/GarageDetails';
import LocationSwitcher from '@/components/LocationSwitcher';
import PricingSlider from '@/components/PricingSlider';
import BookingCalendarNew from '@/components/BookingCalendarNew';
import LocationMap from '@/components/LocationMap';
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
      <Hero />
      <HowItWorks />
      <Benefits />
      <GarageDetails />
      <LocationSwitcher />
      <PricingSlider />
      <BookingCalendarNew />
      <LocationMap />
      <Testimonials />
      <Trust />
      <FAQ />
      <Footer />
    </main>
  );
}
