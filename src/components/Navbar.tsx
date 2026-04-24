"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteConfig {
  shortName: string;
  links: {
    register: string;
  };
}

export function Navbar({ siteConfig }: { siteConfig: SiteConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [pathname, setPathname] = useState("");
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPathname(window.location.pathname);
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isHome = pathname === "/" || pathname === "";

  const navLinks = [
    { name: "Home", href: isHome ? "#" : "/" },
    { name: "About", href: isHome ? "#about" : "/#about" },
    { name: "Events", href: isHome ? "#events" : "/#events" },
  ];

  const infoLinks = [
    { name: "Registration Guide", href: "/register-guide" },
    { name: "Site Rules", href: "/rules" },
    { name: "Code of Conduct", href: "/conduct" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-gray-950/80 backdrop-blur-md z-[100] border-b border-gray-800">
      {showBanner && (
        <div className="bg-blue-600 text-white px-4 py-2 text-center text-xs sm:text-sm font-medium relative flex items-center justify-center min-h-[40px]">
          <span className="pr-8">We are looking for additional gym space for our Jan & Feb tournaments!</span>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-2 p-1 hover:bg-blue-700 rounded-full transition-colors"
            aria-label="Close announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-white p-1 rounded-full flex items-center justify-center shadow-lg">
              <img
                src="/hdvl_logo_transparentbg.png"
                alt="HDVL Logo"
                width={48}
                height={48}
                className="h-8 w-auto sm:h-10"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-gray-100 leading-none">{siteConfig.shortName}</span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Idaho</span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-bold text-gray-400 hover:text-blue-500 transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            {/* Info Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className={cn(
                "flex items-center gap-1 text-sm font-bold transition-colors",
                isDropdownOpen ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
              )}>
                Resources <ChevronDown className={cn("h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")} />
              </button>
              <div className={cn(
                "absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-800 shadow-xl rounded-2xl transition-all duration-200 py-2",
                isDropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
              )}>
                <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent" />
                {infoLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-400 hover:bg-blue-900/30 hover:text-blue-500 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <a
              href={siteConfig.links.register}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-900/40"
            >
              Register Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white focus:outline-none bg-gray-900 p-2.5 rounded-xl border border-gray-800 active:scale-95 transition-transform"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute w-full bg-gray-950 border-b border-gray-800 transition-all duration-300 ease-in-out shadow-2xl overflow-hidden",
          isOpen ? "top-full opacity-100 translate-y-0" : "top-full opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="px-4 pt-4 pb-8 space-y-2 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="block px-4 py-4 text-base font-bold text-gray-400 hover:text-blue-500 hover:bg-blue-900/20 rounded-xl transition-colors active:bg-blue-900/30"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Resources</p>
            {infoLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="block px-4 py-4 text-base font-medium text-gray-400 hover:text-blue-500 hover:bg-blue-900/20 rounded-xl transition-colors active:bg-blue-900/30"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-4">
            <a
              href={siteConfig.links.register}
              onClick={closeMenu}
              className="block w-full text-center bg-blue-600 text-white px-5 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
