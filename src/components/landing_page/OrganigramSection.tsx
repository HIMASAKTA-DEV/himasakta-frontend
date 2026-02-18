"use client";

import HeaderSection from "@/components/commons/HeaderSection";
import InteractiveImgViewer from "@/components/commons/InteractiveImgViewer";
import SkeletonSection from "@/components/commons/skeletons/SkeletonSection";
import { getCurrentCabinetInfo } from "@/services/landing_page/InformasiKabinet";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import { useEffect, useState } from "react";

export default function OrganigramSection() {
  const [loading, setLoading] = useState(true);
  const [cabinet, setCabinet] = useState<CabinetInfo | null>(null);

  useEffect(() => {
    // fetch data
    const fetchCabinetInfo = async () => {
      try {
        const data = await getCurrentCabinetInfo();
        setCabinet(data);
      } catch (err) {
        console.error("Failed to fetch current cabinet info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCabinetInfo();
  });

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1200); // Simulated delay
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <section className="w-full flex flex-col gap-6">
      <HeaderSection
        title="Struktur Organisasi HIMASAKTA"
        sub="Organigram kepengurusan HIMASAKTA"
      />
      {loading ? (
        <SkeletonSection />
      ) : (
        <div className="w-full flex items-center">
          <InteractiveImgViewer
            src={
              cabinet?.organigram?.image_url ??
              "images/OrganigramSementara.jpeg"
            }
            variant="advanced"
          />
        </div>
      )}
    </section>
  );
}
