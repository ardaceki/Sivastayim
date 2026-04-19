"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/features/common/ThemeContext";
import { Menu, X } from "lucide-react";

export function Navbar({
  dict,
  currentLang,
}: {
  dict: any;
  currentLang: string;
}) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const otherLang = currentLang === "tr" ? "en" : "tr";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname && pathname.includes("/map")) {
    return null; /* Hide absolute navbar only on map module */
  }

  // Define dynamic path to handle language changes properly when on a sub-route
  const getSubRoute = () => {
    if (pathname.includes("/portraits")) return "/portraits";
    if (pathname.includes("/heritage")) return "/heritage";
    if (pathname.includes("/dishes")) return "/dishes";
    return "";
  };

  const subRoute = getSubRoute();
  const langSwitchUrl = subRoute ? `/${otherLang}${subRoute}` : `/${otherLang}`;

  const tabs = [
    {
      href: `/${currentLang}/portraits`,
      isActive: pathname.includes('/portraits'),
      label: currentLang === "tr" ? "Portreler" : "Portraits",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
      )
    },
    {
      href: `/${currentLang}/heritage`,
      isActive: pathname.includes('/heritage'),
      label: currentLang === "tr" ? "Kültürel Miras" : "Heritage",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
      )
    },
    {
      href: `/${currentLang}/dishes`,
      isActive: pathname.includes('/dishes'),
      label: currentLang === "tr" ? "Lezzetler" : "Flavors",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5V3m5 5.25V6m-8.25 4.5h12.5" /></svg>
      )
    }
  ];

  return (
    <nav className="absolute top-0 w-full z-50 bg-transparent py-4 md:py-6">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href={`/${currentLang}`} className="group relative block">
            <div className="absolute -inset-4 bg-black/20 blur-xl rounded-full z-0 pointer-events-none"></div>
            <Image 
               src="/images/sivastayimlogo.png" 
               alt="Sivastayım Logo" 
               width={160} 
               height={40} 
               className="relative z-10 h-8 sm:h-10 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
               priority
            />
          </Link>
        </div>

        {/* Center: Tabs (Desktop Only) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-8 px-8">
          {tabs.map((tab, i) => (
            <Link
              key={i}
              href={tab.href}
              className={`h-10 px-5 flex items-center justify-center gap-2 text-sm font-semibold rounded-full backdrop-blur-md border border-white/20 text-white transition-all duration-300 shadow-lg ${tab.isActive ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 relative z-50">
          <div className="w-px h-6 bg-white/20 hidden sm:block mr-0 sm:mr-2" />

          {/* Language Switcher */}
          <Link
            href={langSwitchUrl}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-bold uppercase rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
            aria-label="Switch Language"
          >
            {otherLang}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
            )}
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg ml-1"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 z-50">
          {tabs.map((tab, i) => (
            <Link
              key={i}
              href={tab.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`h-12 px-5 flex items-center justify-start gap-4 text-base font-semibold rounded-xl transition-all duration-300 shadow-sm border ${
                tab.isActive 
                  ? 'bg-red-50 dark:bg-red-900/20 text-[#A35A42] dark:text-red-400 border-red-200 dark:border-red-800' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
