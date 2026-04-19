"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/features/common/ThemeContext";
import peopleData from "@/data/people.json";
import React from 'react';

type Lang = "tr" | "en";
type Category = "Scholar" | "Politician" | "Ashik" | "Pioneer" | "Artist";

interface Person {
  id: string;
  category: Category;
  name: string;
  title: { tr: string; en: string };
  bio: { tr: string; en: string };
  didYouKnow: { tr: string; en: string };
}

const people = peopleData as Person[];

const CATEGORIES: { key: Category | "All"; label: { tr: string; en: string }; icon: React.ReactNode }[] = [
  {
    key: "All",
    label: { tr: "Tümü", en: "All" },
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    key: "Scholar",
    label: { tr: "Alimler", en: "Scholars" },
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    key: "Politician",
    label: { tr: "Siyasetçiler", en: "Politicians" },
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    key: "Ashik",
    label: { tr: "Aşıklar", en: "Ashiks" },
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
  },
  {
    key: "Pioneer",
    label: { tr: "Öncüler", en: "Pioneers" },
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    key: "Artist",
    label: { tr: "Sanatçılar", en: "Artists" },
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
];

function getCategoryAccent(cat: Category): string {
  switch (cat) {
    case "Scholar":
      return "#4A90E2"; // Turquoise
    case "Politician":
      return "#A35A42"; // Brick
    case "Ashik":
      return "#ca8a04"; // Warm Gold
    case "Pioneer":
      return "#22c55e"; // Green
    case "Artist":
      return "#a855f7"; // Purple
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function PortraitsGallery({ currentLang }: { currentLang: string }) {
  const lang = (currentLang === "en" ? "en" : "tr") as Lang;
  const { theme, toggleTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredPeople = people
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleCardClick = (id: string) => {
    const isExpanding = expandedId !== id;
    setExpandedId(isExpanding ? id : null);

    if (isExpanding) {
      setTimeout(() => {
        const el = cardRefs.current[id];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    }
  };

  const otherLang = lang === "tr" ? "en" : "tr";

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-500">
      {/* Hero Stripe */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#A35A42] via-[#8B4533] to-[#6B3427]">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 container mx-auto px-6 max-w-7xl pt-32 pb-10">
          {/* Top Bar removed in favor of global unifying Navbar */}

          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-lg">
              {lang === "tr" ? "Sivaslı Portreler" : "Portraits of Sivas"}
            </h1>
            <p className="text-lg text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
              {lang === "tr"
                ? "Bu toprakları şekillendiren alimler, aşıklar, sanatçılar ve öncüler."
                : "The scholars, poets, artists and pioneers who shaped this land."}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Category Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${isActive
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-[0_4px_12px_rgba(163,90,66,0.3)]"
                      : "bg-transparent text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                >
                  {cat.icon}
                  {cat.label[lang]}
                  {isActive && cat.key !== "All" && (
                    <span className="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
                      {people.filter((p) => p.category === cat.key).length}
                    </span>
                  )}
                  {isActive && cat.key === "All" && (
                    <span className="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
                      {people.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input for Portraits */}
          <div className="pb-4 sm:pb-0 sm:pt-0">
            <div className="relative group max-w-sm sm:max-w-xs ml-auto">
              <div className={`absolute inset-y-0 left-3.5 flex items-center pointer-events-none transition-colors duration-300 ${searchTerm ? 'text-[var(--color-primary)]' : 'text-slate-400 dark:text-slate-500'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                placeholder={lang === "tr" ? "İsim ile portre ara..." : "Search portraits by name..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-9 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 max-w-7xl py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPeople.map((person) => {
            const isExpanded = expandedId === person.id;
            const accent = getCategoryAccent(person.category);

            return (
              <div
                key={person.id}
                ref={(el) => { cardRefs.current[person.id] = el; }}
                onClick={() => handleCardClick(person.id)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${isExpanded
                    ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 shadow-2xl ring-2"
                    : "shadow-md hover:shadow-xl hover:-translate-y-1 group"
                  }`}
                style={{
                  borderColor: isExpanded ? accent : undefined,
                  ...(isExpanded ? { boxShadow: `0 0 30px ${accent}30` } : {}),
                }}
              >
                {/* Card surface */}
                <div className={`h-full transition-colors duration-300 ${isExpanded
                    ? "bg-[var(--color-primary)]"
                    : "bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700"
                  } rounded-3xl overflow-hidden`}>

                  {/* Top area: Avatar + info */}
                  <div className={`p-6 ${isExpanded ? "pb-4" : "pb-5"}`}>
                    <div className="flex items-start gap-4">
                      {/* Avatar circle */}
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg transition-transform duration-300 ${isExpanded ? "scale-110" : "group-hover:scale-105"
                          }`}
                        style={{ backgroundColor: accent }}
                      >
                        {getInitials(person.name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-[15px] leading-tight mb-1.5 transition-colors ${isExpanded ? "text-white" : "text-slate-800 dark:text-white"
                          }`}>
                          {person.name}
                        </h3>
                        <p className={`text-[13px] font-medium leading-snug transition-colors ${isExpanded ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                          }`}>
                          {person.title[lang]}
                        </p>
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${isExpanded ? "text-white/60" : ""
                          }`}
                        style={!isExpanded ? { color: accent } : {}}
                      >
                        {CATEGORIES.find((c) => c.key === person.category)?.label[lang]}
                      </span>

                      {!isExpanded && (
                        <span className="text-[12px] font-semibold text-[var(--color-secondary)] flex items-center gap-1 group-hover:gap-2 transition-all">
                          {lang === "tr" ? "Oku" : "Read"}
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail Body */}
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                    }`}>
                    <div className="px-6 pb-6">
                      {/* Divider */}
                      <div className="h-px bg-white/15 mb-5" />

                      {/* Bio */}
                      <p className="text-[14px] text-white/90 font-light leading-relaxed mb-6">
                        {person.bio[lang]}
                      </p>

                      {/* Did You Know */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className="w-6 h-6 rounded-full bg-[var(--color-secondary)] flex items-center justify-center flex-shrink-0">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
                          </div>
                          <h4 className="text-sm font-bold text-white">
                            {lang === "tr" ? "Biliyor muydunuz?" : "Did you know?"}
                          </h4>
                        </div>
                        <p className="text-[13px] text-white/85 font-light leading-relaxed pl-[34px]">
                          {person.didYouKnow[lang]}
                        </p>
                      </div>

                      {/* Close hint */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                        className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        {lang === "tr" ? "Kapat" : "Close"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer count */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-light">
            {lang === "tr"
              ? `${filteredPeople.length} portre gösteriliyor`
              : `Showing ${filteredPeople.length} portraits`}
          </p>
        </div>
      </div>

      {/* Hide scrollbar for filter row */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
