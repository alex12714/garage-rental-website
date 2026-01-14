'use client';

import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    { key: 'testimonial1', rating: 5 },
    { key: 'testimonial2', rating: 5 },
    { key: 'testimonial3', rating: 5 },
  ];

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[...Array(rating)].map((_, i) => (
        <span key={i} className="text-yellow-400 text-xl">
          ⭐
        </span>
      ))}
    </div>
  );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.key}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-4 italic">
                "{t(`testimonials.${testimonial.key}.text`)}"
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-gray-200">
                <p className="font-bold text-gray-900">
                  {t(`testimonials.${testimonial.key}.name`)}
                </p>
                <p className="text-sm text-gray-600">
                  {t(`testimonials.${testimonial.key}.role`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
