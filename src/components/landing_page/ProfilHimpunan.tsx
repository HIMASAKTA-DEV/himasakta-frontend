"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { configuration } from "../../../config";
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
          src={configuration.FotoHimpunan}
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
          {configuration.DeskripsiHimpunan}
        </p>
      </div>
    </section>
  );
}
