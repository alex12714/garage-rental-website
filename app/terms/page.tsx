'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import '../../lib/i18n';

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 mb-4"
          >
            ← {t('terms.backToHome')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('terms.title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('terms.lastUpdated')}: January 14, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">

          {/* Section 1: Booking & Payment */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. {t('terms.section1.title')}
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>{t('terms.section1.p1')}</p>
              <p>{t('terms.section1.p2')}</p>
              <p>{t('terms.section1.p3')}</p>
            </div>
          </section>

          {/* Section 2: Cancellation & Refund Policy */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. {t('terms.section2.title')}
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="font-semibold text-yellow-800">
                {t('terms.section2.important')}
              </p>
            </div>
            <div className="space-y-3 text-gray-700">
              <p className="font-medium">{t('terms.section2.p1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>{t('terms.section2.fullRefund')}</strong> {t('terms.section2.fullRefundText')}</li>
                <li><strong>{t('terms.section2.noRefund')}</strong> {t('terms.section2.noRefundText')}</li>
              </ul>
              <p>{t('terms.section2.p2')}</p>
            </div>
          </section>

          {/* Section 3: Access & Notifications */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. {t('terms.section3.title')}
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>{t('terms.section3.p1')}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  📱 {t('terms.section3.smsTitle')}
                </h3>
                <p className="text-blue-800">{t('terms.section3.smsText')}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  🎥 {t('terms.section3.videoTitle')}
                </h3>
                <p className="text-green-800">{t('terms.section3.videoText')}</p>
              </div>
              <p>{t('terms.section3.p2')}</p>
            </div>
          </section>

          {/* Section 4: Usage Rules */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. {t('terms.section4.title')}
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>{t('terms.section4.intro')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.section4.rule1')}</li>
                <li>{t('terms.section4.rule2')}</li>
                <li>{t('terms.section4.rule3')}</li>
                <li>{t('terms.section4.rule4')}</li>
                <li>{t('terms.section4.rule5')}</li>
                <li>{t('terms.section4.rule6')}</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Liability */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. {t('terms.section5.title')}
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>{t('terms.section5.p1')}</p>
              <p>{t('terms.section5.p2')}</p>
              <p>{t('terms.section5.p3')}</p>
            </div>
          </section>

          {/* Section 6: Duration & Extension */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. {t('terms.section6.title')}
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>{t('terms.section6.p1')}</p>
              <p>{t('terms.section6.p2')}</p>
            </div>
          </section>

          {/* Section 7: Contact */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. {t('terms.section7.title')}
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>{t('terms.section7.email')}:</strong> info@garagerental.lv</p>
              <p><strong>{t('terms.section7.phone')}:</strong> +371 2000 0000</p>
            </div>
          </section>

          {/* Agreement Notice */}
          <div className="border-t pt-8">
            <div className="bg-gray-100 rounded-lg p-6">
              <p className="text-gray-700 text-center">
                {t('terms.agreement')}
              </p>
            </div>
          </div>

        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            {t('terms.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
