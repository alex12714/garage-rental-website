'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@googlemaps/js-api-loader';

export default function LocationMap() {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
      });

      const { Map } = await loader.importLibrary('maps');
      const { Marker } = await loader.importLibrary('marker');

      if (mapRef.current && !mapInstanceRef.current) {
        // Coordinates for Krustpils 31, Plavnieki, Riga
        const position = { lat: 56.9386, lng: 24.1696 };

        const map = new Map(mapRef.current, {
          center: position,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
        });

        new Marker({
          position,
          map,
          title: 'Garage Location',
        });

        mapInstanceRef.current = map;
      }
    };

    initMap();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('location.title')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Map */}
          <div className="h-96 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
            <div ref={mapRef} className="w-full h-full" />
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            {/* Address */}
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="text-3xl">📍</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t('location.address')}
                  </h3>
                  <p className="text-gray-700">
                    {t('location.addressValue')}
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Krustpils+31+Plavnieki+Riga+Latvia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-primary-600 font-medium hover:text-primary-700"
                  >
                    {t('location.directions')} →
                  </a>
                </div>
              </div>
            </div>

            {/* Access Instructions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🔑</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t('location.accessTitle')}
                  </h3>
                  <p className="text-gray-600">
                    {t('location.accessDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
