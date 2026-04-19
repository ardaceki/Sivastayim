"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/features/common/ThemeContext";
import { Dog, Scroll, Home, Music, Tent, Scissors, MapPin } from "lucide-react";
import heritageData from "@/data/heritage.json";

type Lang = "tr" | "en";

interface HeritageItem {
  id: string;
  category: string;
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  didYouKnow: { tr: string; en: string };
}

const items = heritageData as HeritageItem[];

// Map icons
const getIcon = (id: string, className = "") => {
  switch (id) {
    case "HERITAGE-001": return <Dog className={className} />;
    case "HERITAGE-002": return <Scroll className={className} />;
    case "HERITAGE-003": return <Home className={className} />;
    case "HERITAGE-004": return <Music className={className} />;
    case "HERITAGE-005": return <Tent className={className} />;
    case "HERITAGE-006": return <Scissors className={className} />;
    default: return <MapPin className={className} />;
  }
};

// Map SVG background patterns specific to the heritage theme
const getPattern = (id: string) => {
  switch (id) {
    case "HERITAGE-001": // Dog / Paw-like or dot pattern
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E")`;
    case "HERITAGE-002": // Rug / Geometric pattern
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`;
    case "HERITAGE-003": // Architecture / Brick-like minimal
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`;
    case "HERITAGE-004": // Music / Wood grain abstract or lines
      return `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h10v1H0z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E")`;
    case "HERITAGE-005": // Horse / Diagonal lines
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20L20 0h-2L0 18v2zm20-2L2 20h2l16-16v-2z' fill='%23ffffff' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E")`;
    case "HERITAGE-006": // Savat / Metal shine (dots grid)
      return `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23ffffff' fill-opacity='0.06'/%3E%3C/svg%3E")`;
    default:
      return "none";
  }
};

export default function HeritageGallery({ currentLang }: { currentLang: string }) {
  const lang = (currentLang === "en" ? "en" : "tr") as Lang;
  const { theme, toggleTheme } = useTheme();
  const otherLang = lang === "tr" ? "en" : "tr";
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleCardClick = (id: string) => {
    const isExpanding = expandedId !== id;
    setExpandedId(isExpanding ? id : null);
    if (isExpanding) {
      setTimeout(() => {
        const el = cardRefs.current[id];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  };

  const renderCard = (item: HeritageItem) => {
    const isExpanded = expandedId === item.id;
    const accentColor = "#A35A42"; // Sivas Brick
    const titleColor = "#4A90E2"; // Turquoise

    return (
      <div
        key={item.id}
        ref={(el) => { cardRefs.current[item.id] = el; }}
        onClick={() => handleCardClick(item.id)}
        className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${
          isExpanded
            ? "col-span-1 md:col-span-3 shadow-2xl"
            : "col-span-1 shadow-md hover:shadow-xl hover:-translate-y-1 group"
        }`}
        style={isExpanded ? { boxShadow: `0 0 40px ${titleColor}25` } : {}}
      >
        {/* Glass surface with dynamic pattern */}
        <div 
          className={`relative h-full rounded-3xl overflow-hidden border transition-all duration-300 ${
            isExpanded
              ? "bg-[var(--background)] border-[var(--color-secondary)]/40"
              : "bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border-slate-200/70 dark:border-slate-700/60"
          }`}
        >
          {/* Subtle Theme Pattern Background overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.8] dark:opacity-[0.4] pointer-events-none transition-opacity duration-300 group-hover:opacity-100" 
            style={{ backgroundImage: getPattern(item.id) }} 
          />

          {/* Card Header area */}
          <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full bg-gradient-to-b from-transparent to-white/10 dark:to-black/10">
            <div className="flex items-start gap-5">
              {/* Icon Container */}
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 ${
                  isExpanded ? "scale-110" : "group-hover:scale-110 group-hover:-rotate-3"
                }`}
                style={{ backgroundColor: isExpanded ? titleColor : accentColor }}
              >
                {getIcon(item.id, "w-6 h-6 text-white")}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 block">
                  {item.category}
                </span>
                <h3 
                  className={`font-bold leading-tight mb-2 transition-colors text-[18px] sm:text-[20px]`}
                  style={{ color: isExpanded ? titleColor : titleColor }}
                >
                  {item.name[lang]}
                </h3>
              </div>
            </div>

            {/* Snippet (only visible when collapsed) */}
            {!isExpanded && (
              <p className="mt-4 text-[14px] font-light leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                {item.description[lang]}
              </p>
            )}

            {/* Footer Learn More Action (when collapsed) */}
            <div className="mt-auto pt-6 flex items-center justify-end">
              {!isExpanded && (
                <span 
                  className="text-[13px] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all opacity-80 group-hover:opacity-100"
                  style={{ color: accentColor }}
                >
                  {lang === "tr" ? "Müzeyi Gez" : "Explore Exhibit"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              )}
            </div>
            
            {/* Expanded Content View */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-[800px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
            }`}>
              <div className="pt-2 pb-2">
                <div className="h-px bg-slate-200 dark:bg-slate-700/60 mb-6" />

                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Column: Description */}
                  <div className="flex-1">
                     <p className="text-[15px] sm:text-[16px] text-slate-700 dark:text-slate-200 font-light leading-relaxed">
                        {item.description[lang]}
                     </p>
                  </div>

                  {/* Right Column: Did You Know (Sivas Brick accent) */}
                  <div className="flex-1">
                    <div className="rounded-2xl p-5 sm:p-6 border relative overflow-hidden"
                         style={{ backgroundColor: `${accentColor}10`, borderColor: `${accentColor}30` }}>
                      {/* Decorative icon in background */}
                      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                         {getIcon(item.id, "w-32 h-32")}
                      </div>

                      <div className="flex items-center gap-3 mb-3 relative z-10">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                             style={{ backgroundColor: accentColor }}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
                        </div>
                        <h4 className="text-[15px] font-bold" style={{ color: accentColor }}>
                          {lang === "tr" ? "Biliyor muydunuz?" : "Did You Know?"}
                        </h4>
                      </div>
                      <p className="text-[14px] sm:text-[15px] text-slate-800 dark:text-slate-300 font-medium leading-relaxed relative z-10 pl-11">
                        {item.didYouKnow[lang]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                  className="mt-8 mx-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl hover:opacity-90 text-white text-sm font-medium transition-all shadow-md"
                  style={{ backgroundColor: accentColor }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  {lang === "tr" ? "Sergiyi Kapat" : "Close Exhibit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-500">
      {/* Hero Museum Header Segment */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] border-b-[6px] border-[#A35A42]">
        {/* Decorative Museum Pillars Pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0h2v40h-2zM28 0h2v40h-2z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 container mx-auto px-6 max-w-7xl pt-32 pb-14">
          {/* Top Bar removed in favor of global unifying Navbar */}

          {/* Title Area */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A35A42]/20 border border-[#A35A42]/30 mb-6 backdrop-blur-sm">
                <svg className="w-4 h-4 text-[#A35A42]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z"/></svg>
                <span className="text-[12px] font-bold text-[#A35A42] uppercase tracking-widest">
                   {lang === "tr" ? "Dijital Sergi" : "Digital Exhibit"}
                </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-xl"
                style={{ textShadow: "0 4px 20px rgba(74, 144, 226, 0.4)" }}>
              {lang === "tr" ? "Kültürel Miras" : "Cultural Heritage"}
            </h1>
            <p className="text-lg text-slate-300 font-light leading-relaxed">
              {lang === "tr"
                ? "Sivas'ın ruhunu, zanaatını ve yaşam kültürünü yansıtan eşsiz değerlerin ardındaki sessiz tarihi keşfedin."
                : "Discover the silent history behind the unique values that reflect the spirit, craftsmanship, and life culture of Sivas."}
            </p>
          </div>
        </div>
      </div>

      {/* Museum Grid Section */}
      <div className="container mx-auto px-6 max-w-7xl py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => renderCard(item))}
        </div>
      </div>

    </div>
  );
}
