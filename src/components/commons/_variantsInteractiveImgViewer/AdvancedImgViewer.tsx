"use client";

import { useState } from "react";
import { FaRedo, FaSearchMinus, FaSearchPlus } from "react-icons/fa";

export default function InteractiveImgViewerV2({
  src,
  alt = "Loading...",
}: {
  src: string;
  alt?: string;
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({ x: clientX - start.x, y: clientY - start.y });
  };

  const handleEnd = () => setIsDragging(false);

  const zoomIn = () => setScale((s) => Math.min(s * 1.2, 5));
  const zoomOut = () => setScale((s) => Math.max(s / 1.2, 0.3));
  const reset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative flex flex-col gap-3 w-full max-w-6xl mx-auto">
      {/* TOOLBAR VARIAN KIRI */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 bg-white/90 backdrop-blur-md border border-neutral-200 p-2 rounded-3xl shadow-lg z-10">
        <button
          onClick={zoomIn}
          className="p-3 hover:bg-neutral-100 rounded-xl text-neutral-700 transition"
          title="Zoom In"
        >
          <FaSearchPlus size={16} />
        </button>
        <button
          onClick={zoomOut}
          className="p-3 hover:bg-neutral-100 rounded-xl text-neutral-700 transition"
          title="Zoom Out"
        >
          <FaSearchMinus size={16} />
        </button>
        <button
          onClick={reset}
          className="p-3 hover:bg-neutral-100 rounded-xl text-neutral-500 transition"
          title="Reset"
        >
          <FaRedo size={14} />
        </button>
      </div>

      {/* VIEWER FRAME */}
      <div
        className={`relative w-full overflow-hidden rounded-2xl border-2 border-white shadow-lg bg-neutral-50 touch-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        } aspect-video lg:aspect-auto lg:h-[55vh]`}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) =>
          handleStart(e.touches[0].clientX, e.touches[0].clientY)
        }
        onTouchMove={(e) =>
          handleMove(e.touches[0].clientX, e.touches[0].clientY)
        }
        onTouchEnd={handleEnd}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.25s ease-out",
          }}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-none w-auto h-auto max-h-[90%] object-contain select-none pointer-events-none"
            draggable={false}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/1200x800?text=Image+Not+Found";
            }}
          />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900/50 backdrop-blur-md text-white text-[9px] px-4 py-2 rounded-full pointer-events-none font-bold tracking-[0.1em] border border-white/10 uppercase">
          Drag • Pinch • Zoom
        </div>
      </div>
    </div>
  );
}
