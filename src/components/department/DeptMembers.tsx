"use client";

import { Member } from "@/types";
import { FaUser } from "react-icons/fa";

export function DeptMembers({ members }: { members: Member[] }) {
  if (!members || members.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">
            Struktur Organisasi
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
            Anggota Departemen
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="group bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-xl transition-all duration-300 text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm transition-transform duration-500 group-hover:scale-110">
                {member.photo?.image_url ? (
                  <img
                    src={member.photo.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-primary/40 text-3xl" />
                )}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                {member.name}
              </h4>
              <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-3">
                {member.role.name}
              </p>
              <p className="text-slate-400 text-xs font-medium">
                NRP. {member.nrp}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
