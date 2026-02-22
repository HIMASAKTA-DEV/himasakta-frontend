"use client";

import { useEffect, useState } from "react";
import HeaderSection from "../commons/HeaderSection";
import { ProgendaType } from "@/types/data/ProgendaType";
import { GetProgendaByDeptId } from "@/services/departments/GetProgendaByDeptId";
import { DepartmentType } from "@/types/data/DepartmentType";
import EventSkeleton from "../commons/skeletons/SkeletonGrid";
import ImageFallback from "../commons/ImageFallback";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

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
      setCntItems(2); // mobile & tablet
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
        thumbnailUrl: p.thumbnail.image_url,
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
            className={`grid grid-rows-1 grid-cols-${cntItems}`}
            withDesc={true}
          />
        </div>
        <SkeletonPleaseWait />
      </div>
    );
  }
  if (error) return <p>&#9940; Gagal memuat data :&#40;</p>;

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
        <div className="relative overflow-hidden w-full pb-10">
          {/* Slider */}
          <div
            className="flex transition-all duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div className="min-w-full flex gap-4" key={idx}>
                {slide.map((progenda, i) => (
                  <div
                    className="basis-1/2 max-w-1/2 lg:basis-1/3 lg:max-w-1/3 flex flex-col gap-3 items-start"
                    key={i}
                  >
                    <Link
                      href={`/progenda/${progenda.progendaId}`}
                      target="_blank"
                      className="group relative aspect-square overflow-hidden bg-gray-100 w-full lg:h-[400px] rounded-lg"
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
                        imgStyle="rounded-lg object-cover group-hover:scale-105"
                      />
                    </Link>
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/progenda/${progenda.progendaId}`}
                        target="_blank"
                        className="group relative aspect-square overflow-hidden flex flex-col gap-4"
                      >
                        <h1 className="font-bold font-libertine hover:underline">
                          {progenda.name}
                        </h1>
                        <p className="font-libertine text-gray-500 hover:text-black duration-300 transition-all line-clamp-3">
                          {progenda.desc}
                        </p>
                      </Link>
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
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow"
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow"
              >
                <FaChevronRight />
              </button>

              {/* DOTS */}
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
    </div>
  );
}

export default ProgendaDept;
