"use client";

import { Department } from "@/types";
import Link from "next/link";
import { FaBuilding } from "react-icons/fa";

export function DepartmentList({ departments }: { departments: Department[] }) {
  return (
    <section id="departments" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">
            Struktur Organisasi
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
            Departemen Kami
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Link
              href={`/department/${dept.name}`}
              key={dept.id}
              className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 block"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors overflow-hidden">
                {dept.logo?.image_url ? (
                  <img
                    src={dept.logo.image_url}
                    alt={dept.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <FaBuilding className="text-primary text-2xl" />
                )}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                {dept.name}
              </h4>
              <p className="text-slate-500 line-clamp-2 text-sm">
                {dept.description || "Deskripsi departemen HIMASAKTA ITS."}
              </p>
              <div className="mt-6 flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                Lihat Detail &rarr;
              </div>
            </Link>
          ))}

          {/* Skeleton/Loading State or Empty State handling could go here */}
          {departments.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-10">
              Belum ada data departemen.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
