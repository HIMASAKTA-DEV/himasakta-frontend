"use client";

import { GetCurrentCabinet } from "@/services/landing_page/InformasiKabinet";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import HeaderSection from "../commons/HeaderSection";
import MarkdownRenderer from "../commons/MarkdownRenderer";
import GalleryCabinet from "./_infomasiKabinet/GalleryCabinet";
import SkeletonInformasiKabinet from "./skeletons/SkeletonInfoKabinet";

export default function InformasiKabinet({
  setLayout,
}: {
  setLayout: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // Comment this after creating data fetching
  const [loading, setLoading] = useState(true);
  const [cabinet, setCabinet] = useState<CabinetInfo | null>(null);

  useEffect(() => {
    // fetch data
    const fetchCabinetInfo = async () => {
      try {
        const data = await GetCurrentCabinet();
        setCabinet(data.data);
      } catch (err) {
        console.error("Failed to fetch current cabinet info ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCabinetInfo();
  }, []);

  if (!cabinet) return;

  if (loading) {
    return <SkeletonInformasiKabinet />;
  }

  return (
    <>
      <section
        className="w-full flex flex-col lg:flex-row lg:justify-between"
        id="informasi-kabinet"
      >
        <div className="order-2 lg:order-1 flex flex-col gap-4">
          <HeaderSection
            title="Informasi Kabinet"
            sub={cabinet?.tagline}
            className="max-lg:mt-4"
          />
          <MarkdownRenderer>{cabinet?.description}</MarkdownRenderer>
          <div>
            <h1 className="font-libertine font-bold lg:text-3xl text-2xl mb-2">
              Visi:
            </h1>
            <MarkdownRenderer>{cabinet?.visi}</MarkdownRenderer>
            <h1 className="font-libertine font-bold lg:text-3xl text-2xl mt-6 mb-2">
              Misi:
            </h1>
            <MarkdownRenderer>{cabinet?.misi}</MarkdownRenderer>
          </div>
        </div>
        <Image
          src={cabinet?.logo?.image_url ?? "/images/InformasiKabinet.png"}
          alt="profil-himpunan"
          width={400}
          height={400}
          className="order-1 lg:order-2 rounded-3xl hidden lg:inline-block aspect-square object-contain"
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
      <div>
        {cabinet && !loading && (
          <GalleryCabinet {...cabinet} layout={setLayout} />
        )}
      </div>
    </>
  );
}
