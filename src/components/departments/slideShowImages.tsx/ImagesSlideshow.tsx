"use client";

import ImageFallback from "@/components/commons/ImageFallback";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ImageSlideshowProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ImagesSlideshow({
  images,
  autoPlay = true,
  interval = 5000,
}: ImageSlideshowProps) {
  const [current, setCurrent] = useState(0);

  const hasMultiple = images.length > 1;

  useEffect(() => {
    setCurrent(0);
  }, [images]);

  const prev = () => {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  };

  const next = () => {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  };

  useEffect(() => {
    if (!autoPlay || !hasMultiple) return;

    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, hasMultiple, interval]);

  if (!images.length) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
        <p className="text-gray-400 text-sm">No image</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, idx) => (
          <div key={idx} className="min-w-full h-full relative">
            <ImageFallback isFill src={src} imgStyle="object-cover" />
          </div>
        ))}
      </div>

      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
          >
            <FaChevronRight />
          </button>
        </>
      )}
    </div>
  );
}
