import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Garage Rental Riga | Hourly Garage Rental in Plavnieki',
  description: 'Rent a secure, heated garage with electricity by the hour in Riga, Latvia. Simple online booking with Stripe payment.',
  keywords: 'garage rental, Riga, Latvia, hourly rental, car garage, Plavnieki, auto repair space',
  openGraph: {
    title: 'Garage Rental Riga | Hourly Garage Rental',
    description: 'Rent a secure, heated garage with electricity by the hour. Simple online booking.',
    type: 'website',
    locale: 'lv_LV',
    alternateLocale: ['en_US', 'ru_RU'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lv">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
