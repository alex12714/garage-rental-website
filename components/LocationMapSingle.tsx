'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@googlemaps/js-api-loader';
import { Location } from '@/lib/locations';

interface LocationMapSingleProps {
  location: Location;
}

export default function LocationMapSingle({ location }: LocationMapSingleProps) {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const initMap = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      // Skip map initialization if no API key
      if (!apiKey) {
        console.warn('Google Maps API key not configured');
        return;
      }

      const loader = new Loader({
        apiKey,
        version: 'weekly',
      });

      const { Map } = await loader.importLibrary('maps');
      const { AdvancedMarkerElement } = await loader.importLibrary('marker');

      if (mapRef.current) {
        // Create map if it doesn't exist
        if (!mapInstanceRef.current) {
          const map = new Map(mapRef.current, {
            center: location.coordinates,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            mapId: `GARAGE_${location.id.toUpperCase()}_MAP`,
          });

          mapInstanceRef.current = map;

          // Create marker
          markerRef.current = new AdvancedMarkerElement({
            position: location.coordinates,
            map,
            title: location.name,
          });
        } else {
          // Update existing map center and marker position
          mapInstanceRef.current.setCenter(location.coordinates);

          if (markerRef.current) {
            markerRef.current.position = location.coordinates;
          }
        }
      }
    };

    initMap();
  }, [location]);

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="h-96 bg-gray-200 rounded-xl overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Location Details */}
      <div className="p-6 space-y-4">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="text-2xl">📍</div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-1">{t('location.address')}</h4>
            <p className="text-gray-700">{location.address}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                location.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-primary-600 font-medium hover:text-primary-700"
            >
              {t('location.directions')} →
            </a>
          </div>
        </div>

        {/* Access Instructions */}
        <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl">🔑</div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-1">{t('location.accessTitle')}</h4>
            <p className="text-gray-600">{t('location.accessDescription')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
