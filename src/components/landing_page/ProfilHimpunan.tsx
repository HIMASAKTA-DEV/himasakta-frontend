"use client";

import { getWebSettings } from "@/services/landing_page/WebSettings";
import { GlobalSettings } from "@/types/data/GlobalSettings";
import Image from "next/image";
import { useEffect, useState } from "react";
import HeaderSection from "../commons/HeaderSection";
import MarkdownRenderer from "../commons/MarkdownRenderer";
import TimelineSection from "./TimelineSection";
import SkeletonProfilHimpunan from "./skeletons/SkeletonProfilHimpunan";

export default function ProfilHimpunan() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GlobalSettings | null>(null);

  useEffect(() => {
    const fetchWebSettings = async () => {
      try {
        const settings = await getWebSettings();
        setData(settings);
      } catch (err) {
        console.error("Failed to fetch web settings ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWebSettings();
  }, []);

  return loading ? (
    <SkeletonProfilHimpunan />
  ) : (
    <div className="flex flex-col w-full items-start justify-center gap-8">
      <section
        className="flex flex-col items-center gap-8 w-full"
        id="profil-himpunan"
      >
        <div className=" w-[75vw] lg:max-w-7xl relative aspect-[16/9] lg:aspect-[16/5]">
          <Image
            src={data?.FotoHimpunan ?? "/images/ProfilHimpunan.png"}
            alt="profil-himpunan"
            fill
            className="object-cover rounded-3xl"
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <HeaderSection
            title="Profil Himpunan"
            className="w-[75vw] lg:max-w-7xl mx-auto"
          />
          <div className="w-[75vw] lg:max-w-7xl mx-auto font-libertine lg:text-xl text-justify gap-4 flex flex-col">
            <MarkdownRenderer className="text-justify">
              {data?.DeskripsiHimpunan ?? ""}
            </MarkdownRenderer>
            {data?.VisiHimpunan && (
              <div>
                <h1 className="font-libertine font-bold lg:text-3xl text-2xl mb-2">
                  Visi:
                </h1>
                <MarkdownRenderer className="text-justify">
                  {data.VisiHimpunan}
                </MarkdownRenderer>
              </div>
            )}
            {data?.MisiHimpunan && (
              <div>
                <h1 className="font-libertine font-bold lg:text-3xl text-2xl mt-6 mb-2">
                  Misi:
                </h1>
                <MarkdownRenderer className="text-justify">
                  {data.MisiHimpunan}
                </MarkdownRenderer>
              </div>
            )}
          </div>
        </div>
      </section>
      <TimelineSection fotoSejarah={data?.FotoSejarahHimpunan} />
    </div>
  );
}
