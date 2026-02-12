import ImageFallback from "@/components/commons/ImageFallback";
import DeptInfoAll from "@/lib/_dummy_db/_departemen/dummyDepartemenAll.json";
import Link from "next/link";
import { FaBuilding, FaChevronRight } from "react-icons/fa";

export default function DeptCard({ dept }: { dept: (typeof DeptInfoAll)[0] }) {
  return (
    <Link href={`/departments/${dept.id}`} className="block">
      <div className="relative w-full h-[100px] rounded-xl overflow-hidden shadow-md group">
        {/* IMAGE WITH CUSTOM FALLBACK INTEGRATED */}
        <ImageFallback
          src={dept.image}
          alt={dept.name}
          isFill
          imgStyle="group-hover:none"
          fallback={
            <div className="absolute inset-0 flex items-center justify-center gap-4 bg-gray-300 text-white text-2xl lg:text-4xl">
              <FaBuilding />
              <h1 className="font-averia">{dept.name}</h1>
            </div>
          }
        />

        <div className="absolute inset-0 bg-gradient-to-l from-primaryPink/80 via-primaryPink/40 to-transparent opacity-100 pointer-events-none" />

        <div className="absolute inset-0 bg-gradient-to-l from-primaryPink/100 via-primaryPink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Chevron icon */}
        <FaChevronRight
          className="
            absolute right-6 top-1/2 -translate-y-1/2
            text-white text-2xl
            opacity-0 translate-x-2
            /* Trigger muncul saat card di-hover */
            group-hover:opacity-100 group-hover:translate-x-0
            /* Perubahan warna saat icon itu sendiri di-hover */
            hover:text-primaryGreen 
            transition-all duration-300
            z-20
          "
        />

        {/* Active state */}
        <div className="absolute inset-0 opacity-0 bg-black/20 group-active:opacity-100 transition-opacity" />

        {/* Text */}
        <div className="relative z-10 flex items-center justify-end p-4 text-white font-bold font-averia h-full text-2xl group-hover:translate-x-[-40px] transition-transform duration-300">
          {dept.name}
        </div>
      </div>
    </Link>
  );
}
