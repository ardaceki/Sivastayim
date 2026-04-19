import { Locale } from "@/dictionaries/dictionaries";
import PortraitsGallery from "@/features/portraits/PortraitsGallery";

export default async function PortraitsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const unwrappedParams = await params;
  const lang = (unwrappedParams.lang as Locale) || "tr";

  return (
    <main className="w-full min-h-screen">
      <PortraitsGallery currentLang={lang} />
    </main>
  );
}
