"use client";

import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import eventsThisMo from "@/lib/_dummy_db/_getToKnow/dummyFilteredEventListData.json";
import truncate from "@/lib/truncated";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import ImageFallback from "../commons/ImageFallback";
import { MonthlyEvent } from "@/types/data/GetToKnow";
import { getEventThisMonth } from "@/services/landing_page/GetToKnow";

export default function GetToKnow() {
  // const eventsThisMonth = eventsThisMo.slice(0, 5);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<MonthlyEvent[] | []>([]);

  useEffect(() => {
    // fetch event this month
    const fetchEvThisMonth = async () => {
      try {
        const data = await getEventThisMonth();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load event this month ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvThisMonth();
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 1000);
  //   return () => clearTimeout(timer);
  // }, []);

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
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-3 w-full lg:min-w-[280px] lg:max-w-[280px]"
              >
                <Link
                  href={event.link}
                  target="_blank"
                  className="group relative w-full aspect-square overflow-hidden rounded-xl bg-gray-100"
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10" />
                  <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="flex items-center gap-2 text-white font-inter font-bold hover:text-[#4ade80]">
                      <span>View detail</span>
                      <FiExternalLink className="w-5 h-5" />
                    </div>
                  </div>

                  <ImageFallback
                    isFill
                    src={event.thumbnail?.image_url}
                    alt={event.title}
                  />
                </Link>

                <div className="space-y-1">
                  <Link href={event.link} target="_blank">
                    <h2 className="font-libertine text-lg font-bold hover:text-primaryGreen line-clamp-2">
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
            <div className="w-full text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
              <p className="text-gray-500">Belum ada acara bulan ini</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
