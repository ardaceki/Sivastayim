import { MapWrapper } from "@/features/map/MapWrapper";
import { Locale } from "@/dictionaries/dictionaries";

export default async function MapPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const unwrappedParams = await params;
  const lang = (unwrappedParams.lang as Locale) || "tr";

  return (
    <main className="w-full h-screen overflow-hidden">
      <MapWrapper currentLang={lang} />
    </main>
  );
}
