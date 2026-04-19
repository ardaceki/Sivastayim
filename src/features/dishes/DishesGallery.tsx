"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/features/common/ThemeContext";
import { DishIcon, getDishIconInfo } from "@/features/dishes/DishIcon";
import dishesDataRaw from "@/data/dishes.json";

type Lang = "tr" | "en";

interface Dish {
  id: string;
  tr: { name: string; description: string; recipe: string };
  en: { name: string; description: string; recipe: string };
}

const dishes = dishesDataRaw.dishes as Dish[];
const FEATURED_ID = "sivas_kebabi";

export default function DishesGallery({ currentLang }: { currentLang: string }) {
  const lang = (currentLang === "en" ? "en" : "tr") as Lang;
  const { theme, toggleTheme } = useTheme();
  const otherLang = lang === "tr" ? "en" : "tr";
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredDishes = dishes.filter((d) => 
    d[lang].name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.tr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.en.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const featured = filteredDishes.find((d) => d.id === FEATURED_ID);
  const rest = filteredDishes.filter((d) => d.id !== FEATURED_ID);

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

  const renderCard = (dish: Dish, isFeatured = false) => {
    const isExpanded = expandedId === dish.id;
    const { color: typeColor, label: typeLabel } = getDishIconInfo(dish.id);

    return (
      <div
        key={dish.id}
        ref={(el) => { cardRefs.current[dish.id] = el; }}
        onClick={() => handleCardClick(dish.id)}
        className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${
          isFeatured && !isExpanded ? "sm:col-span-2 lg:col-span-2" : ""
        } ${
          isExpanded
            ? "col-span-1 sm:col-span-2 lg:col-span-2 shadow-2xl"
            : "shadow-md hover:shadow-xl hover:-translate-y-1 group"
        }`}
        style={isExpanded ? { boxShadow: `0 0 40px ${typeColor}25` } : {}}
      >
        {/* Glass surface */}
        <div className={`h-full rounded-3xl overflow-hidden border transition-all duration-300 ${
          isExpanded
            ? "bg-[var(--color-primary)] border-[var(--color-secondary)]/40"
            : "bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border-slate-200/70 dark:border-slate-700/60"
        }`}>

          {/* Card Header */}
          <div className={`p-6 ${isFeatured && !isExpanded ? "sm:p-8" : ""}`}>
            <div className="flex items-start gap-4">
              {/* Lucide Icon */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 ${
                  isExpanded ? "scale-110" : "group-hover:scale-110 group-hover:rotate-[-6deg]"
                }`}
                style={{ backgroundColor: typeColor }}
              >
                <DishIcon dishId={dish.id} size={22} className="text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={`font-bold leading-tight mb-1 transition-colors ${
                  isFeatured && !isExpanded ? "text-xl" : "text-[15px]"
                } ${isExpanded ? "text-white" : "text-slate-800 dark:text-white"}`}>
                  {dish[lang].name}
                </h3>
                <p className={`text-[13px] font-light leading-relaxed transition-colors ${
                  isExpanded ? "text-white/75" : "text-slate-500 dark:text-slate-400"
                } ${isFeatured && !isExpanded ? "line-clamp-3" : "line-clamp-2"}`}>
                  {dish[lang].description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <span
                className={`text-[11px] font-bold uppercase tracking-widest ${isExpanded ? "text-white/50" : ""}`}
                style={!isExpanded ? { color: typeColor } : {}}
              >
                {typeLabel[lang]}
              </span>

              {!isExpanded && (
                <span className="text-[12px] font-semibold text-[var(--color-primary)] dark:text-[var(--color-secondary)] flex items-center gap-1 group-hover:gap-2 transition-all">
                  {lang === "tr" ? "Tarifi Gör" : "View Recipe"}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              )}

              {isExpanded && (
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center rotate-180">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
              )}
            </div>

            {/* Featured badge */}
            {isFeatured && !isExpanded && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20">
                <svg className="w-3.5 h-3.5 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                <span className="text-[11px] font-bold text-[var(--color-primary)]">
                  {lang === "tr" ? "Baş Yapıt" : "Signature Dish"}
                </span>
              </div>
            )}
          </div>

          {/* Expanded Recipe Section */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}>
            <div className="px-6 pb-6">
              <div className="h-px bg-white/15 mb-5" />

              {/* Recipe */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-secondary)] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {lang === "tr" ? "Tarif" : "Recipe"}
                  </h4>
                </div>
                <p className="text-[14px] text-white/85 font-light leading-relaxed pl-8">
                  {dish[lang].recipe}
                </p>
              </div>

              {/* Close */}
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                {lang === "tr" ? "Kapat" : "Close"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-500">
      {/* Hero Stripe */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#A35A42] via-[#8B4533] to-[#6B3427]">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 container mx-auto px-6 max-w-7xl pt-32 pb-10">
          {/* Top Bar removed in favor of global unifying Navbar */}

          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-lg">
              {lang === "tr" ? "Sivas Lezzetleri" : "Flavors of Sivas"}
            </h1>
            <p className="text-lg text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
              {lang === "tr"
                ? "Yüzyıllık geleneklerin sofrasından 18 eşsiz tat."
                : "18 unique tastes from centuries-old culinary traditions."}
            </p>

            {/* Search Bar for Dishes */}
            <div className="mt-8 relative group max-w-md mx-auto">
              <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors duration-300 ${searchTerm ? 'text-[var(--color-secondary)]' : 'text-white/40'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                placeholder={lang === "tr" ? "Lezzet ara..." : "Search flavors..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300 shadow-xl"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-3 flex items-center px-1 text-white/50 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 max-w-7xl py-10">
        {/* Dishes List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured && renderCard(featured, true)}
          {rest.map((dish) => renderCard(dish))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-slate-600 dark:text-slate-400 font-medium">
              {lang === "tr" ? "Aradığınız lezzet bulunamadı." : "No flavors found matching your search."}
            </h3>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-light">
            {lang === "tr"
              ? `${dishes.length} lezzet gösteriliyor`
              : `Showing ${dishes.length} flavors`}
          </p>
        </div>
      </div>
    </div>
  );
}
