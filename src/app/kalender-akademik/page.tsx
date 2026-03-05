"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { HiCalendar, HiClock } from "react-icons/hi";

import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import ButtonLink from "@/components/links/ButtonLink";
import Layout from "@/layouts/Layout";
import api from "@/lib/axios";

type CalendarItem = {
  id: string;
  title: string;
  type: "timeline" | "monthly_event";
  date: string;
  description?: string;
  link?: string;
  progenda_id?: string;
  progenda_name?: string;
};

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const DAYS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

function groupByMonth(items: CalendarItem[]) {
  const map = new Map<string, CalendarItem[]>();
  items
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((item: CalendarItem) => {
      const d = new Date(item.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
  return map;
}

function monthLabel(key: string) {
  const [year, monthIdx] = key.split("-");
  return `${MONTHS_ID[parseInt(monthIdx)]} ${year}`;
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function CalendarGrid({
  data,
  calMonth,
  calYear,
  setCalMonth,
  setCalYear,
  onDayClick,
}: {
  data: CalendarItem[];
  calMonth: number;
  calYear: number;
  setCalMonth: (m: number) => void;
  setCalYear: (y: number) => void;
  onDayClick?: (day: number) => void;
}) {
  const [tooltipCell, setTooltipCell] = useState<number | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = (day: number) => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setTooltipCell(day);
  };
  const scheduleHide = () => {
    hideTimeout.current = setTimeout(() => setTooltipCell(null), 150);
  };

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarItem[]>();
    data.forEach((item: CalendarItem) => {
      const d = new Date(item.date);
      if (d.getMonth() === calMonth && d.getFullYear() === calYear) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(item);
      }
    });
    return map;
  }, [data, calMonth, calYear]);

  const days = getCalendarDays(calYear, calMonth);
  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    calMonth === today.getMonth() &&
    calYear === today.getFullYear();

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else setCalMonth(calMonth + 1);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-visible">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primaryPink/5 to-transparent border-b rounded-t-3xl">
        <button
          onClick={prevMonth}
          className="p-2 rounded-xl hover:bg-pink-50 transition-all active:scale-95"
        >
          <FaChevronLeft size={14} className="text-gray-600" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 font-averia">
          {MONTHS_ID[calMonth]} {calYear}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-xl hover:bg-pink-50 transition-all active:scale-95"
        >
          <FaChevronRight size={14} className="text-gray-600" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b">
        {DAYS_ID.map((d) => (
          <div
            key={d}
            className="py-2.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const events = day ? eventsByDay.get(day) ?? [] : [];
          const hasEvents = events.length > 0;

          return (
            <div
              key={i}
              className={`
                                relative min-h-[72px] lg:min-h-[88px] p-1.5 border-b border-r transition-colors
                                ${!day ? "bg-gray-50/50" : ""}
                                ${day && isToday(day) ? "bg-pink-50/60" : ""}
                                ${hasEvents ? "cursor-pointer hover:bg-pink-50/40" : ""}
                            `}
              onMouseEnter={() => hasEvents && day && showTooltip(day)}
              onMouseLeave={scheduleHide}
              onClick={() => hasEvents && day && onDayClick?.(day)}
            >
              {day && (
                <>
                  <span
                    className={`
                                        text-sm font-medium block mb-1
                                        ${isToday(day) ? "bg-primaryPink text-white w-6 h-6 rounded-full flex items-center justify-center text-xs" : "text-gray-700 ml-1"}
                                    `}
                  >
                    {day}
                  </span>

                  {hasEvents && (
                    <div className="flex flex-wrap gap-0.5 px-0.5">
                      {events.slice(0, 4).map((ev, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${ev.type === "monthly_event" ? "bg-primaryPink" : "bg-blue-500"}`}
                        />
                      ))}
                      {events.length > 4 && (
                        <span className="text-[9px] text-gray-400 ml-0.5">
                          +{events.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {tooltipCell === day && hasEvents && (
                    <div
                      className="absolute z-50 left-1/2 -translate-x-1/2 top-full w-56 bg-white rounded-xl shadow-xl border p-3"
                      onMouseEnter={() => showTooltip(day)}
                      onMouseLeave={scheduleHide}
                    >
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        {day} {MONTHS_ID[calMonth]}
                      </p>
                      <div className="space-y-1.5">
                        {events.map((ev, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div
                              className={`w-2 h-2 rounded-full mt-1 shrink-0 ${ev.type === "monthly_event" ? "bg-primaryPink" : "bg-blue-500"}`}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">
                                {ev.title}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {ev.type === "monthly_event"
                                  ? "Event"
                                  : ev.progenda_name ?? "Timeline"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-6 py-3 bg-gray-50/50 border-t text-xs text-gray-500 rounded-b-3xl">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primaryPink" />
          <span>Event</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Timeline</span>
        </div>
      </div>
    </div>
  );
}

export default function KalenderAkademikPage() {
  const [data, setData] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());

  useEffect(() => {
    api
      .get("/kalender-akademik")
      .then((res) => setData(res.data.data ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const grouped = groupByMonth(data);

  return (
    <Layout withFooter withNavbar={false} transparentOnTop={false}>
      <main className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white">
        {/* HERO */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primaryPink via-primaryPink/90 to-primaryPink/80 pt-28 pb-16 lg:pt-36 lg:pb-24">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
              <HiCalendar className="text-white" size={18} />
              <span className="text-white/90 text-sm font-medium">
                Academic Calendar
              </span>
            </div>
            <h1 className="text-white text-4xl lg:text-6xl font-bold font-averia mb-4">
              Kalender Akademik
            </h1>
            <p className="text-white/80 text-lg lg:text-xl max-w-2xl mx-auto">
              Timeline kegiatan dan event bulanan HIMASAKTA
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <SkeletonPleaseWait />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20">
              <HiCalendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400 text-lg">
                Belum ada data kalender akademik.
              </p>
            </div>
          ) : (
            <>
              {/* CALENDAR GRID */}
              <section className="mb-16">
                <CalendarGrid
                  data={data}
                  calMonth={calMonth}
                  calYear={calYear}
                  setCalMonth={setCalMonth}
                  setCalYear={setCalYear}
                  onDayClick={(day) => {
                    const dateStr = `${calYear}-${String(calMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const el = document.getElementById(`cal-day-${dateStr}`);
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                      el.classList.add(
                        "ring-2",
                        "ring-primaryPink",
                        "ring-offset-2",
                      );
                      setTimeout(
                        () =>
                          el.classList.remove(
                            "ring-2",
                            "ring-primaryPink",
                            "ring-offset-2",
                          ),
                        2000,
                      );
                    }
                  }}
                />
              </section>

              {/* EVENTS LIST */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <HiCalendar className="text-primaryPink" size={22} />
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 font-averia">
                    Daftar Kegiatan
                  </h2>
                </div>

                <div className="space-y-16">
                  {Array.from(grouped.entries()).map(([monthKey, items]) => (
                    <div key={monthKey}>
                      {/* Month Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-primaryPink/10 to-transparent rounded-2xl px-5 py-3">
                          <h3 className="text-lg font-bold text-gray-900 font-averia">
                            {monthLabel(monthKey)}
                          </h3>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-primaryPink/20 to-transparent" />
                        <span className="text-sm text-gray-400 font-medium">
                          {items.length} item
                        </span>
                      </div>

                      {/* Timeline */}
                      <div className="relative pl-8 lg:pl-12">
                        <div className="absolute left-3 lg:left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primaryPink/40 via-primaryPink/20 to-transparent rounded-full" />

                        <div className="space-y-4">
                          {items.map((item) => {
                            const isEvent = item.type === "monthly_event";
                            const hasLink =
                              !!item.link && item.link.startsWith("http");
                            const isHovered = hoveredId === item.id;

                            const dateKey = `${new Date(item.date).getFullYear()}-${String(new Date(item.date).getMonth()).padStart(2, "0")}-${String(new Date(item.date).getDate()).padStart(2, "0")}`;

                            const content = (
                              <div
                                id={`cal-day-${dateKey}`}
                                className={`
                                  relative group rounded-2xl border p-5 transition-all duration-300
                                  ${
                                    isEvent
                                      ? "bg-gradient-to-r from-pink-50 to-white border-pink-200/60 hover:border-primaryPink/50 hover:shadow-lg hover:shadow-pink-100/50"
                                      : "bg-white border-gray-200/80 hover:border-gray-300 hover:shadow-md"
                                  }
                                  ${hasLink ? "cursor-pointer" : ""}
                                `}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                              >
                                <div
                                  className={`
                                    absolute -left-[29px] lg:-left-[37px] top-6 w-3.5 h-3.5 rounded-full border-[3px] transition-all duration-300
                                    ${
                                      isEvent
                                        ? "border-primaryPink bg-pink-100 group-hover:bg-primaryPink group-hover:scale-125"
                                        : "border-gray-400 bg-white group-hover:border-primaryPink group-hover:scale-125"
                                    }
                                  `}
                                />

                                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                  <div className="flex items-center gap-2 shrink-0">
                                    <HiClock
                                      className="text-gray-400"
                                      size={14}
                                    />
                                    <span className="text-sm font-medium text-gray-500">
                                      {formatDate(item.date)}
                                    </span>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="font-semibold text-gray-900 text-base">
                                        {item.title}
                                      </h3>
                                      <span
                                        className={`
                                          inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide
                                          ${isEvent ? "bg-primaryPink/10 text-primaryPink" : "bg-blue-50 text-blue-600"}
                                        `}
                                      >
                                        {isEvent ? "Event" : "Timeline"}
                                      </span>
                                      {hasLink && (
                                        <FaExternalLinkAlt
                                          size={11}
                                          className={`text-gray-300 transition-colors ${isHovered ? "text-primaryPink" : ""}`}
                                        />
                                      )}
                                    </div>

                                    {item.progenda_name && (
                                      <p className="text-sm text-gray-400 mt-1">
                                        Progenda:{" "}
                                        <span className="text-gray-600">
                                          {item.progenda_name}
                                        </span>
                                      </p>
                                    )}

                                    {isHovered && item.description && (
                                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );

                            return hasLink ? (
                              <a
                                key={item.id}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                {content}
                              </a>
                            ) : (
                              <div key={item.id}>{content}</div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Back */}
          <div className="mt-16">
            <ButtonLink
              href="/"
              className="w-28 flex gap-4 items-center"
              variant="black"
            >
              <FaChevronLeft className="hover:text-primaryGreen transition-all duration-300" />
              <p>Home</p>
            </ButtonLink>
          </div>
        </div>
      </main>
    </Layout>
  );
}
