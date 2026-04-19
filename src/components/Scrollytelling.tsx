"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SCROLLYTELLING_LAYERS } from "@/constants/scrollytelling";
import Image from "next/image";

interface Step {
  title: string;
  description: string;
}

interface ScrollytellingProps {
  steps: Step[];
  currentLang?: string;
}

export function Scrollytelling({ steps, currentLang = "tr" }: ScrollytellingProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="discovery" className="relative w-full bg-black text-white">
      {/* Sticky Background Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
        {SCROLLYTELLING_LAYERS.map((layer, index) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeIndex === index ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full will-change-opacity"
          >
            {/* Fallback solid color behind the image */}
            <div 
              className="absolute inset-0 w-full h-full" 
              style={{ backgroundColor: `hsl(${200 + index * 40}, 50%, 20%)` }} 
            />
            
            {/* Background Image Layer using Next.js Image for optimization */}
            <Image
              src={layer.imagePath}
              alt={`Sivas Historical Layer: ${layer.id}`}
              fill
              priority={index < 2}
              className="object-cover"
              sizes="100vw"
            />
            
            {/* Dark Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        ))}
      </div>

      {/* Scrolling Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-32 -mt-[100vh]">
        {/* Adjusted content to the right side so it doesn't cover the image focus points */}
        <div className="flex flex-col w-full md:w-1/2 lg:w-5/12 md:ml-auto">
          {steps.map((step, index) => (
            <motion.div
              key={`scrolly-card-${index}`}
              onViewportEnter={() => setActiveIndex(index)}
              viewport={{ amount: "some", margin: "-40% 0px -40% 0px" }}
              className={`flex ${index === 0 ? "items-start pt-[20vh]" : "items-center"} min-h-[100vh] py-16`}
            >
              <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <h3 className="text-3xl sm:text-4xl font-bold mb-5 text-[var(--color-secondary)] tracking-tight">
                  {step.title}
                </h3>
                <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Back to top button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            className="flex items-center justify-center pt-8 pb-16"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex flex-col items-center gap-4 text-slate-400 hover:text-white transition-all duration-300"
              aria-label={currentLang === "en" ? "Back to Top" : "En Tepeye Dön"}
            >
              <div className="w-16 h-16 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-[#A35A42] group-hover:border-[#A35A42] transition-all duration-500 shadow-xl group-hover:shadow-[0_0_25px_rgba(163,90,66,0.5)] group-hover:-translate-y-2">
                <svg className="w-6 h-6 transition-transform duration-500 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                {currentLang === "en" ? "Back to Top" : "En Tepeye Dön"}
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
