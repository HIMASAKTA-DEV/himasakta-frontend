"use client";

import { News } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export function NewsSlider({ news }: { news: News[] }) {
  if (!news || news.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">
              Update Terkini
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
              Berita & Artikel
            </h3>
          </div>
          <Link
            href="/news"
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all"
          >
            Lihat Semua{" "}
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal Scroll Container (Slider alternative for simplicity) */}
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {news.map((item) => (
            <Link
              href={`/news/${item.slug}`}
              key={item.id}
              className="flex-shrink-0 w-[85vw] md:w-[400px] snap-center bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="aspect-video bg-slate-200 relative overflow-hidden">
                {/* Fallback for thumbnail */}
                {item.thumbnail?.image_url ? (
                  <img
                    src={item.thumbnail.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                  {item.tagline || "Berita"}
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs text-slate-500 mb-3 font-medium">
                  {format(new Date(item.published_at), "dd MMMM yyyy", {
                    locale: id,
                  })}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                  {item.content.replace(/#|[*]/g, "").substring(0, 100)}...
                </p>
                <div className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Baca Selengkapnya <FaArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}

          {/* "View All" card at the end */}
          <Link
            href="/news"
            className="flex-shrink-0 w-[85vw] md:w-[200px] snap-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <FaArrowRight />
            </div>
            <span className="font-semibold">Lihat Semua Berita</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
