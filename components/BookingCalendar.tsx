'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculatePrice, calculateDuration } from '@/lib/pricing';

export default function BookingCalendar() {
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('booking.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('booking.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Calendar Embed */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              📅 {t('booking.calendarTitle')}
            </h3>
            <div className="relative">
              <iframe
                src="https://api.leadconnectorhq.com/widget/booking/gr4HovtFVrqmDY65IULM"
                style={{ width: '100%', border: 'none', overflow: 'hidden' }}
                scrolling="no"
                id="gr4HovtFVrqmDY65IULM_1768386280323"
              />
              <script
                src="https://api.leadconnectorhq.com/js/form_embed.js"
                type="text/javascript"
              />
            </div>
          </div>

          {/* Custom Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              🕒 {t('booking.customBooking')}
            </h3>

            <div className="space-y-4">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.selectDate')} *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.startTime')} *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.endTime')} *
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Duration & Price Display */}
              {duration && price > 0 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">
                      {t('booking.duration')}:
                    </span>
                    <span className="text-gray-900 font-bold">
                      {duration.displayText}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      {t('booking.totalPrice')}:
                    </span>
                    <span className="text-2xl text-primary-600 font-bold">
                      €{price}
                    </span>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('booking.contactInfo')}
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('booking.name')} *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('booking.email')} *
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('booking.phone')} *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+371 20000000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('booking.specialRequests')}
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="pt-4 border-t border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    {t('booking.termsAgreement')}{' '}
                    <a
                      href="/terms"
                      target="_blank"
                      className="text-primary-600 hover:text-primary-700 underline font-medium"
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
                className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
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
