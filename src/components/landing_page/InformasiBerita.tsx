"use client";

import beritaDataAllRaw from "@/lib/_dummy_db/_berita/dummyBeritaDataAll.json";
import get12LatestNews from "@/lib/_dummy_db/_services/get12LatestNews";
import HeaderSection from "../commons/HeaderSection";
import divideArray from "@/lib/divideArray";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import NoImage from "@/components/commons/NoImg";
import HashTags from "@/components/commons/HashTags";
import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import { newsType } from "@/types/_dummy_db/allTypes";
import NewsComps from "../_news/NewsComponents";
import ButtonLink from "../links/ButtonLink";

const beritaDataAll: newsType[] = beritaDataAllRaw;

export default function InformasiBerita() {
  const _12LatestNews = get12LatestNews(beritaDataAll);
  const slides = divideArray(_12LatestNews, 4);

  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slides.length - 1 : s - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
  };

  // TODO: Use data fetching
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <HeaderSection
          title="Informasi Berita"
          sub="Berita terbaru dari HIMASAKTA. Halah nyawit mulu lu tong."
        />
        <ButtonLink
          href="/news"
          variant="black"
          className="font-libertine font-semibold text-sm opacity-0 lg:opacity-100 p-3"
        >
          Berita Selengkapnya
        </ButtonLink>
      </div>

      <div className="flex justify-between">
        <div />
        <ButtonLink
          href="/news"
          variant="black"
          className="font-libertine font-semibold text-sm opacity-100 p-3 lg:hidden"
        >
          Berita Selengkapnya
        </ButtonLink>
      </div>

      {/* SLIDER */}
      {loading ? (
        <SkeletonGrid
          className="grid-cols-2 grid-rows-2 lg:grid-rows-1 lg:grid-cols-4 gap-6"
          count={4}
          withDesc
        />
      ) : (
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="min-w-full grid grid-cols-2 grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-6"
              >
                {slide.map((news) => (
                  <NewsComps news={news} />
                ))}
              </div>
            ))}
          </div>

          {/* NAVIGATION */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow hover:shadow-lg transition-all duration-300"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow hover:shadow-lg transition-all duration-300"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
      {/* <div className="flex justify-between">
        <div />
        <ButtonLink
          href="/news"
          variant="black"
          className="font-libertine font-semibold text-sm opacity-100 lg:opacity-0 w-[175px]"
        >
          Berita Selengkapnya
        </ButtonLink>
      </div> */}
    </section>
  );
}
