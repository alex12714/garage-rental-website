'use client';

import { useTranslation } from 'react-i18next';

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
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fadeIn">
            {t('hero.title')}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 animate-fadeIn">
            {t('hero.subtitle')}
          </p>

          {/* CTA Button */}
          <button
            onClick={scrollToBooking}
            className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl animate-fadeIn"
          >
            {t('hero.cta')}
          </button>

          {/* Features Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.key}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <p className="text-sm sm:text-base font-medium text-gray-700">
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
