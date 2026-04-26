import { ProgendaType } from "@/types/data/ProgendaType";
import Link from "next/link";

interface TimelineCompProps {
  timeline: ProgendaType["timelines"];
}

function DesktopComp({ timeline }: TimelineCompProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <p className="text-center text-gray-500 max-lg:hidden">
        Tidak ada timeline yang tersedia.
      </p>
    );
  }

  return (
    <div className="[@media(max-width:1023px)_and_(orientation:landscape)]:hidden portrait:hidden relative flex justify-between items-start w-full">
      {/* The Line: Adjusted to start/end at 50% of the first/last column width */}
      <div
        className={`absolute top-6 h-1 bg-gray-200 z-0 ${timeline.length > 4 ? "lg:right-0 lg:left-0" : "lg:right-[12%] lg:left-[12%]"}`}
      />

      <div className="flex items-center w-full justify-center">
        <ul
          className={`flex justify-between items-start list-none ${timeline.length > 4 ? "lg:w-full" : "lg:w-[80%]"}`}
        >
          {timeline.map((item) => (
            <li className="relative flex items-center flex-col gap-6">
              {/* Node */}
              <div className="w-12 h-12 rounded-full bg-gray-300 mb-2 z-20" />
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DesktopComp;
