'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

function SuccessContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('session_id');
    setSessionId(id);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <span className="text-5xl">✅</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('success.title')}
        </h1>

        {/* Deposit Paid Badge */}
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
          <span className="text-lg">💳</span>
          <span className="font-semibold">{t('success.depositAmount')}</span>
        </div>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-8">
          {t('success.message')}
        </p>

        {/* Booking ID */}
        {sessionId && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">
              {t('success.bookingId')}:
            </p>
            <p className="text-sm font-mono text-gray-900 break-all">
              {sessionId}
            </p>
          </div>
        )}

        {/* Remaining Payment Notice */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 mb-8 text-left">
          <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span>{t('success.remainingPayment')}</span>
          </h3>
          <p className="text-amber-800">
            {t('success.remainingDescription')}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {/* Step 1: Agreement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-left">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <span>{t('success.step1Agreement')}</span>
                </h3>
                <p className="text-blue-800">
                  {t('success.step1Description')}
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Phone Call */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-5 text-left">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">📞</span>
                  <span>{t('success.step2Call')}</span>
                </h3>
                <p className="text-green-800">
                  {t('success.step2Description')}
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Meet at Gate */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-5 text-left">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="font-bold text-primary-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🔑</span>
                  <span>{t('success.step3Meeting')}</span>
                </h3>
                <p className="text-primary-800">
                  {t('success.step3Description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-5 mb-8 text-left">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">ℹ️</span>
            <span>{t('success.importantNote')}</span>
          </h3>
          <p className="text-gray-700">
            {t('success.importantDescription')}
          </p>
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          {t('success.backToHome')}
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
