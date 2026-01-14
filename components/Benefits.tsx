'use client';

import { useTranslation } from 'react-i18next';

export default function Benefits() {
  const { t } = useTranslation();

  const benefits = [
    { key: 'benefit1', icon: '📄', color: 'from-blue-500 to-blue-600' },
    { key: 'benefit2', icon: '⏰', color: 'from-green-500 to-green-600' },
    { key: 'benefit3', icon: '⚡', color: 'from-purple-500 to-purple-600' },
    { key: 'benefit4', icon: '💰', color: 'from-orange-500 to-orange-600' },
    { key: 'benefit5', icon: '🔄', color: 'from-pink-500 to-pink-600' },
    { key: 'benefit6', icon: '✨', color: 'from-cyan-500 to-cyan-600' },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('benefits.title')}
          </h2>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            {t('benefits.subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.key}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105 border border-white/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br ${benefit.color} mb-4 shadow-lg`}>
                <span className="text-3xl">{benefit.icon}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3">
                {t(`benefits.${benefit.key}.title`)}
              </h3>

              {/* Description */}
              <p className="text-primary-100 leading-relaxed">
                {t(`benefits.${benefit.key}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              const element = document.getElementById('booking');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-all transform hover:scale-105 shadow-xl inline-flex items-center gap-2"
          >
            <span>Start Booking Now</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
