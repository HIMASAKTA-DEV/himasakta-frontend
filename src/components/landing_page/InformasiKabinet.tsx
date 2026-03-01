"use client";

import { getCurrentCabinetInfo } from "@/services/landing_page/InformasiKabinet";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import Image from "next/image";
import { useEffect, useState } from "react";
import HeaderSection from "../commons/HeaderSection";
import SkeletonInformasiKabinet from "./skeletons/SkeletonInfoKabinet";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import "./md.info-kabinet.css";

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
        <div className="info-kabinet-content">
          <h1 className="font-libertine font-bold lg:text-2xl">Visi:</h1>
          <p key={cabinet?.visi || "visi"}>{cabinet?.visi}</p>
          <h1 className="font-libertine font-bold lg:text-2xl mt-4">Misi:</h1>
          <ReactMarkdown remarkPlugins={[gfm]}>
            {cabinet?.misi ?? ""}
          </ReactMarkdown>
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
