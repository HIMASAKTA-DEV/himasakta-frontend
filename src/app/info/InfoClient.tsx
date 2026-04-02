"use client";

import About from "@/components/info/About";
import Contact from "@/components/info/Contact";
import HeroSection from "@/components/info/HeroSection";
import MediaPartner from "@/components/info/MediaPartner";
import ButtonLink from "@/components/links/ButtonLink";
import Layout from "@/layouts/Layout";
import { GetCurrentCabinet } from "@/services/landing_page/InformasiKabinet";
import { getWebSettings } from "@/services/landing_page/WebSettings";
import { GlobalSettings } from "@/types/data/GlobalSettings";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

export default function InfoClient() {
  const [loading, setLoading] = useState(true);
  const [webData, setWebData] = useState<GlobalSettings | null>(null);
  const [cabinetData, setCabinetData] = useState<CabinetInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, cabinet] = await Promise.all([
          getWebSettings(),
          GetCurrentCabinet(),
        ]);
        setWebData(settings);
        setCabinetData(cabinet.data);
      } catch (err) {
        console.error("Failed to fetch info page data ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout withFooter={true} withNavbar={false} transparentOnTop={false}>
      <main>
        <div className="mb-20">
          <HeroSection />
        </div>
        <div className="max-w-8xl flex flex-col gap-24 lg:gap-32 mt-24 lg:mt-32 px-6 lg:px-32 mb-16">
          <MediaPartner />
          {loading ? (
            <div className="shimmer-skeleton h-96 bg-gray-100 rounded-3xl cursor-wait" />
          ) : (
            <>
              <About webData={webData} cabinetData={cabinetData} />
              <Contact data={webData} />
            </>
          )}
          <ButtonLink
            href="/"
            className="w-28 flex gap-4 items-center"
            variant="black"
          >
            <FaChevronLeft className="hover:text-primaryGreen transition-all duration-300" />
            <p>Home</p>
          </ButtonLink>
        </div>
      </main>
    </Layout>
  );
}
