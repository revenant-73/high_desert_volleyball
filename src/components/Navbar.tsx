"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  let closeTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    if (closeTimeout) clearTimeout(closeTimeout);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const pathname = usePathname();
  const isHome = pathname === "/";

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
    <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-100 shadow-sm">
      {showBanner && (
        <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm font-medium relative flex items-center justify-center min-h-[40px]">
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
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.webp"
              alt="HDVL Logo"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-none">{siteConfig.shortName}</span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Idaho</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Info Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className={cn(
                "flex items-center gap-1 text-sm font-bold transition-colors",
                isDropdownOpen ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              )}>
                Resources <ChevronDown className={cn("h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")} />
              </button>
              <div className={cn(
                "absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl transition-all duration-200 py-2",
                isDropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
              )}>
                <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent" />
                {infoLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href={siteConfig.links.register}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200"
            >
              Register Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none bg-gray-50 p-2 rounded-xl"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute w-full bg-white border-b border-gray-100 transition-all duration-300 ease-in-out shadow-xl",
          showBanner ? "top-[120px]" : "top-20",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="px-4 pt-4 pb-8 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-base font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Resources</p>
            {infoLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4">
            <Link
              href={siteConfig.links.register}
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-blue-600 text-white px-5 py-4 rounded-xl text-base font-bold hover:bg-blue-700"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
