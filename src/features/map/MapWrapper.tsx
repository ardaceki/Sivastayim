"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("@/features/map/InteractiveMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="text-slate-500 animate-pulse font-medium tracking-widest uppercase">
          Harita Yükleniyor...
        </div>
      </div>
    )
  }
);

export function MapWrapper({ currentLang }: { currentLang: string }) {
  return <InteractiveMap currentLang={currentLang} />;
}
