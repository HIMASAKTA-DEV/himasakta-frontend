"use client";

import clsx from "clsx";
import { useState } from "react";
import {
  FaDownload,
  FaRedo,
  FaSearchMinus,
  FaSearchPlus,
} from "react-icons/fa";

export default function InteractiveImgViewer({
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

  const zoomIn = () => setScale((s) => Math.min(s + 0.5, 4));
  const zoomOut = () => setScale((s) => Math.max(s - 0.5, 0.5));
  const reset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-6xl mx-auto">
      {/* TOOLBAR */}
      <div className="flex gap-2 justify-end items-center px-2">
        <span className="hidden sm:block text-[10px] font-bold text-neutral-400 mr-2 uppercase tracking-[0.2em]">
          Tools
        </span>
        <div className="flex bg-white/90 backdrop-blur-md border border-neutral-200 p-1 rounded-2xl shadow-sm">
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = src;
              link.download = "Organigram_HIMASAKTA.jpg";
              link.click();
            }}
            className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-600"
            title="Download"
          >
            <FaDownload size={14} />
          </button>
          <div className="w-px h-4 bg-neutral-200 my-auto mx-1" />
          <button
            onClick={zoomOut}
            className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-600"
          >
            <FaSearchMinus size={14} />
          </button>
          <button
            onClick={zoomIn}
            className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-600"
          >
            <FaSearchPlus size={14} />
          </button>
          <button
            onClick={reset}
            className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-500"
          >
            <FaRedo size={12} />
          </button>
        </div>
      </div>

      {/* VIEWER FRAME */}
      <div
        className={clsx(
          "relative w-full overflow-hidden rounded-[1.5rem] border-2 border-white shadow-lg hover:shadow-xl bg-neutral-50 touch-none transition-all duration-300",
          // Aspect ratio 16:9 on mobile
          "aspect-video lg:aspect-auto lg:h-[55vh]",
          "ring-1 ring-neutral-200",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
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
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#000 0.5px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging
              ? "none"
              : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
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

        {/* INSTRUCTION OVERLAY */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900/50 backdrop-blur-md text-white text-[8px] px-4 py-2 rounded-full pointer-events-none font-bold tracking-[0.15em] border border-white/10 uppercase">
          Drag to Pan • Zoom for Detail
        </div>
      </div>
    </div>
  );
}
