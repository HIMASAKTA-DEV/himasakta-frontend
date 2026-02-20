"use client";

import { GetMemberByDeptId } from "@/services/departments/GetMemberByDeptId";
import { DepartmentType } from "@/types/data/DepartmentType";
import { MemberType } from "@/types/data/MemberType";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import HeaderSection from "../commons/HeaderSection";
import ImageFallback from "../commons/ImageFallback";
import EventSkeleton from "../commons/skeletons/SkeletonGrid";

type MemberCard = {
  name: string;
  role: string;
  photoUrl?: string;
};

export default function StrukturAnggota({ ...dept }: DepartmentType) {
  const [memberCards, setMemberCards] = useState<MemberCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setItemsPerSlide(2); // mobile & tablet
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
        photoUrl: m.photo?.image_url,
      }));

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
        <EventSkeleton />
      </div>
    );
  }
  if (error) return <p>Gagal memuat data</p>;

  return (
    <div className="flex flex-col gap-8 items-center">
      <HeaderSection title="Struktur Anggota" />

      <div className="relative overflow-hidden w-full pb-10">
        {/* Slider */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={idx} className="min-w-full flex gap-4">
              {slide.map((member, i) => (
                <div
                  key={i}
                  className="basis-1/2 max-w-1/2 lg:basis-1/3 lg:max-w-1/3 flex flex-col gap-3 items-center"
                >
                  <div className="w-full h-[200px] relative rounded-lg shadow">
                    <ImageFallback
                      isFill
                      src={member.photoUrl || "/placeholder-user.png"}
                      imgStyle="rounded-lg object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-center">
                      Nama: {member.name}
                    </p>
                    <p className="text-sm text-gray-600 text-center">
                      Jabatan: {member.role}
                    </p>
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
    </div>
  );
}
