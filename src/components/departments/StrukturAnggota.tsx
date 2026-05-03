"use client";

import { GetMemberByDeptId } from "@/services/departments/GetMemberByDeptId";
import { DepartmentType } from "@/types/data/DepartmentType";
import { MemberType } from "@/types/data/MemberType";
import Lenis from "@studio-freight/lenis/types";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import HeaderSection from "../commons/HeaderSection";
import ImageFallback from "../commons/ImageFallback";
import EventSkeleton from "../commons/skeletons/SkeletonGrid";
import FramerMotionWrapper from "../commons/FramerMotionWrapper";

type MemberCard = {
  name: string;
  role: string;
  level: number;
  photoUrl?: string;
};

type LenisWindow = typeof globalThis & {
  lenis?: Lenis;
};

interface PageProps extends DepartmentType {
  viewingImg: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function StrukturAnggota({ ...dept }: PageProps) {
  const [memberCards, setMemberCards] = useState<MemberCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    caption?: string;
  } | null>(null);

  useEffect(() => {
    const isModalOpen = !!previewImage;
    const lenis = (globalThis as LenisWindow).lenis;

    if (!lenis) return;
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      lenis.stop();
    } else {
      document.body.style.overflow = "";
      lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [previewImage]);

  const handleResize = () => {
    const w = window.innerWidth;
    if (w < 1024 && w >= 768) {
      setItemsPerSlide(2); // mobile & tablet
    } else if (w < 768) {
      setItemsPerSlide(1);
    } else {
      setItemsPerSlide(3); // desktop
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchMembers = async (id: string) => {
    try {
      const json = await GetMemberByDeptId(id);

      const cards: MemberCard[] = json.data.map((m: MemberType) => ({
        name: m.name,
        role: m.role?.name ?? "-",
        level: m.role?.level ?? 0,
        photoUrl: m.photo?.image_url,
      }));

      cards.sort((a, b) => b.level - a.level);

      setMemberCards(cards);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dept?.id) return;
    fetchMembers(dept.id);
  }, [dept?.id]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: MemberCard[][] = [];
  for (let i = 0; i < memberCards.length; i += itemsPerSlide) {
    slides.push(memberCards.slice(i, i + itemsPerSlide));
  }

  // reset slide kalau layout berubah
  useEffect(() => {
    setCurrentSlide(0);
  }, [itemsPerSlide, memberCards.length]);

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
            count={itemsPerSlide}
            className={`grid grid-rows-1 grid-cols-${itemsPerSlide}`}
            withDesc={true}
          />
        </div>
      </div>
    );
  }
  if (error) return <p>&#9940; Gagal memuat data :&#40;</p>;

  return (
    <div className="flex flex-col gap-8 items-center" id="struktur">
      <FramerMotionWrapper className="flex items-center justify-center">
        <HeaderSection title="Struktur Anggota" />
      </FramerMotionWrapper>

      <div className="relative overflow-hidden w-full pb-10">
        {/* Slider */}
        {slides.length <= 0 ? (
          <FramerMotionWrapper className="w-full flex items-center">
            <p>Data struktur anggota tidak ada :&#40;</p>
          </FramerMotionWrapper>
        ) : (
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="min-w-full grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-1 lg:grid-cols-3 lg:grid-rows-1 md:gap-2 lg:gap-4"
              >
                {slide.map((member, i) => (
                  <FramerMotionWrapper
                    key={i}
                    className="w-full flex-col flex max-lg:pb-10"
                  >
                    <div
                      className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg cursor-pointer group/item"
                      onClick={() => {
                        setPreviewImage({
                          url: member.photoUrl ?? "",
                        });
                        dept.viewingImg(true);
                      }}
                    >
                      <ImageFallback
                        isFill
                        src={member.photoUrl}
                        imgStyle="rounded-lg object-cover group-hover/item:scale-110 duration-500"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/item:opacity-100 flex items-center justify-center text-white font-medium transition-all duration-500">
                        Lihat Foto
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-center">{member.name}</p>
                      <p className="text-sm text-gray-600 text-center">
                        {member.role}
                      </p>
                    </div>
                  </FramerMotionWrapper>
                ))}
              </div>
            ))}
          </div>
        )}

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
      {/* Image preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => {
            setPreviewImage(null);
            dept.viewingImg(false);
          }}
        >
          <div
            className="relative lg:max-w-[50vw] lg:max-h-[70vh] max-h-[80vh] max-w-[80vw] flex flex-col items-center gap-4 landscape:max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.url}
              alt={previewImage.caption}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl landscape:max-h-[60vh]"
            />
            <p className="text-white text-center text-sm font-medium bg-black/40 px-4 py-2 rounded-lg">
              {previewImage.caption}
            </p>
            <button
              onClick={() => {
                setPreviewImage(null);
                dept.viewingImg(false);
              }}
              className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all text-gray-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
