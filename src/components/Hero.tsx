"use client";

import {
  CalendarDays,
  ChevronRight,
  MapPin,
  Medal,
  PlayCircle,
  ShieldCheck,
  Trophy,
} from "lucide-react";

interface SiteConfig {
  name: string;
  tagline: string;
  links: {
    register: string;
  };
}

export function Hero({ siteConfig }: { siteConfig: SiteConfig }) {
  const quickFacts = [
    { label: "JVA Sanctioned", icon: ShieldCheck },
    { label: "12U-18U Teams", icon: Medal },
    { label: "Treasure Valley", icon: MapPin },
    { label: "1-Day + 2-Day Events", icon: CalendarDays },
  ];

  return (
    <section className="relative overflow-hidden bg-gray-950 pt-32 pb-8 sm:pt-36 sm:pb-12 lg:min-h-[88vh] lg:pt-40 lg:pb-20">
      <div className="absolute inset-0 sm:hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          poster="/hdvl_logo_transparentbg.png"
          aria-label="Volleyball rally footage"
          className="h-full w-full object-cover opacity-20"
        >
          <source src="/awesome_rally.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/88 to-gray-950" />
      </div>
      <div className="absolute inset-0 hidden bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98)_48%,rgba(15,23,42,0.94))] sm:block" />
      <div className="absolute inset-x-0 top-0 h-px bg-blue-400/30" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(#ffffff_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute left-1/2 top-28 hidden h-[620px] w-[620px] -translate-x-1/2 rounded-[48px] border border-blue-400/10 lg:block" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)] md:gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)] lg:gap-14">
          <div className="max-w-3xl text-center md:text-left">
            <div className="mb-5 flex flex-col items-center gap-3 sm:mb-6 sm:flex-row sm:justify-center sm:gap-4 md:justify-start lg:mb-7">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white p-2 shadow-2xl shadow-blue-950/50 sm:h-24 sm:w-24">
                <img
                  src="/hdvl_logo_transparentbg.png"
                  alt="HDVL logo"
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.12em] text-amber-300 sm:text-xs sm:tracking-[0.18em]">
                  Registration Opens October 27
                </div>
                <div className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-blue-300 sm:text-sm sm:tracking-[0.14em]">
                  Southwest Idaho Youth Volleyball
                </div>
              </div>
            </div>

            <h1 className="mx-auto max-w-[19rem] text-3xl font-black leading-[1.05] tracking-normal text-white sm:max-w-2xl sm:text-5xl md:mx-0 lg:text-6xl">
              {siteConfig.name}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:mt-5 sm:text-base sm:leading-8 md:mx-0 lg:mt-6 lg:text-lg">
              {siteConfig.tagline}. JVA sanctioned competition for Treasure Valley teams<span className="hidden sm:inline">, built around clear event information, credible venues, and simple team registration</span>.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:flex sm:justify-center md:justify-start lg:mt-8">
              <a
                href={siteConfig.links.register}
                aria-label="Open the registration guide"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 px-3 py-3 text-sm font-black text-white shadow-xl shadow-blue-950/40 transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-950 active:scale-[0.98] sm:min-h-14 sm:px-6 sm:py-4 sm:text-base"
              >
                <span className="lg:hidden">Register</span>
                <span className="hidden lg:inline">Registration Guide</span>
                <ChevronRight className="h-5 w-5" />
              </a>
              <a
                href="#events"
                aria-label="Jump to events"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-3 text-sm font-black text-white transition hover:border-blue-300 hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-950 active:scale-[0.98] sm:min-h-14 sm:px-6 sm:py-4 sm:text-base"
              >
                <span className="lg:hidden">Events</span>
                <span className="hidden lg:inline">View Events</span>
                <Trophy className="h-5 w-5" />
              </a>
              <a
                href="/venues"
                className="hidden items-center justify-center gap-2 rounded-xl border border-transparent px-6 py-4 text-base font-black text-gray-300 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-950 active:scale-[0.98] lg:inline-flex"
              >
                Venues <MapPin className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-7 sm:grid-cols-4 sm:gap-3 md:grid-cols-2 lg:mt-8 lg:grid-cols-4">
              {quickFacts.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex min-h-12 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2 text-center shadow-lg shadow-black/10 sm:min-h-16 sm:px-3 sm:py-3 lg:min-h-20 lg:items-start lg:py-4 lg:text-left"
                >
                  <Icon className="mb-1 h-4 w-4 text-amber-300 sm:mb-2 sm:h-5 sm:w-5" aria-hidden="true" />
                  <span className="text-xs font-black leading-snug text-white sm:text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden sm:block">
            <div className="overflow-hidden rounded-2xl border border-blue-300/25 bg-gray-900 bg-[radial-gradient(circle_at_50%_35%,rgba(37,99,235,0.22),rgba(15,23,42,0.96)_55%)] shadow-2xl shadow-blue-950/50">
              <div className="relative aspect-[16/10] min-h-[260px] lg:aspect-[5/4] lg:min-h-[380px]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  webkit-playsinline="true"
                  poster="/hdvl_logo_transparentbg.png"
                  aria-label="Volleyball rally footage"
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src="/awesome_rally.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/15 bg-gray-950/75 p-3 backdrop-blur-sm sm:inset-x-6 sm:bottom-6 sm:p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.12em] text-blue-300 sm:text-xs sm:tracking-[0.16em]">
                        2026 League Season
                      </div>
                      <div className="mt-1 text-base font-black text-white lg:text-xl">
                        <span className="lg:hidden">Coach-ready events</span>
                        <span className="hidden lg:inline">Events built for coaches to act fast</span>
                      </div>
                    </div>
                    <a
                      href="#events"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-black text-gray-950 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-950 lg:py-3"
                    >
                      Schedule <PlayCircle className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-4 hidden max-w-xl grid-cols-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] text-center lg:grid">
              <div className="border-r border-white/10 px-3 py-4">
                <div className="text-2xl font-black text-white">JVA</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-400">Sanctioned</div>
              </div>
              <div className="border-r border-white/10 px-3 py-4">
                <div className="text-2xl font-black text-white">12U-18U</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-400">Divisions</div>
              </div>
              <div className="px-3 py-4">
                <div className="text-2xl font-black text-white">ID</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-400">Treasure Valley</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
