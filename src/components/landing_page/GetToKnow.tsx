"use client";

import eventsThisMo from "@/lib/_dummy_db/_getToKnow/dummyFilteredEventListData.json";
import { useEffect, useState } from "react";
import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import Link from "next/link";
import truncate from "@/lib/truncated";
import ImageFallback from "../commons/ImageFallback";
import { FiExternalLink } from "react-icons/fi";

export default function GetToKnow() {
  const eventsThisMonth = eventsThisMo.slice(0, 5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="w-full flex flex-col items-center gap-8 px-4 lg:px-0"
      id="kegiatan-section"
    >
      <div className="space-y-2 text-center">
        <h1 className="font-averia text-4xl lg:text-6xl">
          Get to Know: What&apos;s on HIMASAKTA
        </h1>
        <p className="font-libertine lg:text-xl text-gray-600">
          Berbagai acara pada satu bulan terakhir yang diadakan di HIMASAKTA.
        </p>
      </div>

      {loading ? (
        <SkeletonGrid
          withDesc
          className="grid grid-cols-2 lg:grid-cols-5 gap-6 w-full"
          count={5}
        />
      ) : (
        <div className="w-full grid grid-cols-2 gap-6 lg:flex lg:flex-nowrap lg:justify-center lg:overflow-x-auto pb-4">
          {eventsThisMonth.length > 0 ? (
            eventsThisMonth.map((event, idx) => (
              <div
                key={event.idx || idx}
                className="flex flex-col gap-3 w-full lg:min-w-[280px] lg:max-w-[280px]"
              >
                <Link
                  href={event.url}
                  target="_blank"
                  className="group relative w-full aspect-square overflow-hidden rounded-xl bg-gray-100"
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10" />
                  <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="flex items-center gap-2 text-white font-inter font-bold transition-colors duration-300 hover:text-[#4ade80]">
                      {" "}
                      <span>View detail</span>
                      <FiExternalLink className="w-5 h-5" />
                    </div>
                  </div>

                  <ImageFallback isFill src={event.image} alt={event.title} />
                </Link>

                {/* Text */}
                <div className="space-y-1">
                  <Link href={event.url} target="_blank" className="block">
                    <h2 className="font-libertine text-lg font-bold hover:text-primaryGreen transition-colors line-clamp-2 leading-tight">
                      {event.title}
                    </h2>
                  </Link>
                  <p className="font-libertine text-sm text-gray-600 line-clamp-3">
                    {truncate({ text: event.description })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">Belum ada acara bulan ini</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
