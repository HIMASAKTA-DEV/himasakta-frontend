"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaSearchMinus,
  FaSearchPlus,
} from "react-icons/fa";

export default function InteractiveImgViewerV2({
  src,
  alt = "Loading...",
}: {
  src: string;
  alt?: string;
}) {
  const [scale, setScale] = useState(0.3);
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 35 });

  const LIM_ZOOMIN = 5;
  const LIM_ZOOMOUT = 0.2;
  const LIMITPX = 1000;
  const STEPPX = 30;

  const isMaxZoom = scale >= LIM_ZOOMIN;
  const isMinZoom = scale <= LIM_ZOOMOUT;

  const zoomIn = () => setScale((s) => Math.min(s * 1.2, LIM_ZOOMIN));
  const zoomOut = () => setScale((s) => Math.max(s / 1.2, LIM_ZOOMOUT));

  useEffect(() => {
    setShowZoom(true);
    const timer = setTimeout(() => setShowZoom(false), 1000);
    return () => clearTimeout(timer);
  }, [scale]);

  const move = {
    left: () =>
      setPosition((p) => ({ ...p, x: Math.min(p.x + STEPPX, LIMITPX) })),
    right: () =>
      setPosition((p) => ({ ...p, x: Math.max(p.x - STEPPX, -LIMITPX) })),
    up: () =>
      setPosition((p) => ({ ...p, y: Math.min(p.y + STEPPX, LIMITPX) })),
    down: () =>
      setPosition((p) => ({ ...p, y: Math.max(p.y - STEPPX, -LIMITPX) })),
  };

  const btnStyle =
    "p-2 size-8 sm:size-10 lg:size-12 transition-all duration-300 rounded-full";

  return (
    <section className="flex items-center justify-center w-full overflow-hidden">
      <div className="w-[95vw] sm:w-[85vw] aspect-video max-w-[1200px] bg-neutral-200 flex flex-col justify-start items-center rounded-md relative shadow-lg overflow-hidden">
        {/* Toolbar - Made Responsive */}
        <div className="w-full bg-gray-100/90 backdrop-blur-md py-1 px-2 lg:px-16 lg:h-[75px] rounded-t-md absolute flex items-center justify-between z-50 shadow-md">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Horizontal Controls */}
            <div className="flex items-center border-r border-slate-300 pr-1 sm:pr-4">
              <button onClick={move.left} disabled={position.x === LIMITPX}>
                <FaChevronLeft
                  className={clsx(
                    btnStyle,
                    position.x === LIMITPX
                      ? "text-gray-400"
                      : "hover:bg-slate-300",
                  )}
                />
              </button>
              <button onClick={move.right} disabled={position.x === -LIMITPX}>
                <FaChevronRight
                  className={clsx(
                    btnStyle,
                    position.x === -LIMITPX
                      ? "text-gray-400"
                      : "hover:bg-slate-300",
                  )}
                />
              </button>
            </div>

            {/* Vertical Controls */}
            <div className="flex items-center">
              <button onClick={move.up} disabled={position.y === LIMITPX}>
                <FaChevronUp
                  className={clsx(
                    btnStyle,
                    position.y === LIMITPX
                      ? "text-gray-400"
                      : "hover:bg-slate-300",
                  )}
                />
              </button>
              <button onClick={move.down} disabled={position.y === -LIMITPX}>
                <FaChevronDown
                  className={clsx(
                    btnStyle,
                    position.y === -LIMITPX
                      ? "text-gray-400"
                      : "hover:bg-slate-300",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 sm:gap-4">
            <p
              className={clsx(
                "text-xs lg:text-base transition-opacity duration-500",
                showZoom || isMaxZoom || isMinZoom
                  ? "opacity-100"
                  : "opacity-0",
                isMaxZoom || isMinZoom ? "text-red-500" : "text-black",
              )}
            >
              Zoom: {scale.toFixed(1)}x
            </p>
            <button onClick={zoomIn} disabled={isMaxZoom}>
              <FaSearchPlus
                className={clsx(
                  btnStyle,
                  isMaxZoom ? "text-gray-400" : "hover:bg-slate-300",
                )}
              />
            </button>
            <button onClick={zoomOut} disabled={isMinZoom}>
              <FaSearchMinus
                className={clsx(
                  btnStyle,
                  isMinZoom ? "text-gray-400" : "hover:bg-slate-300",
                )}
              />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 w-full overflow-hidden flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: "transform 0.15s ease-out",
            }}
            className="select-none max-w-none max-h-none"
          />
        </div>
      </div>
    </section>
  );
}
