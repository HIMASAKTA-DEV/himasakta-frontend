"use client";

import { MonthlyEvent } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function EventList({ events }: { events: MonthlyEvent[] }) {
    if (!events || events.length === 0) return null;

    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl -z-10"></div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-2">Agenda Bulan Ini</h2>
                        <h3 className="text-3xl md:text-4xl font-bold">Get To Know</h3>
                    </div>
                    <div className="h-px bg-slate-700 flex-1 ml-8 hidden md:block opacity-50"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="group relative">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-800 relative shadow-lg">
                                {event.thumbnail_url ? (
                                    <Image
                                        src={event.thumbnail_url}
                                        alt={event.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                                        No Image
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <div className="text-accent font-bold text-sm mb-2">
                                        {format(new Date(), "MMMM yyyy", { locale: id })}
                                    </div>
                                    <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h4>
                                    <p className="text-slate-300 text-sm line-clamp-2 mb-4">
                                        {event.description}
                                    </p>
                                    <Link
                                        href={event.link}
                                        target="_blank"
                                        className="inline-flex items-center text-sm font-semibold text-white border-b border-primary pb-1 hover:text-primary transition-colors"
                                    >
                                        Selengkapnya
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
