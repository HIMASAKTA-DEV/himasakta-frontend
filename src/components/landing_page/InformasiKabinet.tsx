"use client";

import { getCurrentCabinetInfo } from "@/services/landing_page/InformasiKabinet";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import Image from "next/image";
import { useEffect, useState } from "react";
import HeaderSection from "../commons/HeaderSection";
import MarkdownRenderer from "../commons/MarkdownRenderer";
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
  );
}
