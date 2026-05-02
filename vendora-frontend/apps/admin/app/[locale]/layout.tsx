import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import { ColorSchemeScript } from '@mantine/core';
import { MantineProvider, AuthProvider } from '@repo/ui';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../src/i18n/routing';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: 'Vendora Admin | Marketplace Management',
  description: 'Manage your multi-vendor marketplace with ease.',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'en' ? 'ltr' : 'rtl'} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={`${inter.variable} ${cairo.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <MantineProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
