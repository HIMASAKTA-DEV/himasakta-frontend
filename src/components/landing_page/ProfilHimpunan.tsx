"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import HeaderSection from "../commons/HeaderSection";
import SkeletonProfilHimpunan from "./skeletons/SkeletonProfilHimpunan";

export default function ProfilHimpunan() {
  // Comment this after creating data fetching
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sementara gak ada data fetching, biar scalable aku biarin loading 1s

  return loading ? (
    <SkeletonProfilHimpunan />
  ) : (
    <section className="flex flex-col items-center gap-8" id="profil-himpunan">
      <div className=" w-[75vw] lg:max-w-7xl relative aspect-[16/9] lg:aspect-[16/5]">
        <Image
          src="/images/ProfilHimpunan.png"
          alt="profil-himpunan"
          fill
          className="object-cover rounded-3xl"
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <HeaderSection
          title="Profil Himpunan"
          sub="Lorem ipsum dolor sit amet consectur"
          className="w-[75vw] lg:max-w-7xl mx-auto"
        />
        <p className="w-[75vw] lg:max-w-7xl mx-auto font-libertine lg:text-xl">
          In the 2024 leadership period, HIMASAKTA ITS adopted the name
          AVANTURIER as the name of the cabinet. AVANTURIER is derived from
          Dutch, meaning "adventurer." As the 6th cabinet, Avanturier is
          expected to carry forward and continue the leadership legacy of
          HIMASAKTA. It is also hoped that HIMASAKTA ITS will continue to serve
          the needs of ITS Actuarial students.
        </p>
      </div>
    </section>
  );
}
