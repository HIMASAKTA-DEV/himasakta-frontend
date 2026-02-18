"use client";

import { getCurrentCabinetInfo } from "@/services/landing_page/InformasiKabinet";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import Image from "next/image";
import { useEffect, useState } from "react";
import HeaderSection from "../commons/HeaderSection";
import SkeletonInformasiKabinet from "./skeletons/SkeletonInfoKabinet";

export default function InformasiKabinet() {
  // Comment this after creating data fetching
  const [loading, setLoading] = useState(true);
  const [cabinet, setCabinet] = useState<CabinetInfo | null>(null);

  useEffect(() => {
    // fetch data
    const fetchCabinetInfo = async () => {
      try {
        const data = await getCurrentCabinetInfo();
        setCabinet(data);
      } catch (err) {
        console.error("Failed to fetch current cabinet info ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCabinetInfo();
  }, []);

  return loading ? (
    <SkeletonInformasiKabinet />
  ) : (
    <section
      className="w-full flex flex-col lg:flex-row lg:justify-between"
      id="informasi-kabinet"
    >
      <div className="order-2 lg:order-1 flex flex-col gap-4">
        <HeaderSection title="Informasi Kabinet" sub={cabinet?.tagline} />
        <p className="font-libertine lg:text-xl">{cabinet?.description}</p>
        {/* Ini ul kemungkinan ada dua: visi dan misi */}
        <h1 className="font-libertine font-bold lg:text-2xl">Visi & Misi:</h1>
        <ul className="list-disc list-inside ml-6">
          <li key={cabinet?.visi || "visi"}>{cabinet?.visi}</li>
          <li key={cabinet?.misi || "misi"}>{cabinet?.misi}</li>
        </ul>
      </div>
      <Image
        src={cabinet?.logo?.image_url ?? "/images/InformasiKabinet.png"}
        alt="profil-himpunan"
        width={402}
        height={569}
        className="order-1 lg:order-2 rounded-3xl hidden lg:inline-block"
      />
      <div className="lg:hidden w-full relative aspect-[16/12]">
        <Image
          src={cabinet?.logo?.image_url ?? "/images/InformasiKabinet.png"}
          alt="profil-himpunan"
          fill
          className="order-1 lg:order-2 rounded-3xl object-cover object-center"
        />
      </div>
    </section>
  );
}
