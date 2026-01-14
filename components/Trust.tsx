'use client';

import { useTranslation } from 'react-i18next';

export default function Trust() {
  const { t } = useTranslation();

  const features = [
    { key: 'secure', icon: '🔒' },
    { key: 'noFees', icon: '💰' },
    { key: 'cancellation', icon: '📅' },
    { key: 'support', icon: '📞' },
    { key: 'professional', icon: '⭐' },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('trust.title')}
          </h2>
        </div>

        {/* Trust Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="text-center p-6 bg-gradient-to-br from-primary-50 to-white rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <p className="font-medium text-gray-900">
                {t(`trust.${feature.key}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
