"use client";

import api from "@/lib/axios";
import { SettingsWebType } from "@/types/SettingsWebType";
import { ApiResponse } from "@/types/commons/apiResponse";
import Image from "next/image";
import { useEffect, useState } from "react";
import HeaderSection from "../commons/HeaderSection";
import SkeletonProfilHimpunan from "./skeletons/SkeletonProfilHimpunan";

export default function ProfilHimpunan() {
  const [isi, setIsi] = useState<SettingsWebType | null>(null);

  useEffect(() => {
    const fetchSettingsWeb = async () => {
      try {
        const json =
          await api.get<ApiResponse<SettingsWebType>>("/settings/web");
        const dt = json.data.data;
        setIsi(dt);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSettingsWeb();
  }, []);

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
          src={isi?.FotoHimpunan ?? "/image/ProfilHimpunan.png"}
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
          {isi?.DeskripsiHimpunan ?? ""}
        </p>
      </div>
    </section>
  );
}
