import { Locale } from "@/dictionaries/dictionaries";
import DishesGallery from "@/features/dishes/DishesGallery";

export default async function DishesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const unwrappedParams = await params;
  const lang = (unwrappedParams.lang as Locale) || "tr";

  return (
    <main className="w-full min-h-screen">
      <DishesGallery currentLang={lang} />
    </main>
  );
}
