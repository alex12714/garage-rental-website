'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { locations, Location } from '@/lib/locations';
import { calculatePrice, calculateDuration } from '@/lib/pricing';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import map component to avoid SSR issues
const LocationMapSingle = dynamic(() => import('./LocationMapSingle'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />,
});

export default function IntegratedBooking() {
  const { t, i18n } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Get tomorrow's date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [selectedDate, setSelectedDate] = useState(getTomorrowDate());
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate top-of-hour options (00:00 to 23:00)
  const generateHourOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      options.push(`${hour}:00`);
    }
    return options;
  };

  const hourOptions = generateHourOptions();

  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location);
    setIsVideoPlaying(false);
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const calculateBookingPrice = () => {
    if (!selectedDate || !startTime || !endTime) return 0;

    const start = new Date(`${selectedDate}T${startTime}`);
    const end = new Date(`${selectedDate}T${endTime}`);

    if (end <= start) return 0;

    return calculatePrice(start, end, selectedLocation.id);
  };

  const calculateBookingDuration = () => {
    if (!selectedDate || !startTime || !endTime) return null;

    const start = new Date(`${selectedDate}T${startTime}`);
    const end = new Date(`${selectedDate}T${endTime}`);

    if (end <= start) return null;

    return calculateDuration(start, end);
  };

  const handleBooking = async () => {
    // Validation
    if (!selectedDate || !startTime || !endTime) {
      alert(t('booking.errors.selectTime'));
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      alert(t('booking.errors.fillRequired'));
      return;
    }

    if (!agreeToTerms) {
      alert(t('booking.errors.agreeTerms'));
      return;
    }

    const start = new Date(`${selectedDate}T${startTime}`);
    const end = new Date(`${selectedDate}T${endTime}`);

    if (end <= start) {
      alert(t('booking.errors.invalidTime'));
      return;
    }

    setIsProcessing(true);

    try {
      const price = calculatePrice(start, end, selectedLocation.id);

      // Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          customerName,
          customerEmail,
          customerPhone,
          specialRequests,
          amount: price,
          locationId: selectedLocation.id,
          locationName: i18n.language === 'en' ? selectedLocation.nameEn : selectedLocation.name,
          language: localStorage.getItem('i18nextLng') || 'en',
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert(error);
        return;
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(t('error.message'));
    } finally {
      setIsProcessing(false);
    }
  };

  const price = calculateBookingPrice();
  const duration = calculateBookingDuration();

  return (
    <section
      id="booking"
      className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 min-h-[600px]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fadeIn drop-shadow-lg">
            {t('booking.title')}
          </h1>
          <p className="text-xl text-white/90 mb-4 drop-shadow-md">{t('booking.subtitle')}</p>
          <div className="flex justify-center gap-4 flex-wrap text-white/80 text-sm">
            <span>⚡ {t('hero.features.electricity')}</span>
            <span>🌡️ {t('hero.features.heated')}</span>
            <span>🔒 {t('hero.features.secure')}</span>
            <span>💳 {t('hero.features.payment')}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Location Selection */}
          <div className="space-y-6">
            {/* Location Tabs */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📍 {t('booking.selectLocation')}
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationChange(location)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedLocation.id === location.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {i18n.language === 'en' ? location.nameEn : location.name}
                    {location.id === 'pinki' && (
                      <span className="ml-2 text-xs">⭐ Premium</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Video/Image Preview */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {!isVideoPlaying ? (
                <div
                  className="relative h-64 bg-gray-200 cursor-pointer group"
                  onClick={handlePlayVideo}
                >
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
                      <svg
                        className="w-10 h-10 text-primary-600 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900">
                      🎥 {t('location.watchVideo')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative h-64">
                  <video
                    src={selectedLocation.video}
                    poster={selectedLocation.image}
                    controls
                    autoPlay
                    playsInline
                    muted
                    preload="auto"
                    className="w-full h-full object-cover"
                    onEnded={() => setIsVideoPlaying(false)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>

            {/* Photo Gallery */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  📸 {t('location.photoGallery')}
                </h3>
              </div>
              <div className="relative h-80">
                <Image
                  src={selectedLocation.image}
                  alt={`${selectedLocation.name} garage photo`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Location Specifications & Features */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('location.specifications')}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-1">📏</div>
                  <div className="text-sm text-gray-600">{t('garageDetails.size')}</div>
                  <div className="font-semibold text-gray-900">
                    {selectedLocation.specs.size}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🚪</div>
                  <div className="text-sm text-gray-600">{t('garageDetails.gateHeight')}</div>
                  <div className="font-semibold text-gray-900">
                    {selectedLocation.specs.gateHeight}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-sm text-gray-600">{t('garageDetails.electricity')}</div>
                  <div className="font-semibold text-gray-900">
                    {selectedLocation.specs.electricity}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🌡️</div>
                  <div className="text-sm text-gray-600">{t('garageDetails.heating')}</div>
                  <div className="font-semibold text-gray-900">
                    {selectedLocation.specs.heated ? t('location.heatedYes') : t('location.heatedNo')}
                  </div>
                </div>
              </div>

              {/* Additional Features */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">{t('location.includedFeatures')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('location.feature24x7')}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('location.featureSecureCode')}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('location.featureOnlinePayment')}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('location.featureInstantBooking')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <LocationMapSingle location={selectedLocation} />
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {t('booking.bookNow')}
            </h3>

            <div className="space-y-6">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 {t('booking.selectDate')} *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
                />
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🕐 {t('booking.startTime')} *
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
                  >
                    <option value="">Select time</option>
                    {hourOptions.map((hour) => (
                      <option key={`start-${hour}`} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🕐 {t('booking.endTime')} *
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
                  >
                    <option value="">Select time</option>
                    {hourOptions.map((hour) => (
                      <option key={`end-${hour}`} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration & Price Display */}
              {duration && price > 0 && (
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-semibold text-lg">
                      ⏱️ {t('booking.duration')}:
                    </span>
                    <span className="text-gray-900 font-bold text-lg">
                      {duration.displayText}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-primary-200">
                    <span className="text-gray-700 font-semibold text-lg">
                      💰 {t('booking.totalPrice')}:
                    </span>
                    <span className="text-3xl text-primary-600 font-bold">
                      €{price}
                    </span>
                  </div>
                  {selectedLocation.id === 'pinki' && (
                    <div className="mt-3 pt-3 border-t border-primary-200">
                      <p className="text-sm text-gray-600 italic">
                        ⭐ {t('booking.premiumPricing')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Information */}
              <div className="pt-6 border-t-2 border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  👤 {t('booking.contactInfo')}
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('booking.name')} *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('booking.email')} *
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('booking.phone')} *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+371 20000000"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('booking.specialRequests')}
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      placeholder="Any special requirements?"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="pt-6 border-t-2 border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {t('booking.termsAgreement')}{' '}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline font-semibold"
                    >
                      {t('booking.termsLink')}
                    </a>
                    {' *'}
                  </span>
                </label>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={isProcessing || !price || !agreeToTerms}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-5 rounded-xl text-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl"
              >
                {isProcessing
                  ? t('booking.processing')
                  : t('booking.bookAndPay', { price: price || 0 })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
