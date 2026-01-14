'use client';

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              🚗 {t('footer.company')}
            </h3>
            <p className="text-gray-400">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {t('footer.contact')}
            </h3>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center gap-2">
                <span>📧</span>
                <a
                  href={`mailto:${t('footer.email')}`}
                  className="hover:text-white transition-colors"
                >
                  {t('footer.email')}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span>
                <a
                  href={`tel:${t('footer.phone')}`}
                  className="hover:text-white transition-colors"
                >
                  {t('footer.phone')}
                </a>
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.language')}</h3>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <a href="/terms" className="hover:text-white transition-colors">
                {t('footer.terms')}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {t('footer.privacy')}
              </a>
            </div>
            <div className="text-sm text-gray-400">
              © 2026 {t('footer.company')}. {t('footer.rights')}.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
