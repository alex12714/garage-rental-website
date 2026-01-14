'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function GarageDetails() {
  const { t } = useTranslation();

  const specs = [
    { key: 'size', icon: '📏' },
    { key: 'gateHeight', icon: '🚪' },
    { key: 'electricity', icon: '⚡' },
    { key: 'heating', icon: '🌡️' },
    { key: 'location', icon: '📍' },
    { key: 'vehicleSize', icon: '🚗' },
    { key: 'security', icon: '🔒' },
    { key: 'accessHours', icon: '🕐' },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('garageDetails.title')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Photos */}
          <div className="space-y-4">
            <div className="relative h-64 sm:h-80 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/garage-1.png"
                alt="Garage interior - heated space with electricity"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                priority
              />
            </div>
            <div className="relative h-64 sm:h-80 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/garage-2.png"
                alt="Garage exterior - secure access in Plavnieki, Riga"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            {specs.map((spec) => (
              <div
                key={spec.key}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{spec.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t(`garageDetails.${spec.key}`)}
                    </h3>
                    <p className="text-gray-600">
                      {t(`garageDetails.${spec.key}Value`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
