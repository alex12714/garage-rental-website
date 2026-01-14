'use client';

import { useTranslation } from 'react-i18next';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { number: 1, key: 'step1', icon: '📅' },
    { number: 2, key: 'step2', icon: '✍️' },
    { number: 3, key: 'step3', icon: '✅' },
  ];

  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.key} className="relative">
              <div className="text-center">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full text-2xl font-bold mb-4">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t(`howItWorks.${step.key}.title`)}
                </h3>

                {/* Description */}
                <p className="text-gray-600">
                  {t(`howItWorks.${step.key}.description`)}
                </p>
              </div>

              {/* Connector Arrow (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full">
                  <svg
                    className="w-full h-8 text-primary-200"
                    fill="none"
                    viewBox="0 0 100 20"
                  >
                    <path
                      d="M0 10 L80 10 L75 5 M80 10 L75 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 text-center">
          <p className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            ✨ {t('howItWorks.note')}
          </p>
        </div>

        {/* Book Now Button */}
        <div className="mt-12 text-center">
          <button
            onClick={scrollToBooking}
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            {t('hero.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}
