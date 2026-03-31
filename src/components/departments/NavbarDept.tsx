"use client";

import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { DepartmentType } from "@/types/data/DepartmentType";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import { FaChevronLeft, FaSearch } from "react-icons/fa";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";
import ButtonLink from "../links/ButtonLink";
import clsxm from "@/lib/clsxm";

export default function NavbarDept({ className }: { className?: string }) {
  const [deptName, setDeptName] = useState<DepartmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const activeRef = useRef<HTMLLIElement | null>(null);

  // Kita ambil limit yang cukup besar (misal 50) agar semua dept masuk dalam satu barisan scroll
  const fetchAllDept = async () => {
    try {
      setLoading(true);
      const json = await GetAllDepts(1, 50);
      setDeptName(json.data ?? []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDept();
  }, []);

  const pathname = usePathname();
  const activeDeptSlug = decodeURIComponent(pathname.split("/").pop() ?? "");
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState("");

  const filteredDept = useMemo(() => {
    if (!keyword.trim()) return deptName;
    return deptName.filter((d) =>
      d.name?.toLowerCase().includes(keyword.toLowerCase()),
    );
  }, [deptName, keyword]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center", // ini penting biar ke tengah
        block: "nearest",
      });
    }
  }, [activeDeptSlug, filteredDept]);

  if (error)
    return (
      <nav className="bg-white p-4 rounded-full shadow text-red-500 text-center">
        Gagal memuat data
      </nav>
    );
  if (loading)
    return (
      <nav className="bg-white rounded-full shadow flex justify-start ring-1 ring-primaryPink/50 p-1">
        <ButtonLink
          href="/"
          className="flex items-center gap-2 lg:px-4 py-2 rounded-full shrink-0"
          variant="black"
        >
          <FaChevronLeft />
          <span className="text-sm max-lg:hidden">Home</span>
        </ButtonLink>
        <div className="w-full flex items-center justify-center">
          <SkeletonPleaseWait />
        </div>
      </nav>
    );

  return (
    <nav
      className={clsxm(
        "sticky top-8 w-full bg-white/80 backdrop-blur-2xl shadow-md rounded-full ring-1 ring-primaryPink/50 z-[600]",
        className,
      )}
    >
      <div className="flex items-center py-1 pr-1 pl-1 gap-2">
        {/* HOME BUTTON */}
        <ButtonLink
          href="/"
          className="flex items-center gap-2 lg:px-4 py-2 rounded-full shrink-0"
          variant="black"
        >
          <FaChevronLeft />
          <span className="text-sm max-lg:hidden">Home</span>
        </ButtonLink>

        {/* SCROLLABLE NAV */}
        <div
          className="flex-1 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-proximity overflow-y-hidden rounded-full"
          data-lenis-prevent
        >
          <ul className="flex items-center min-w-full w-max gap-2 list-none m-0 p-1">
            {filteredDept.map((d, idx) => {
              const isActive = activeDeptSlug === d.slug;
              return (
                <li
                  key={d.id ?? idx}
                  ref={isActive ? activeRef : null}
                  className="snap-start lg:min-w-[16.666%]"
                >
                  <Link
                    href={`/departments/${d.slug}`}
                    className={`
                  block text-center whitespace-nowrap py-2 px-6 rounded-full text-sm transition-all duration-300
                  ${
                    isActive
                      ? "bg-primaryPink text-white font-bold shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-primaryPink"
                  }
                `}
                  >
                    {d.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* SEARCH */}
        <div className="relative flex items-center shrink-0">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-3 rounded-full transition-all duration-300 ${
              showSearch
                ? "bg-primaryPink text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <FaSearch size={16} />
          </button>

          {showSearch && (
            <div className="absolute right-0 top-full mt-3 w-64 p-2 bg-white/75 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 z-[900]">
              <input
                autoFocus
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari..."
                className="w-full px-4 py-2 text-sm border-none bg-gray-50/75 backdrop-blur-sm rounded-xl ring-2 ring-gray-400 focus:ring-2 focus:ring-primaryPink outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
