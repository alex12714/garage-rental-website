'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function Hero() {
  const { t } = useTranslation();

  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { icon: '📍', key: 'location' },
    { icon: '💰', key: 'pricing' },
    { icon: '🔒', key: 'secure' },
    { icon: '⚡', key: 'electricity' },
    { icon: '🌡️', key: 'heated' },
    { icon: '💳', key: 'payment' },
  ];

  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/garage-1.png"
          alt="Garage background"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fadeIn drop-shadow-lg">
            {t('hero.title')}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-100 mb-8 animate-fadeIn drop-shadow-md">
            {t('hero.subtitle')}
          </p>

          {/* CTA Button */}
          <button
            onClick={scrollToBooking}
            className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl animate-fadeIn"
          >
            {t('hero.cta')}
          </button>

          {/* Features Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.key}
                className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-xl transition-all hover:bg-white animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <p className="text-sm sm:text-base font-medium text-gray-900">
                  {t(`hero.features.${feature.key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
