"use client";

import beritaDataAllRaw from "@/lib/_dummy_db/_berita/dummyBeritaDataAll.json";
import HeaderSection from "@/components/commons/HeaderSection";
import divideArray from "@/lib/divideArray";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import { newsType } from "@/types/_dummy_db/allTypes";
import NewsComps from "@/components/_news/NewsComponents";

const beritaDataAll: newsType[] = beritaDataAllRaw;

export default function InformasiBerita() {
  const slides = divideArray(beritaDataAll, 16);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slides.length - 1 : s - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
  };

  return (
    <section className="flex flex-col gap-8">
      <HeaderSection
        title="Informasi Berita"
        sub="Berita terbaru dari HIMASAKTA."
      />

      {loading ? (
        <SkeletonGrid
          count={16}
          withDesc
          className="grid-cols-2 grid-rows-8 lg:grid-cols-4 lg:grid-rows-4 gap-6"
        />
      ) : (
        <div className="relative overflow-hidden">
          {/* SLIDES */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="
                  min-w-full
                  grid
                  grid-cols-2 grid-rows-8
                  lg:grid-cols-4 lg:grid-rows-4
                  gap-6
                "
              >
                {slide.map((news) => (
                  <NewsComps key={news.id} news={news} />
                ))}
              </div>
            ))}
          </div>

          {/* NAVIGATION */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="
                  absolute left-2 top-1/2 -translate-y-1/2
                  bg-white/90 hover:bg-white
                  p-3 rounded-full shadow
                  transition
                "
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={nextSlide}
                className="
                  absolute right-2 top-1/2 -translate-y-1/2
                  bg-white/90 hover:bg-white
                  p-3 rounded-full shadow
                  transition
                "
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
