"use client";

import { ChevronRight as ChevronRightIcon } from "lucide-react";

interface SiteConfig {
  name: string;
  tagline: string;
  links: {
    register: string;
  };
}

export function Hero({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 sm:pt-52 md:pt-40 pb-12 overflow-hidden bg-gray-950">
      {/* Background blobs */}
      <div className="absolute top-0 -right-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-900/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 -left-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-800/10 rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-900/30 text-blue-400 px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold mb-8 border border-blue-800/50 uppercase tracking-widest mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Registration Opens Monday Oct 27
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              {siteConfig.name.split(" ").slice(0, 2).join(" ")} <br />
              <span className="text-blue-500">Volleyball</span> League
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              {siteConfig.tagline}. A premier JVA sanctioned league designed for all competitive levels.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={siteConfig.links.register}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg hover:bg-blue-700 transition-all hover:gap-3 shadow-lg shadow-blue-900/40 active:scale-[0.98]"
              >
                Register Your Team <ChevronRightIcon className="h-5 w-5" />
              </a>
              <button className="inline-flex items-center justify-center gap-2 border-2 border-gray-800 text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg hover:border-blue-500 hover:text-blue-500 transition-all active:scale-[0.98]">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative px-4 sm:px-0">
            <div className="aspect-square bg-blue-600 rounded-[2rem] sm:rounded-[3rem] rotate-2 sm:rotate-3 overflow-hidden shadow-2xl relative max-w-md mx-auto lg:max-w-none">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  webkit-playsinline="true"
                  className="absolute inset-0 w-full h-full object-cover -rotate-2 sm:-rotate-3 scale-110"
                >
                  <source src="/awesome_rally.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/10 -rotate-2 sm:-rotate-3" />
            </div>
            {/* Decorative background circle */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600/20 blur-2xl rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
