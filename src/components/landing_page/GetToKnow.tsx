"use client";

import eventsThisMo from "@/lib/_dummy_db/_getToKnow/dummyFilteredEventListData.json";
import Image from "next/image";
import NoImg from "@/components/commons/NoImg";
import { useEffect, useState } from "react";
import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import Link from "next/link";
import truncate from "@/lib/truncated";

export default function GetToKnow() {
  const eventsThisMonth = eventsThisMo.slice(0, 5);

  // TODO: Use data fetching
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full flex flex-col items-center gap-8">
      <h1 className="font-averia text-4xl lg:text-6xl text-center">
        Get to Know: What&apos;s on HIMASAKTA
      </h1>

      <p className="font-libertine lg:text-xl text-center">
        Berbagai acara pada satu bulan terakhir yang diadakan di HIMASAKTA.
      </p>

      {loading ? (
        <SkeletonGrid
          withDesc
          className="grid-cols-2 grid-rows-2 lg:grid-cols-5 gap-24"
          count={5}
        />
      ) : (
        <div
          className="
            w-full
            grid grid-cols-2 gap-6
            lg:flex lg:flex-nowrap lg:gap-6
            lg:justify-center
            lg:overflow-x-auto
            lg:px-4
          "
        >
          {eventsThisMonth.length > 0 ? (
            eventsThisMonth.map((event, idx) => (
              <div
                key={event.idx || idx}
                className="
                  flex flex-col gap-2
                  w-full
                  lg:min-w-[280px] lg:max-w-[280px]
                "
              >
                {/* IMAGE */}
                <Link
                  href={event.url}
                  target="_blank"
                  className="group relative w-full aspect-square overflow-hidden rounded-xl"
                >
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <NoImg className="w-full h-full rounded-xl" />
                  )}
                </Link>

                {/* TITLE */}
                <Link href={event.url} target="_blank">
                  <h2 className="font-libertine text-lg font-bold hover:underline line-clamp-2">
                    {event.title}
                  </h2>
                </Link>

                {/* DESCRIPTION */}
                <Link href={event.url} target="_blank">
                  <p className="font-libertine text-sm text-gray-600 line-clamp-3 hover:text-gray-800 transition">
                    {truncate({ text: event.description })}
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <p className="w-full text-center bg-gray-200 px-20 py-20 rounded-lg">
              Belum ada acara bulan ini
            </p>
          )}
        </div>
      )}
    </section>
  );
}

// Question:
// 1. Whats on XX apakah static atau dinamic
// 2. Berbagai acara pada satu bulan terakhir yang diadakan di HIMASAKTA. apakah static atau dinamic
