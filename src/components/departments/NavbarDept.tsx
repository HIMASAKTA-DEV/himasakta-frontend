"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { DepartmentType } from "@/types/data/DepartmentType";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

const LG_BREAKPOINT = 1024;

export default function NavbarDept() {
  // Handle responsiveness
  const [isLg, setIsLg] = useState(false);
  const [deptLimit, setDeptLimit] = useState(12);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsLg(e.matches);
    };

    setIsLg(mq.matches);
    mq.addEventListener("change", handleChange);

    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    setDeptLimit(isLg ? 12 : 4);
  }, [isLg]);

  // Handle data fetching
  const [deptName, setDeptName] = useState<DepartmentType[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const [totPage, setTotPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAllDept = async () => {
    try {
      setLoading(true);
      setError(false);

      const json = await GetAllDepts(currPage, deptLimit);

      setDeptName(json.data ?? []);
      setTotPage(json.meta?.total_page ?? 1);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDept();
  }, [currPage, deptLimit]);

  // Handle page nav
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

  const prevSlide = () => {
    setCurrPage((p) => ((p - 2 + totPage) % totPage) + 1);
  };

  const nextSlide = () => {
    setCurrPage((p) => (p % totPage) + 1);
  };

  if (error) {
    return (
      <nav className="bg-white p-4 shadow rounded-full">
        <p className="text-center text-red-500">
          Unable to fetch data &#40;:&#41;
        </p>
      </nav>
    );
  }

  if (loading) {
    return (
      <nav className="bg-white p-4 shadow rounded-full flex items-center justify-center">
        <SkeletonPleaseWait />
      </nav>
    );
  }

  return (
    <nav className="relative flex items-center gap-2 bg-white py-1 pr-2 pl-6 shadow-[0px_0px_15px_rgba(0,0,0,0.15)] rounded-full">
      {/* Dept lists */}
      <div className="flex-1 relative">
        <ul className="flex w-full items-center gap-2 rounded-full">
          {filteredDept.map((d, idx) => (
            <Link
              key={d.id ?? idx}
              href={`/departments/${d.name}`}
              className="flex-1"
            >
              <li
                className={`flex items-center justify-center p-2 rounded-full transition-all duration-300
                  ${
                    activeDept === d.name
                      ? "bg-primaryPink text-white font-semibold hover:opacity-80"
                      : "bg-white hover:bg-gray-200 hover:text-primaryPink"
                  }
                `}
              >
                {d.name}
              </li>
            </Link>
          ))}
        </ul>

        {/* Slider */}
        {totPage > 1 && (
          <>
            <button
              aria-label="Previous"
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2
                bg-white/90 hover:bg-white p-3 rounded-full shadow"
            >
              <FaChevronLeft />
            </button>

            <button
              aria-label="Next"
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2
                bg-white/90 hover:bg-white p-3 rounded-full shadow"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>
      {/* Search */}
      {showSearch && (
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search department..."
          className="absolute right-0 top-full mt-1 w-[50vw] lg:w-[15vw]
              px-4 py-2 border rounded-full focus:outline-none
              focus:ring-2 focus:ring-primaryPink shadow-md"
        />
      )}

      <button
        onClick={() => setShowSearch((p) => !p)}
        className="p-4 rounded-full bg-white hover:bg-gray-100 active:bg-gray-200 transition-all duration-300"
        aria-label="Search department"
      >
        <FaSearch />
      </button>
    </nav>
  );
}
