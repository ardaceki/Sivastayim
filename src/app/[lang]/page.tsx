import { Hero } from '@/features/hero/Hero';
import { Scrollytelling } from '@/components/Scrollytelling';
import { getDictionary, Locale } from '@/dictionaries/dictionaries';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const unwrappedParams = await params;
  const lang = (unwrappedParams.lang as Locale) || 'tr';
  const dict = await getDictionary(lang);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero dict={dict.hero} currentLang={lang} />
      <Scrollytelling steps={dict.scrollytelling.steps} currentLang={lang} />
    </main>
  );
}
