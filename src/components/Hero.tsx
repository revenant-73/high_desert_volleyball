"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/site-config";
import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden bg-white">
      {/* Background blobs */}
      <div className="absolute top-0 -right-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Registration Opens Monday Oct 27
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              {siteConfig.name.split(" ").slice(0, 2).join(" ")} <br />
              <span className="text-blue-600">Volleyball</span> League
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-lg">
              {siteConfig.tagline}. A premier JVA sanctioned league designed for all competitive levels.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={siteConfig.links.register}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all hover:gap-3"
              >
                Register Your Team <ChevronRight className="h-5 w-5" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all">
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-tr from-blue-600 to-blue-400 rounded-3xl rotate-3 flex items-center justify-center overflow-hidden">
                {/* Image Placeholder */}
                <div className="text-white text-center p-8 -rotate-3">
                    <div className="bg-white/20 p-6 rounded-full inline-block mb-4">
                        <Play className="h-12 w-12 fill-white ml-1" />
                    </div>
                    <p className="text-lg font-medium">Capture the intensity of the game</p>
                </div>
            </div>
            {/* Decorative cards */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">JVA</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Sanctioned League</p>
                  <p className="text-xs text-gray-500">Highest safety standards</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
