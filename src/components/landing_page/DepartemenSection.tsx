"use client";

import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import { getDepartmentInfo } from "@/services/landing_page/DepartementSection";
import { DepartmentInfo } from "@/types/data/DepartmentSection";
import { useEffect, useState } from "react";
import DeptCard from "./_departemenSection/DeptCard";
import clsxm from "@/lib/clsxm";
import { DepartmentType } from "@/types/data/DepartmentType";

function DepartemenSection() {
  // Comment this after creating data fetching
  const [loading, setLoading] = useState(true);
  const [depts, setDepts] = useState<DepartmentInfo[] | []>([]);

  useEffect(() => {
    // fetch all department info
    const fetchAllDeptInfo = async () => {
      try {
        const data = await getDepartmentInfo();
        setDepts(data);
      } catch (err) {
        console.error("Failed to load departments info ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDeptInfo();
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  // TODO: Ini bakal ada data fetching (Buat folder services di src)
  // Hanya perlu fetch all departemen, Ingetin pakai cache aja biar gak refetch.

  const firstDepts = depts.slice(0, Math.ceil(depts.length / 2));
  const secDepts = depts.slice(Math.ceil(depts.length / 2), depts.length);
  // const firstDepts: DepartmentType[] = [];
  // const secDepts: DepartmentType[] = [];

  return (
    <section
      className="w-full flex flex-col items-center gap-8 px-4"
      id="departemen-list-utama"
    >
      <div className="flex items-center flex-col gap-2">
        <h1 className="font-averia text-4xl lg:text-6xl font-bold">
          12 Departemen
        </h1>
        <p className="font-libertine font-semibold text-2xl lg:text-3xl">
          Lorem ipsum dolor sit amet, consectetur
        </p>
      </div>
      {loading ? (
        <SkeletonGrid
          count={12}
          className="grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8"
          styleBox="aspect-[8/1]"
        />
      ) : (
        // Guys propsnya jg di-spread kalo setting componentnya di-spread juga
        <div
          className={clsxm(
            "flex flex-col lg:flex-row w-full gap-4 lg:gap-8 justify-center",
            secDepts.length + firstDepts.length === 0 ? "items-center" : "",
          )}
        >
          {/* Kolom kiri */}
          <div className="flex flex-col gap-4 lg:w-1/2">
            {firstDepts.map((dept, idx) => (
              <DeptCard {...dept} key={dept.id || idx} />
            ))}
          </div>

          {/* Kolom kanan */}
          <div className="flex flex-col gap-4 lg:w-1/2">
            {secDepts.map((dept, idx) => (
              <DeptCard {...dept} key={dept.id || idx} />
            ))}
          </div>

          {firstDepts.length + secDepts.length === 0 && (
            <div className="mx-4 py-16 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 w-full">
              <p className="text-xl font-medium">
                Belum ada departemen saat ini
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default DepartemenSection;
