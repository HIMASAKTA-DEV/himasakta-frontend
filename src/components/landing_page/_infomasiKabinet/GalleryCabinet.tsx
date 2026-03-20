"use client";

import ImageFallback from "@/components/commons/ImageFallback";
import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import divideArray from "@/lib/divideArray"; // Pastikan path ini benar
import { GetGalleryByCabinetId } from "@/services/landing_page/GeGalleryByCabinetId";
import { GalleryType } from "@/types/data/GalleryType";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function GalleryCabinet({ ...cabinet }: CabinetInfo) {
  const [loading, setLoading] = useState(true);
  const [galleries, setGalleries] = useState<GalleryType[]>([]);
  const [_hasNext, _setHasNext] = useState(false);
  const [_currPg, _setCurrPg] = useState(1);
  const [error, setError] = useState(false);
  const [limitGallery, setLimitGallery] = useState(3);
  const [slides, setSlides] = useState<GalleryType[][]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    caption?: string;
  } | null>(null);

  // 1. Fetch SEMUA data galeri (atau limit yang besar) untuk dijadikan slider
  useEffect(() => {
    const fetchAllGallery = async (cabinetId: string) => {
      setLoading(true);
      setError(false);
      try {
        // Kita ambil data dalam jumlah banyak sekaligus untuk slider
        // Jika API kamu mendukung, hilangkan pagination atau set limit tinggi
        const json = await GetGalleryByCabinetId(cabinetId, 1, 50);
        setGalleries(json.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (cabinet.id) fetchAllGallery(cabinet.id);
  }, [cabinet.id]);

  // 2. Handle Responsive Breakpoints untuk jumlah item per slide
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1024) setLimitGallery(3);
      else if (width > 768) setLimitGallery(2);
      else setLimitGallery(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3. Update Slides saat data atau ukuran layar berubah
  useEffect(() => {
    if (galleries.length > 0) {
      setSlides(divideArray(galleries, limitGallery));
      setCurrentSlide(0);
    }
  }, [galleries, limitGallery]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slides.length - 1 : s - 1));
  };

  // Lock body scroll saat modal buka
  useEffect(() => {
    document.body.style.overflow = previewImage ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [previewImage]);

  if (error && !loading)
    return (
      <p className="text-center py-10 text-red-600">Gagal memuat data galeri</p>
    );

  return (
    <div className="flex flex-col gap-8 px-4 w-full py-10">
      <div className="text-center">
        <h1 className="text-3xl lg:text-5xl font-libertine font-semibold">
          Galeri Kabinet
        </h1>
      </div>

      {loading && (
        <SkeletonGrid
          className={`grid-cols-1 grid-rows-1 lg:grid-rows-1 lg:grid-cols-3 gap-6`}
          count={limitGallery}
        />
      )}

      {galleries.length <= 0 && !loading ? (
        <div className="w-full flex items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-400">Departemen belum memiliki dokumentasi</p>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden group">
          {/* SLIDER CONTAINER */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-12"
              >
                {slide.map((g, gIdx) => (
                  <div
                    key={gIdx}
                    className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg cursor-pointer group/item"
                    onClick={() =>
                      setPreviewImage({
                        url: g.image_url,
                        caption: g.caption || g.id,
                      })
                    }
                  >
                    <ImageFallback
                      isFill
                      src={g.image_url}
                      imgStyle="rounded-lg object-cover group-hover/item:scale-110 duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                      Lihat Foto
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* CONTROLS (Hanya muncul jika slide > 1) */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
              >
                <FaChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
              >
                <FaChevronRight size={20} />
              </button>

              {/* DOTS INDICATOR */}
              <div className="mt-8 flex justify-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 max-lg:hidden ${
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
      )}

      {/* MODAL PREVIEW (Tetap dipertahankan karena fitur yang bagus) */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.url}
              alt="Preview"
              className="max-h-[80vh] object-contain rounded-lg"
            />
            {previewImage.caption && (
              <p className="mt-4 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                {previewImage.caption}
              </p>
            )}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryCabinet;
