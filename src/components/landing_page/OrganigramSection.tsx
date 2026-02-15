"use client";

import HeaderSection from "@/components/commons/HeaderSection";
import InteractiveImgViewer from "@/components/commons/InteractiveImgViewer";
import SkeletonSection from "@/components/commons/skeletons/SkeletonSection";
import { useEffect, useState } from "react";

export default function OrganigramSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // Simulated delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full flex flex-col gap-6">
      <HeaderSection
        title="Struktur Organisasi"
        sub="Organigram kepengurusan HIMASAKTA"
      />
      {loading ? (
        <SkeletonSection />
      ) : (
        <div className="w-full flex items-center">
          <InteractiveImgViewer
            src="images/OrganigramSementara.jpeg"
            variant="advanced"
          />
        </div>
      )}
    </section>
  );
}
