import { siteConfig } from "@/data/site-config";
import { Mail } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-3">
            <Image
              src="/high_desert_volleyball/logo.webp"
              alt="HDVL Logo"
              width={32}
              height={32}
              className="h-8 w-auto brightness-0 invert"
            />
            <span className="text-xl font-bold">{siteConfig.shortName}</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Contact</h3>
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>{siteConfig.email}</span>
          </a>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Quick Links</h3>
          <div className="flex flex-col gap-2">
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#events" className="text-gray-300 hover:text-white transition-colors">Events</a>
            <a href="#sanctioning" className="text-gray-300 hover:text-white transition-colors">Sanctioning</a>
            <a href={siteConfig.links.register} className="text-gray-300 hover:text-white transition-colors">Register</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
        <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
