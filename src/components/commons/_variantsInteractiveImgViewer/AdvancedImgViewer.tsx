"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [showZoom, setShowZoom] = useState(false);

  const [canScroll, setCanScroll] = useState({
    left: false,
    right: false,
    up: false,
    down: false,
  });

  const LIM_ZOOMIN = 5;
  const LIM_ZOOMOUT = 1;
  const STEPPX = 80;

  const isMaxZoom = scale >= LIM_ZOOMIN;
  const isMinZoom = scale <= LIM_ZOOMOUT;
  const isScrollable = scale > 1;

  const zoomIn = () => setScale((s) => Math.min(s * 1.2, LIM_ZOOMIN));
  const zoomOut = () => setScale((s) => Math.max(s / 1.2, LIM_ZOOMOUT));

  useEffect(() => {
    setShowZoom(true);
    const t = setTimeout(() => setShowZoom(false), 1000);
    return () => clearTimeout(t);
  }, [scale]);

  const updateScrollState = () => {
    const el = containerRef.current;
    if (!el || !isScrollable) {
      setCanScroll({ left: false, right: false, up: false, down: false });
      return;
    }

    setCanScroll({
      left: el.scrollLeft > 0,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      up: el.scrollTop > 0,
      down: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
    });
  };

  useEffect(() => {
    updateScrollState();
  }, [scale]);

  const pan = (dx: number, dy: number) => {
    const el = containerRef.current;
    if (!el || !isScrollable) return;
    el.scrollBy({ left: dx, top: dy, behavior: "smooth" });
  };

  const iconClass = (enabled: boolean) =>
    clsx(
      "p-2 size-8 sm:size-10 lg:size-12 rounded-full transition-all",
      enabled
        ? "hover:bg-slate-300 text-gray-800"
        : "text-gray-400 opacity-40 cursor-not-allowed",
    );

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[85vw] lg:w-[95vw] aspect-video max-w-[1200px] bg-neutral-200 rounded-md shadow-lg overflow-hidden">
        <div className="grid grid-rows-[auto_1fr] w-full h-full">
          {/* Toolbar */}
          <div className="w-full bg-gray-100/90 backdrop-blur-md py-1 px-2 lg:px-16 lg:h-[75px] flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center border-r border-slate-300 pr-1 sm:pr-4">
                <button
                  onClick={() => pan(-STEPPX, 0)}
                  disabled={!canScroll.left}
                >
                  <FaChevronLeft className={iconClass(canScroll.left)} />
                </button>
                <button
                  onClick={() => pan(STEPPX, 0)}
                  disabled={!canScroll.right}
                >
                  <FaChevronRight className={iconClass(canScroll.right)} />
                </button>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => pan(0, -STEPPX)}
                  disabled={!canScroll.up}
                >
                  <FaChevronUp className={iconClass(canScroll.up)} />
                </button>
                <button
                  onClick={() => pan(0, STEPPX)}
                  disabled={!canScroll.down}
                >
                  <FaChevronDown className={iconClass(canScroll.down)} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isMaxZoom || isMinZoom ? (
                <p className="text-xs lg:text-base text-red-500">
                  Zoom: {scale.toFixed(2)}x
                </p>
              ) : (
                <p
                  className={clsx(
                    "text-xs lg:text-base transition-opacity",
                    showZoom ? "opacity-100" : "opacity-0",
                  )}
                >
                  Zoom: {scale.toFixed(2)}x
                </p>
              )}

              <button onClick={zoomIn} disabled={isMaxZoom}>
                <FaSearchPlus
                  className={clsx(
                    "p-2 size-8 sm:size-10 lg:size-12 rounded-full",
                    isMaxZoom
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-slate-300",
                  )}
                />
              </button>

              <button onClick={zoomOut} disabled={isMinZoom}>
                <FaSearchMinus
                  className={clsx(
                    "p-2 size-8 sm:size-10 lg:size-12 rounded-full",
                    isMinZoom
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-slate-300",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Scroller */}
          <div
            ref={containerRef}
            onScroll={updateScrollState}
            className={clsx(
              "relative w-full h-full bg-black/5",
              isScrollable ? "overflow-auto" : "overflow-hidden",
            )}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="block select-none max-w-none transition-all duration-300"
              style={{
                width: `${scale * 100}%`,
                height: "auto",
              }}
              onLoad={updateScrollState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
