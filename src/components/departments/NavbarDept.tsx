"use client";

import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { DepartmentType } from "@/types/data/DepartmentType";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

export default function NavbarDept() {
  const [deptName, setDeptName] = useState<DepartmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
  const activeDept = decodeURIComponent(pathname.split("/").pop() ?? "");
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState("");

  const filteredDept = useMemo(() => {
    if (!keyword.trim()) return deptName;
    return deptName.filter((d) =>
      d.name?.toLowerCase().includes(keyword.toLowerCase()),
    );
  }, [deptName, keyword]);

  if (error)
    return (
      <nav className="bg-white p-4 rounded-full shadow text-red-500 text-center">
        Gagal memuat data
      </nav>
    );
  if (loading)
    return (
      <nav className="bg-white p-4 rounded-full shadow flex justify-center">
        <SkeletonPleaseWait />
      </nav>
    );

  return (
    <nav className="relative w-full bg-white shadow-md rounded-full">
      <div className="flex items-center py-1 pr-1 pl-1">
        {/* CONTAINER SCROLLABLE */}
        <div
          className="flex-1 overflow-x-auto max-lg:no-scrollbar scroll-smooth snap-x snap-proximity overflow-y-hidden "
          data-lenis-prevent
        >
          {/* PENTING: 
              - Gunakan 'min-w-full' agar container selalu selebar nav.
              - Gunakan 'justify-between' atau 'justify-around' agar item yang sedikit tersebar merata.
          */}
          <ul className="flex items-center min-w-full w-max gap-2 list-none m-0 p-1">
            {filteredDept.map((d, idx) => {
              const isActive = activeDept === d.name;
              return (
                <li key={d.id ?? idx} className="flex-1 snap-start">
                  <Link
                    href={`/departments/${d.name}`}
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

        {/* SEARCH TOGGLE */}
        <div className="flex items-center sticky right-0 bg-white rounded-full pr-2 pl-1">
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
            <div className="absolute right-2 top-full mt-3 w-64 p-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[600]">
              <input
                autoFocus
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari..."
                className="w-full px-4 py-2 text-sm border-none bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryPink outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
