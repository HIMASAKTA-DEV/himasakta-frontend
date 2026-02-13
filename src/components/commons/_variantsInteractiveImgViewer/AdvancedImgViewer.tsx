"use client";

import clsx from "clsx";
import React, { useState, useEffect } from "react";
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

  type Position = {
    x: number;
    y: number;
  };
  const [position, setPosition] = useState<Position>({ x: 0, y: 35 });

  const LIM_ZOOMIN = 5;
  const LIM_ZOOMOUT = 0.2;

  // Use >= and <= for floating point safety
  const isMaxZoom = scale >= LIM_ZOOMIN;
  const isMinZoom = scale <= LIM_ZOOMOUT;

  const zoomIn = () => setScale((s) => Math.min(s * 1.2, LIM_ZOOMIN));
  const zoomOut = () => setScale((s) => Math.max(s / 1.2, LIM_ZOOMOUT));

  // Logic to show zoom text on change and hide after 2 seconds
  useEffect(() => {
    setShowZoom(true);
    const timer = setTimeout(() => setShowZoom(false), 1000);
    return () => clearTimeout(timer);
  }, [scale]);

  const LIMITPX = 1000;
  const STEPPX = 30;

  class MoveImg {
    private setPosition: React.Dispatch<React.SetStateAction<Position>>;
    constructor(setPosition: React.Dispatch<React.SetStateAction<Position>>) {
      this.setPosition = setPosition;
    }
    left() {
      this.setPosition((prev) => ({
        x: Math.min(prev.x + STEPPX, LIMITPX),
        y: prev.y,
      }));
    }
    right() {
      this.setPosition((prev) => ({
        x: Math.max(prev.x - STEPPX, -LIMITPX),
        y: prev.y,
      }));
    }
    up() {
      this.setPosition((prev) => ({
        x: prev.x,
        y: Math.min(prev.y + STEPPX, LIMITPX),
      }));
    }
    down() {
      this.setPosition((prev) => ({
        x: prev.x,
        y: Math.max(prev.y - STEPPX, -LIMITPX),
      }));
    }
  }

  const move = new MoveImg(setPosition);

  return (
    <section className="flex items-center justify-center">
      <div className="w-[85vw] aspect-video max-w-[1200px] bg-neutral-200 flex flex-col justify-start items-center rounded-md relative shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Toolbar */}
        <div className="w-full bg-gray-100/85 backdrop-blur-md py-1 lg:h-[75px] rounded-t-md absolute flex items-center justify-between z-50 shadow-md">
          <div className="flex items-center justify-center">
            {/* Horizontal Controls */}
            <div className="flex items-center gap-4 lg:gap-6 ml-16 border-r-[1px] border-slate-300 pr-8">
              <button onClick={() => move.left()}>
                <FaChevronLeft
                  className={clsx(
                    "p-[10px] size-10 lg:size-12 transition-all duration-300 rounded-full",
                    position.x === LIMITPX
                      ? "text-gray-400 cursor-default"
                      : "hover:bg-slate-300 active:bg-slate-400",
                  )}
                />
              </button>
              <button onClick={() => move.right()}>
                <FaChevronRight
                  className={clsx(
                    "p-[10px] size-10 lg:size-12 transition-all duration-300 rounded-full",
                    position.x === -LIMITPX
                      ? "text-gray-400 cursor-default"
                      : "hover:bg-slate-300 active:bg-slate-400",
                  )}
                />
              </button>
            </div>

            {/* Vertical Controls */}
            <div className="flex items-center gap-4 lg:gap-6 ml-8 py-2">
              <button onClick={() => move.up()}>
                <FaChevronUp
                  className={clsx(
                    "p-[10px] size-10 lg:size-12 transition-all duration-300 rounded-full",
                    position.y === LIMITPX
                      ? "text-gray-400 cursor-default"
                      : "hover:bg-slate-300 active:bg-slate-400",
                  )}
                />
              </button>
              <button onClick={() => move.down()}>
                <FaChevronDown
                  className={clsx(
                    "p-[10px] size-10 lg:size-12 transition-all duration-300 rounded-full",
                    position.y === -LIMITPX
                      ? "text-gray-400 cursor-default"
                      : "hover:bg-slate-300 active:bg-slate-400",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Zoom Controls & Dynamic Indicator */}
          <div className="flex items-center justify-center mr-8 gap-4">
            <p
              className={clsx(
                "transition-all duration-500 ease-in-out",
                showZoom || isMaxZoom || isMinZoom
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none",
                isMaxZoom || isMinZoom ? "text-red-500" : "text-black",
              )}
            >
              Zoom: <span>{scale.toFixed(2)}x</span>
            </p>

            <button onClick={zoomIn}>
              <FaSearchPlus
                className={clsx(
                  "p-[10px] size-10 lg:size-12 transition-all duration-300 rounded-full",
                  isMaxZoom
                    ? "text-gray-400 cursor-default"
                    : "hover:bg-slate-300 active:bg-slate-400",
                )}
              />
            </button>
            <button onClick={zoomOut}>
              <FaSearchMinus
                className={clsx(
                  "p-[10px] size-10 lg:size-12 transition-all duration-300 rounded-full",
                  isMinZoom
                    ? "text-gray-400 cursor-default"
                    : "hover:bg-slate-300 active:bg-slate-400",
                )}
              />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 w-full overflow-hidden flex items-center justify-center rounded-md">
          <img
            src={src}
            alt={alt}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: "transform 0.15s ease-out",
            }}
            className="select-none max-w-none max-h-none shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
