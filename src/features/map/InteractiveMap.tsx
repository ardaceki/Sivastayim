"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Utensils } from "lucide-react";

import { parseDmsToDecimal } from "@/utils/dmsToDecimal";
import placesDataRaw from "@/data/places.json";
import { useTheme } from "@/features/common/ThemeContext";

type LocalizedString = { tr: string; en: string };

type Place = {
  id: number;
  isim: LocalizedString;
  koordinatlar: string;
  sure: LocalizedString;
  aciklama: LocalizedString;
};

type Category = "Heritage" | "Nature" | "Gastronomy" | "Museum";

// Extended interface for processed places
interface ProcessedPlace extends Place {
  parsedCoords: [number, number];
  category: Category;
}

const placesData = placesDataRaw as Place[];

function getCategory(isimTr: string): Category {
  const norm = isimTr.toLowerCase();
  if (norm.includes("müze")) return "Museum";
  if (
    norm.includes("çermik") ||
    norm.includes("göl") ||
    norm.includes("dağ") ||
    norm.includes("yayla") ||
    norm.includes("bahçe") ||
    norm.includes("rekreasyon")
  ) {
    return "Nature";
  }
  if (
    norm.includes("mutfak") ||
    norm.includes("köfte") ||
    norm.includes("yemek") ||
    norm.includes("kafe") ||
    norm.includes("kahvaltı") ||
    norm.includes("lezzet")
  ) {
    return "Gastronomy";
  }
  return "Heritage";
}

function getCategoryColor(cat: Category) {
  switch (cat) {
    case "Museum":
      return "#4A90E2"; // Turquoise
    case "Nature":
      return "#22c55e"; // Green
    case "Gastronomy":
      return "#A35A42"; // Brick
    case "Heritage":
      return "#4A90E2"; // Turquoise
  }
}

function getCategoryLabel(cat: Category, lang: "tr" | "en") {
  const labels: Record<Category, { tr: string; en: string }> = {
    Heritage: { tr: "Kültürel Miras", en: "Heritage" },
    Nature: { tr: "Doğa & Sağlık", en: "Nature & Health" },
    Gastronomy: { tr: "Gastronomi", en: "Gastronomy" },
    Museum: { tr: "Müzeler", en: "Museums" },
  };
  return labels[cat][lang];
}

const CategoryIcons = {
  Heritage: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7z" />
    </svg>
  ),
  Nature: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318z" />
    </svg>
  ),
  Gastronomy: () => (
    <Utensils className="w-4 h-4" strokeWidth={2} />
  ),
  Museum: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
  ),
};

// Utility to create custom icons (runs inside component to ensure window context for Leaflet)
const getCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-leaflet-icon bg-transparent border-none",
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
};

// Sub-component to handle programmatic "Fly To" via the map instance
function MapFlyToHandler({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target, 16, { duration: 1.5 });
    }
  }, [target, map]);
  return null;
}

export default function InteractiveMap({ currentLang }: { currentLang: string }) {
  const lang = (currentLang === "en" ? "en" : "tr") as "tr" | "en";
  const { theme, toggleTheme } = useTheme();

  // Refs for auto-scrolling
  const listRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const processedPlaces = placesData
    .map((place) => {
      const coords = parseDmsToDecimal(place.koordinatlar);
      const category = getCategory(place.isim.tr);
      return { ...place, parsedCoords: coords, category };
    })
    .filter((p): p is ProcessedPlace => p.parsedCoords !== null);

  const [activeCategories, setActiveCategories] = useState<Category[]>([
    "Heritage",
    "Nature",
    "Gastronomy",
    "Museum",
  ]);

  const [flyToTarget, setFlyToTarget] = useState<[number, number] | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [activePlaceId, setActivePlaceId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCategory = (cat: Category) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredPlaces = processedPlaces
    .filter((p) => activeCategories.includes(p.category))
    .filter((p) => 
      p.isim[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.isim.tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.isim.en.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.isim[lang].localeCompare(b.isim[lang]));

  const scrollToPlace = (id: number) => {
    // Adding slight delay to allow accordion animation to register
    setTimeout(() => {
      const el = listRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleSidebarClick = (place: ProcessedPlace) => {
    const isExpanding = activePlaceId !== place.id;
    setActivePlaceId(isExpanding ? place.id : null);
    
    // Always fly to when clicking from sidebar
    setFlyToTarget(place.parsedCoords);
    
    if (isExpanding) {
      scrollToPlace(place.id);
    }
  };

  const handleMarkerClick = (place: ProcessedPlace) => {
    setActivePlaceId(place.id);
    scrollToPlace(place.id);
  };

  const activeCategoriesText = activeCategories.length === 4 
    ? (lang === "tr" ? "Tüm Kategoriler" : "All Categories")
    : activeCategories.length === 0 
      ? (lang === "tr" ? "Filtre Seçin" : "Select Filters")
      : activeCategories.map(c => getCategoryLabel(c, lang)).join(", ");

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar: Google Maps Style Layer */}
      <div className="w-full md:w-[420px] flex-1 md:h-full min-h-0 bg-white dark:bg-slate-900 shadow-[20px_0_40px_rgba(0,0,0,0.1)] z-[1000] flex flex-col order-2 md:order-1 transition-colors duration-300 relative">
        
        {/* Superior Header Core */}
        <div className="p-6 pb-5 flex flex-col gap-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity" title={lang === "tr" ? "Anasayfa'ya Dön" : "Home"}>
              <Image 
                src="/images/sivastayimlogo.png" 
                alt="Sivastayım Logo" 
                width={150} 
                height={40} 
                className="h-10 w-auto object-contain drop-shadow-sm dark:contrast-125"
                priority
              />
            </Link>
            <div className="flex items-center gap-2">
               {/* Language Switcher */}
              <Link
                href={`/${lang === "tr" ? "en" : "tr"}/map`}
                className="w-9 h-9 flex items-center justify-center text-xs font-bold uppercase rounded-full text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                aria-label="Switch Language"
              >
                {lang === "tr" ? "EN" : "TR"}
              </Link>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                )}
              </button>
              {/* Back Button */}
              <Link 
                href={`/${lang}`}
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors ml-1"
                title={lang === "tr" ? "Geri Dön" : "Back"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors duration-300 ${searchTerm ? 'text-[var(--color-secondary)]' : 'text-slate-400 dark:text-slate-500'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder={lang === "tr" ? "Nereyi keşfetmek istersiniz?" : "Where would you like to explore?"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-10 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)] transition-all duration-300 shadow-inner"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Collapsible Categories Accordion */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="w-full flex items-center justify-between p-4 bg-transparent outline-none"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {lang === "tr" ? "Filtreler" : "Filters"}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate w-[280px]">
                  {activeCategoriesText}
                </span>
              </div>
              <div className={`p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 transition-transform duration-300 ${filtersExpanded ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </button>
            
            <div className={`transition-all duration-300 ease-in-out ${filtersExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-3 pt-0 flex flex-col gap-1.5">
                {(["Heritage", "Nature", "Gastronomy", "Museum"] as Category[]).map((cat) => {
                  const isActive = activeCategories.includes(cat);
                  const color = getCategoryColor(cat);
                  const Icon = CategoryIcons[cat];
                  return (
                    <button
                      key={cat}
                      onClick={(e) => { e.stopPropagation(); toggleCategory(cat); }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                        isActive 
                          ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 shadow-sm" 
                          : "bg-transparent border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/50 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div style={{ color: isActive ? color : 'inherit' }}>
                           <Icon />
                        </div>
                        <span className={`text-sm font-semibold ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          {getCategoryLabel(cat, lang)}
                        </span>
                      </div>
                      <div 
                        className={`w-3 h-3 rounded-full border-2 transition-colors ${isActive ? 'border-transparent' : 'border-slate-300 dark:border-slate-600'}`}
                        style={{ backgroundColor: isActive ? color : 'transparent' }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Alphabetical List prioritizing Vertical Space */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/30 dark:bg-slate-900">
          {filteredPlaces.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
              <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <p className="font-light">{lang === "tr" ? "Sonuç bulunamadı." : "No results found."}</p>
            </div>
          ) : (
            filteredPlaces.map((place) => {
              const isExpanded = activePlaceId === place.id;
              const color = getCategoryColor(place.category);

              return (
                <div
                  key={place.id}
                  ref={(el) => { listRefs.current[place.id] = el; }}
                  onClick={() => handleSidebarClick(place)}
                  className={`relative overflow-hidden rounded-2xl border cursor-pointer shadow-sm transition-all duration-300 ${
                    isExpanded 
                      ? "bg-[var(--color-primary)] border-[var(--color-secondary)] shadow-[0_0_15px_rgba(74,144,226,0.35)] ring-1 ring-[var(--color-secondary)]" 
                      : "bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:-translate-y-0.5 hover:shadow-md group"
                  }`}
                >
                  {/* Master Row */}
                  <div className={`p-3.5 flex items-center justify-between transition-all duration-300 ${isExpanded ? "pl-5" : ""}`}>
                    <div className="flex items-center gap-3 w-[85%]">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                        style={{ backgroundColor: color }}
                      ></div>
                      <h3 className={`font-bold text-[14px] leading-tight transition-colors truncate ${
                        isExpanded 
                          ? "text-white drop-shadow-sm" 
                          : "text-slate-800 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                      }`}>
                        {place.isim[lang]}
                      </h3>
                    </div>
                    {/* Rotating Arrow Indicator */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isExpanded 
                        ? "rotate-180 bg-white/20 text-white shadow-inner" 
                        : "bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-400 opacity-60 group-hover:opacity-100"
                    }`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>

                  {/* Detail Panel (Accordion Body) */}
                  <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'bg-[var(--color-primary)] max-h-[500px] opacity-100' : 'bg-slate-50 dark:bg-slate-800/50 max-h-0 opacity-0'}`}>
                    <div className={`p-4 border-t ${isExpanded ? "border-white/20" : "border-slate-100 dark:border-slate-700/50"}`}>
                      
                      {/* Sub-header info */}
                      <div className="flex items-center gap-4 mb-3 text-xs">
                        <span className={`uppercase tracking-wider font-semibold ${isExpanded ? 'text-white/90 drop-shadow-sm' : ''}`} style={!isExpanded ? { color } : {}}>
                          {getCategoryLabel(place.category, lang)}
                        </span>
                        <div className={`w-1 h-1 rounded-full ${isExpanded ? 'bg-white/40' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        <span className={`flex items-center gap-1.5 font-medium ${isExpanded ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                          <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {place.sure[lang]}
                        </span>
                      </div>

                      {/* Description */}
                      <p className={`text-sm font-light leading-relaxed ${isExpanded ? 'text-white/90 drop-shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>
                        {place.aciklama[lang]}
                      </p>

                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="w-full md:flex-1 h-[40vh] md:h-full flex-shrink-0 z-0 order-1 md:order-2 relative">
        <MapContainer
          center={[39.75, 37.01]} // Sivas center
          zoom={9} // Drone view of the province
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFlyToHandler target={flyToTarget} />

          {filteredPlaces.map((place) => {
            if (!place.parsedCoords) return null;
            return (
              <Marker
                key={place.id}
                position={place.parsedCoords}
                icon={getCustomIcon(getCategoryColor(place.category))}
                eventHandlers={{
                  click: () => handleMarkerClick(place),
                }}
              >
                <Popup className="custom-popup rounded-3xl overflow-hidden shadow-2xl border-none">
                  <div className="p-2 max-w-[260px]">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div
                        className="w-3 h-3 rounded-full shadow-inner"
                        style={{ backgroundColor: getCategoryColor(place.category) }}
                      ></div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        {getCategoryLabel(place.category, lang)}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 leading-snug mb-3">
                      {place.isim[lang]}
                    </h3>
                    <p className="text-sm text-slate-600 font-normal leading-relaxed mb-5 line-clamp-3">
                      {place.aciklama[lang]}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        {lang === "tr" ? "Tahmini Süre" : "Est. Time"}
                      </span>
                      <span className="text-xs font-black text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg">
                        {place.sure[lang]}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Global CSS overrides for Leaflet Popups to make them minimalist */}
      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 1.25rem;
          padding: 10px;
          box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.15), 0 10px 15px -6px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content {
          margin: 10px 14px;
        }
        .leaflet-popup-tip {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569;
        }
      `}</style>
    </div>
  );
}
