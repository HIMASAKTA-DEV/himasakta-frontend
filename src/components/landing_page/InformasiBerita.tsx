"use client";

import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import divideArray from "@/lib/divideArray";
import { Get12RecentNews } from "@/services/landing_page/InformasiBerita";
import { NewsType } from "@/types/data/InformasiBerita";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import NewsComps from "../_news/NewsComponents";
import HeaderSection from "../commons/HeaderSection";
import ButtonLink from "../links/ButtonLink";
import FramerMotionWrapper from "../commons/FramerMotionWrapper";

const MIN_LOADING_TIME = 1000;

export default function InformasiBerita() {
  const [news, setNews] = useState<NewsType[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<NewsType[][]>([]);
  const [cntNw, setCntNw] = useState(4);

  useEffect(() => {
    const startTime = Date.now();

    const fetchRecent12News = async () => {
      try {
        // setNews(beritaDataAllRaw as newsType[]);
        const allData = await Get12RecentNews({
          limit: 12,
          page: 1,
          sort: "asc",
          sort_by: "published_at",
        });

        setNews(allData.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(MIN_LOADING_TIME - elapsed, 0);

        setTimeout(() => {
          setLoading(false);
        }, delay);
      }
    };

    fetchRecent12News();
  }, []);

  // const latestNews = news.length > 0 ? get12LatestNews(news) : [];
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1024) setCntNw(4);
      else if (width > 768) setCntNw(3);
      else if (width > 640) setCntNw(2);
      else setCntNw(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const slidess = news.length > 0 ? divideArray(news, cntNw) : [];
    setSlides(slidess);
    setCurrentSlide(0);
  }, [news, cntNw]);

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slides.length - 1 : s - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
  };

  useEffect(() => {
    if (slides.length <= 1) return; // matikan auto play jika slide hanya 1

    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="flex flex-col gap-8" id="informasi-berita">
      <div className="flex items-end justify-between">
        <HeaderSection
          title="Informasi Berita"
          sub="Berita terbaru dari HIMASAKTA ITS."
        />

        <ButtonLink
          href="/news"
          variant="black"
          className="font-libertine font-semibold text-sm opacity-0 lg:opacity-100 p-3"
        >
          Berita Selengkapnya
        </ButtonLink>
      </div>

      <div className="flex justify-between lg:hidden">
        <div />
        <ButtonLink
          href="/news"
          variant="black"
          className="font-libertine font-semibold text-sm p-3"
        >
          Berita Selengkapnya
        </ButtonLink>
      </div>

      {loading ? (
        <SkeletonGrid
          className="grid-cols-1 grid-rows-4 lg:grid-rows-1 lg:grid-cols-4 gap-6"
          count={4}
          withDesc
        />
      ) : error || news.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p className="text-lg font-semibold">Belum ada berita</p>
          <p className="text-sm">Silakan cek kembali nanti.</p>
        </div>
      ) : (
        <FramerMotionWrapper className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {slide.map((news) => (
                  <NewsComps key={news.id} {...news} />
                ))}
              </div>
            ))}
          </div>

          {/* CONTROLS */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 lg:top-1/3 -translate-y-1/2 z-20 bg-white/70 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 lg:group-hover:opacity-100"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 lg:top-1/3 -translate-y-1/2 z-20 bg-white/70 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 lg:group-hover:opacity-100"
              >
                <FaChevronRight />
              </button>

              <div className="mt-4 flex justify-center gap-2 max-lg:hidden">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 transition-all duration-300 rounded-full ${
                      idx === currentSlide
                        ? "bg-primaryPink w-8"
                        : "bg-gray-300 w-2"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </FramerMotionWrapper>
      )}
    </section>
  );
}
