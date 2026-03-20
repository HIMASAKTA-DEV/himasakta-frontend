"use client";

import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import divideArray from "@/lib/divideArray";
import { getEventThisMonth } from "@/services/landing_page/GetToKnow";
import { MonthlyEvent } from "@/types/data/GetToKnow";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import ImageFallback from "../commons/ImageFallback";
import MarkdownRenderer from "../commons/MarkdownRenderer";

export default function GetToKnow() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<MonthlyEvent[]>([]);
  const [cntEv, setCntEv] = useState(3);
  const [slides, setSlides] = useState<MonthlyEvent[][]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch data
  useEffect(() => {
    const fetchEvThisMonth = async () => {
      try {
        const data = await getEventThisMonth();
        setEvents(data.data);
      } catch (err) {
        console.error("Failed to load event this month ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvThisMonth();
  }, []);

  // Handle Responsive Breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1024) setCntEv(4);
      else if (width > 768) setCntEv(2);
      else setCntEv(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update Slides when events or count changes
  useEffect(() => {
    if (events.length > 0) {
      setSlides(divideArray(events, cntEv));
      setCurrentSlide(0); // Reset ke slide awal jika breakpoint berubah
    }
  }, [events, cntEv]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slides.length - 1 : s - 1));
  };

  return (
    <section
      className="w-full flex flex-col gap-10 py-10"
      id="kegiatan-section"
    >
      {/* HEADER */}
      <div className="space-y-3 text-center px-4">
        <h1 className="font-averia text-4xl lg:text-6xl text-gray-900">
          Get to Know: What&apos;s on HIMASAKTA
        </h1>
        <p className="font-libertine lg:text-xl text-gray-600 max-w-2xl mx-auto">
          Berbagai acara pada satu bulan terakhir yang diadakan di HIMASAKTA.
        </p>
      </div>

      {loading ? (
        <div className="px-4 cursor-wait">
          <SkeletonGrid
            className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            count={4}
            withDesc
          />
        </div>
      ) : events.length > 0 ? (
        <div className="relative w-full overflow-hidden px-1">
          {/* SLIDER CONTAINER */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 lg:px-12"
              >
                {slide.map((event) => (
                  <div
                    key={event.id}
                    className=" flex flex-col gap-3 w-full lg:min-w-[280px] lg:max-w-[280px]"
                  >
                    <Link
                      href={event.link}
                      target="_blank"
                      className="group relative w-full aspect-square overflow-hidden rounded-xl bg-gray-100"
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10" />
                      <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center gap-2 text-white font-inter font-bold hover:text-[#4ade80]">
                          <span>View detail</span>
                          <FiExternalLink className="w-5 h-5" />
                        </div>
                      </div>

                      <ImageFallback
                        isFill
                        src={event.thumbnail?.image_url}
                        alt={event.title}
                        // Tambahkan efek zoom sedikit agar lebih cantik
                        imgStyle="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>

                    <div className="group space-y-1">
                      <Link href={event.link} target="_blank">
                        <h2 className="font-libertine text-lg font-bold hover:text-primaryGreen line-clamp-2 transition-colors">
                          {event.title}
                        </h2>
                      </Link>
                      <Link href={event.link} target="_blank">
                        <div className="relative text-sm text-gray-600 h-[50px] lg:h-[80px] overflow-hidden">
                          <MarkdownRenderer>
                            {event.description}
                          </MarkdownRenderer>
                          {/* Baca Selengkapnya Overlay */}
                          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-10 group-hover:h-20 bg-gradient-to-t from-white via-white/80 to-transparent transition-all duration-300 flex items-end justify-center">
                            <p className="pointer-events-auto text-sm font-semibold text-gray-600 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 mb-1">
                              Baca selengkapnya
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* CONTROLS */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 lg:top-1/3 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 lg:group-hover:opacity-100"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 lg:top-1/3 -translate-y-1/2 z-20 bg-white/70 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 lg:group-hover:opacity-100"
              >
                <FaChevronRight />
              </button>

              <div className="mt-10 flex justify-center gap-2 max-lg:hidden">
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
        </div>
      ) : (
        <div className="mx-4 py-16 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
          <p className="text-xl font-medium">Belum ada acara bulan ini</p>
        </div>
      )}
    </section>
  );
}
