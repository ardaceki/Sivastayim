import HeritageGallery from "@/features/heritage/HeritageGallery";

export default async function HeritagePage({
  params,
}: Readonly<{
  params: Promise<{ lang: string }>;
}>) {
  const unwrappedParams = await params;
  const lang = unwrappedParams.lang;

  return <HeritageGallery currentLang={lang} />;
}
