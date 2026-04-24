import { Mail } from "lucide-react";

interface SiteConfig {
  shortName: string;
  name: string;
  description: string;
  email: string;
}

export function Footer({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <footer className="bg-gray-950 text-gray-100 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex flex-col gap-6 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-full flex items-center justify-center shadow-lg">
              <img
                src="/hdvl_logo_transparentbg.png"
                alt="HDVL Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <span className="text-2xl font-black tracking-tight">{siteConfig.shortName}</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">Resources</h3>
          <div className="flex flex-col gap-3">
            <a href="/register-guide" className="text-gray-400 hover:text-blue-500 transition-colors text-sm font-medium">Registration Guide</a>
            <a href="/rules" className="text-gray-400 hover:text-blue-500 transition-colors text-sm font-medium">Site Rules</a>
            <a href="/conduct" className="text-gray-400 hover:text-blue-500 transition-colors text-sm font-medium">Code of Conduct</a>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">Contact</h3>
          <a
            href={`mailto:${siteConfig.email}`}
            className="group flex items-center gap-3 text-gray-400 hover:text-blue-500 transition-colors text-sm font-medium"
          >
            <div className="bg-gray-900 p-2 rounded-lg group-hover:bg-blue-900/30 transition-colors">
              <Mail className="h-4 w-4" />
            </div>
            <span>{siteConfig.email}</span>
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-900 flex flex-col items-center gap-6 text-gray-600 text-[10px] text-center uppercase tracking-widest font-bold">
        <p>&copy; 2026 {siteConfig.name}. All Rights Reserved.</p>
        <a href="/keystatic" className="hover:text-gray-400 transition-colors opacity-50">Admin</a>
      </div>
    </footer>
  );
}
