"use client";

import { CabinetInfo } from "@/types";
import { motion } from "framer-motion";

export function Hero({ cabinet }: { cabinet: CabinetInfo | null }) {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900 z-10"></div>
        {/* Placeholder for background image/video */}
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 z-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-xl overflow-hidden">
            {cabinet?.logo?.image_url ? (
              <img
                src={cabinet.logo.image_url}
                alt="Cabinet Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">H</span>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-md">
            HIMASAKTA <span className="text-primary">ITS</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto font-light">
            {cabinet?.tagline || "Himpunan Mahasiswa Aktuaria"}
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="#about"
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-primary/50"
            >
              Tentang Kami
            </a>
            <a
              href="#departments"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full font-semibold transition-all"
            >
              Departemen
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
          <div className="w-full h-2 bg-white rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
