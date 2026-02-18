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

const MIN_LOADING_TIME = 1000;

export default function InformasiBerita() {
  const [news, setNews] = useState<NewsType[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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
  const slides = news.length > 0 ? divideArray(news, 4) : [];

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
          sub="Berita terbaru dari HIMASAKTA."
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
          className="grid-cols-2 grid-rows-2 lg:grid-rows-1 lg:grid-cols-4 gap-6"
          count={4}
          withDesc
        />
      ) : error || news.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p className="text-lg font-semibold">Belum ada berita</p>
          <p className="text-sm">Silakan cek kembali nanti.</p>
        </div>
      ) : (
        <div className="relative overflow-hidden pb-8">
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
                  <NewsComps key={news.id} {...news} />
                ))}
              </div>
            ))}
          </div>

          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow"
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow"
              >
                <FaChevronRight />
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full cursor-pointer transition ${
                      idx === currentSlide ? "bg-primaryPink" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
