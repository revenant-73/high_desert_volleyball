import { siteConfig } from "@/data/site-config";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.webp"
              alt="HDVL Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold">{siteConfig.shortName}</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Resources</h3>
          <div className="flex flex-col gap-2">
            <Link href="/register-guide" className="text-gray-300 hover:text-white transition-colors">Registration Guide</Link>
            <Link href="/rules" className="text-gray-300 hover:text-white transition-colors">Site Rules</Link>
            <Link href="/conduct" className="text-gray-300 hover:text-white transition-colors">Code of Conduct</Link>
          </div>
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
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col items-center gap-4 text-gray-500 text-xs text-center">
        <Image
          src="/logo.webp"
          alt="HDVL Logo"
          width={40}
          height={40}
          className="h-10 w-auto opacity-50 hover:opacity-100 transition-opacity"
        />
        <p>&copy; 2026 {siteConfig.name}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
