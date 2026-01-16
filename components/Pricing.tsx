'use client';

import { useTranslation } from 'react-i18next';
import { pricingOptions } from '@/lib/pricing';

export default function Pricing() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingOptions.map((option) => (
            <div
              key={option.duration}
              className={`relative bg-white border-2 rounded-xl p-6 transition-all hover:shadow-xl ${
                option.popular
                  ? 'border-primary-500 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              {/* Popular Badge */}
              {option.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    POPULAR
                  </span>
                </div>
              )}

              {/* Duration */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {t(`pricing.${option.duration}`)}
                </h3>
                <p className="text-xs text-gray-500">
                  {option.days} {option.days === 1 ? t('pricing.day') : t('pricing.days')}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-primary-600">
                  €{option.price}
                </div>
                {option.pricePerDay && (
                  <p className="text-xs text-gray-500 mt-1">
                    €{option.pricePerDay.toFixed(2)}/{t('pricing.day')}
                  </p>
                )}
              </div>

              {/* Best Value for longer durations */}
              {option.days >= 7 && (
                <div className="text-center">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {t('pricing.bestValue')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Custom Pricing Note */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🕒 {t('pricing.custom')}
            </h3>
            <p className="text-gray-600 mb-2">
              {t('pricing.customDescription')}
            </p>
            <p className="text-sm text-gray-500 italic">
              {t('pricing.vat')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
