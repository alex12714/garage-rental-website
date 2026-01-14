'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculatePrice, calculateDuration } from '@/lib/pricing';

export default function BookingCalendarNew() {
  const { t } = useTranslation();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
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

  const calculateBookingPrice = () => {
    if (!selectedDate || !startTime || !endTime) return 0;

    const start = new Date(`${selectedDate}T${startTime}`);
    const end = new Date(`${selectedDate}T${endTime}`);

    if (end <= start) return 0;

    return calculatePrice(start, end);
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
      const price = calculatePrice(start, end);

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
    <section id="booking" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('booking.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('booking.subtitle')}
          </p>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
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
    </section>
  );
}
