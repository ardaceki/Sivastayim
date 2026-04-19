import { ThemeProvider } from '@/features/common/ThemeContext';
import { Navbar } from '@/features/common/Navbar';
import { getDictionary, Locale } from '@/dictionaries/dictionaries';
import Chatbot from '@/components/Chatbot';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sivastayım | Keşfet',
  description: 'Sivas şehrinin dijital yüzü',
  verification: {
    google: 'iGw3OsiaHB_9EXmhplfSvhdr730_qXRSVB12DbYlcZE',
  },
};

export async function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const unwrappedParams = await params;
  const lang = (unwrappedParams.lang as Locale) || 'tr';
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {/* Üst menü */}
          <Navbar dict={dict.navbar} currentLang={lang} />

          {/* Sayfa içeriği */}
          {children}

          {/* Chatbot'u buraya, en sona ekledik */}
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}