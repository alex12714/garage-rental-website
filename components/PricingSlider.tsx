'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pricingOptions } from '@/lib/pricing';

export default function PricingSlider() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(1); // Start with second option (popular)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % pricingOptions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + pricingOptions.length) % pricingOptions.length);
  };

  const currentOption = pricingOptions[currentIndex];
  const prevOption = pricingOptions[(currentIndex - 1 + pricingOptions.length) % pricingOptions.length];
  const nextOption = pricingOptions[(currentIndex + 1) % pricingOptions.length];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 -ml-4 sm:-ml-6"
            aria-label="Previous pricing option"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 -mr-4 sm:-mr-6"
            aria-label="Next pricing option"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slider Cards */}
          <div className="flex items-center justify-center gap-4 px-12">
            {/* Previous Card (small preview) */}
            <div className="hidden md:block w-1/4 opacity-40 transform scale-75">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
                <h3 className="text-sm font-bold text-gray-700 mb-2">
                  {t(`pricing.${prevOption.duration}`)}
                </h3>
                <div className="text-2xl font-bold text-primary-600">
                  €{prevOption.price}
                </div>
              </div>
            </div>

            {/* Current Card (large, featured) */}
            <div className="w-full md:w-1/2 transform transition-all duration-300">
              <div
                className={`relative bg-white border-2 rounded-2xl p-8 shadow-2xl ${
                  currentOption.popular
                    ? 'border-primary-500 ring-4 ring-primary-100'
                    : 'border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {currentOption.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ {t('pricing.mostPopular')}
                    </span>
                  </div>
                )}

                {/* Duration */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t(`pricing.${currentOption.duration}`)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {currentOption.hours} {t('pricing.hours')}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-primary-600 mb-2">
                    €{currentOption.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    €{(currentOption.price / currentOption.hours).toFixed(2)}/hour
                  </div>
                </div>

                {/* Savings */}
                {currentOption.savings && (
                  <div className="text-center mb-6">
                    <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-base font-semibold">
                      💰 {t('pricing.save', { amount: currentOption.savings })}
                    </span>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('pricing.heatedSpace')}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('pricing.electricityIncluded')}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('pricing.secureAccess')}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('pricing.access24x7')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Card (small preview) */}
            <div className="hidden md:block w-1/4 opacity-40 transform scale-75">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
                <h3 className="text-sm font-bold text-gray-700 mb-2">
                  {t(`pricing.${nextOption.duration}`)}
                </h3>
                <div className="text-2xl font-bold text-primary-600">
                  €{nextOption.price}
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {pricingOptions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary-600'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
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
