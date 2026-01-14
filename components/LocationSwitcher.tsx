'use client';

import { useState } from 'react';
import { locations, Location } from '@/lib/locations';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface LocationSwitcherProps {
  onLocationChange?: (location: Location) => void;
}

export default function LocationSwitcher({ onLocationChange }: LocationSwitcherProps) {
  const { i18n } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location);
    setIsVideoPlaying(false);
    onLocationChange?.(location);
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Location Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-gray-50">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationChange(location)}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${
                  selectedLocation.id === location.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i18n.language === 'en' ? location.nameEn : location.name}
              </button>
            ))}
          </div>
        </div>

        {/* Location Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Media Section */}
          <div className="relative">
            {!isVideoPlaying ? (
              <div className="relative h-96 rounded-xl overflow-hidden shadow-xl group cursor-pointer" onClick={handlePlayVideo}>
                <Image
                  src={selectedLocation.image}
                  alt={`${selectedLocation.name} garage`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">🎥 Watch Video Tour</p>
                </div>
              </div>
            ) : (
              <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
                <video
                  src={selectedLocation.video}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                  onEnded={() => setIsVideoPlaying(false)}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedLocation.name}
              </h3>
              <p className="text-lg text-gray-600 flex items-center gap-2">
                📍 {selectedLocation.address}
              </p>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-1">📏</div>
                <div className="text-sm text-gray-600">Size</div>
                <div className="font-semibold text-gray-900">{selectedLocation.specs.size}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-1">🚪</div>
                <div className="text-sm text-gray-600">Gate Height</div>
                <div className="font-semibold text-gray-900">{selectedLocation.specs.gateHeight}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-sm text-gray-600">Electricity</div>
                <div className="font-semibold text-gray-900">{selectedLocation.specs.electricity}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-1">🌡️</div>
                <div className="text-sm text-gray-600">Heating</div>
                <div className="font-semibold text-gray-900">
                  {selectedLocation.specs.heated ? 'Yes, heated' : 'No heating'}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl border border-primary-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Starting from</div>
                  <div className="text-3xl font-bold text-primary-600">€25/hour</div>
                </div>
                <div className="text-5xl">🚗</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
