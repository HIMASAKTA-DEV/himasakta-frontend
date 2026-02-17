import { Progenda } from "@/types";
import Link from "next/link";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";

export function DeptProgenda({ progendas }: { progendas: Progenda[] }) {
  if (!progendas || progendas.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-primary rounded-full"></span>
          Program Kerja & Agenda
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progendas.map((item) => (
            <Link
              href={`/progenda/${item.id}`}
              key={item.id}
              className="bg-slate-50 border border-slate-100 rounded-xl p-6 hover:shadow-lg transition-all group block"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                {item.website_link && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(item.website_link, "_blank");
                    }}
                    className="text-slate-400 hover:text-primary transition-colors cursor-pointer z-10 relative bg-transparent border-0 p-0"
                  >
                    <FaExternalLinkAlt />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 mb-4">
                {item.timelines?.map((timeline) => (
                  <div
                    key={timeline.id}
                    className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1 rounded-md w-fit shadow-sm"
                  >
                    <FaCalendarAlt className="text-primary" />
                    <span>
                      {new Date(timeline.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      - {timeline.info}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-slate-600 mb-4 line-clamp-3">
                {item.description}
              </p>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-900 mb-1">
                  Tujuan:
                </p>
                <p className="text-sm text-slate-500 italic">"{item.goal}"</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
