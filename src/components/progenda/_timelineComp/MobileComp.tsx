import { ProgendaType } from "@/types/data/ProgendaType";
import Link from "next/link";
import React from "react";

interface TimelineCompProps {
  timeline: ProgendaType["timelines"];
}

function MobileComp({ timeline }: TimelineCompProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Tidak ada timeline yang tersedia.
      </p>
    );
  }
  return (
    <section className="lg:hidden flex items-center justify-center w-full">
      <div className="w-[90%]">
        <ul>
          {timeline.map((item, idx) => (
            <li className="relative flex gap-6" key={item.id}>
              <div
                className={`before:absolute before:left-[7px] before:h-full ${idx === timeline.length - 1 ? "before:w-[0px]" : "before:w-[2px]"} before:bg-gray-300`}
              >
                <div className="rounded-full bg-gray-300 w-4 h-4" />
              </div>
              <div className="flex gap-2 flex-col pb-6">
                <span className="text-sm text-gray-600 mb-1">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : ""}
                </span>
                {/* Info */}
                <span className="text-sm font-medium">{item.info}</span>

                {/* Optional link */}
                {item.link && (
                  <Link
                    href={item.link}
                    target="_blank"
                    className="text-primaryPink hover:underline mt-1 text-xs"
                  >
                    Open
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default MobileComp;
