"use client";

import { GetProgendaByDeptId } from "@/services/departments/GetProgendaByDeptId";
import { DepartmentType } from "@/types/data/DepartmentType";
import { ProgendaType } from "@/types/data/ProgendaType";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import HeaderSection from "../commons/HeaderSection";
import ImageFallback from "../commons/ImageFallback";
import MarkdownRenderer from "../commons/MarkdownRenderer";
import EventSkeleton from "../commons/skeletons/SkeletonGrid";

type ProgendaCard = {
  name: string;
  desc: string;
  thumbnailUrl?: string;
  progendaId: string;
};

function ProgendaDept({ ...dept }: DepartmentType) {
  const [progCards, setProgCards] = useState<ProgendaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [cntItems, setCntItems] = useState(3);
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setCntItems(1); // mobile & tablet
    } else {
      setCntItems(3); // desktop
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProgenda = async (deptId: string) => {
    try {
      const json = await GetProgendaByDeptId(deptId);
      const cards: ProgendaCard[] = json.data.map((p: ProgendaType) => ({
        name: p.name,
        desc: p.description,
        thumbnailUrl: p.thumbnail?.image_url,
        progendaId: p.id,
      }));

      setProgCards(cards);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dept?.id) return;
    fetchProgenda(dept.id);
  }, [dept?.id]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: ProgendaCard[][] = [];
  for (let i = 0; i < progCards.length; i += cntItems) {
    slides.push(progCards.slice(i, i + cntItems));
  }

  // reset slide kalau layout berubah
  useEffect(() => {
    setCurrentSlide(0);
  }, [cntItems, progCards.length]);

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slides.length - 1 : s - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8 items-center w-full">
        <HeaderSection title="Struktur Anggota" />
        <div className="w-full gap-4">
          <EventSkeleton
            count={cntItems}
            className={`grid grid-rows-1 lg:grid-cols-3 grid-cols-1`}
            withDesc={true}
          />
        </div>
      </div>
    );
  }
  if (error)
    return (
      <p>&#9940; Gagal memuat data Progenda atau progenda tidak ada :&#40;</p>
    );

  return (
    <div className="w-full flex-col gap-8">
      <HeaderSection title={"Progenda"} />
      <p className="mb-8">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore aliqua. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore aliqua. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt ut
      </p>

      {/* Slide progenda */}
      {slides.length <= 0 ? (
        <div className="w-full flex items-center">
          <p>Departemen tidak memiliki progenda</p>
        </div>
      ) : (
        <div className="relative overflow-hidden lg:h-[60vh] w-full">
          {/* Slider */}
          <div
            className="flex transition-all duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                className="min-w-full grid grid-cols-1 grid-rows-1 lg:grid-cols-3 lg:grid-rows-1 lg:gap-4"
                key={idx}
              >
                {slide.map((progenda, i) => (
                  <div
                    className="w-full flex-col flex bg-primaryPinkLight"
                    key={i}
                  >
                    <Link
                      href={`/progenda/${progenda.progendaId}`}
                      className="group relative aspect-square overflow-hidden bg-gray-100 w-full lg:h-[460px] rounded-t-lg"
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10" />
                      <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                        <div className="flex items-center gap-2 text-white font-inter font-bold hover:text-[#4ade80]">
                          <span>View detail</span>
                          <FaArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                      <ImageFallback
                        isFill
                        src={progenda.thumbnailUrl}
                        imgStyle="rounded-t-lg object-cover group-hover:scale-105"
                      />
                    </Link>
                    <div className="flex flex-col gap-0">
                      <div className="space-y-1">
                        <Link
                          href={`/progenda/${progenda.progendaId}`}
                          target="_blank"
                          className="group relative lg:aspect-square overflow-hidden flex flex-col lg:gap-2 pb-8"
                        >
                          <h1 className="font-bold font-libertine hover:underline">
                            {progenda.name}
                          </h1>
                          <div className="relative group text-sm text-gray-600 h-[30px] lg:h-[50px] overflow-hidden">
                            <MarkdownRenderer>{progenda.desc}</MarkdownRenderer>
                            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-5 group-hover:h-10 bg-gradient-to-t from-primaryPinkLight to-transparent transition-all duration-300 flex items-end justify-center">
                              <p className="pointer-events-auto text-sm font-semibold text-gray-600 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 mb-2">
                                Baca selengkapnya
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Btn */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/3 bg-white/80 p-3 rounded-full shadow"
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/3 bg-white/80 p-3 rounded-full shadow"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProgendaDept;
