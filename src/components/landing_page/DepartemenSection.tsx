"use client";

import React, { useEffect, useState } from "react";
import DeptInfoAll from "@/lib/_dummy_db/_departemen/dummyDepartemenAll.json";
import DeptCard from "./_departemenSection/DeptCard";
import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";

function DepartemenSection() {
  const firstDepts = DeptInfoAll.slice(0, 6);
  const secDepts = DeptInfoAll.slice(6, 12);

  // Comment this after creating data fetching
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // TODO: Ini bakal ada data fetching (Buat folder services di src)
  // Hanya perlu fetch all departemen, Ingetin pakai cache aja biar gak refetch.

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
          count={12} // Use 12 to match your actual 12 departments
          /* Remove grid-rows, let the natural flow handle height */
          className="grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8"
        />
      ) : (
        <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 justify-center">
          {/* Kolom kiri */}
          <div className="flex flex-col gap-4 lg:w-1/2">
            {firstDepts.map((dept, idx) => (
              <DeptCard dept={dept} key={dept.id || idx} />
            ))}
          </div>

          {/* Kolom kanan */}
          <div className="flex flex-col gap-4 lg:w-1/2">
            {secDepts.map((dept, idx) => (
              <DeptCard dept={dept} key={dept.id || idx} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default DepartemenSection;
