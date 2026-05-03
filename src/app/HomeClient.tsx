"use client";

import BackToTop from "@/components/commons/BackToTop";
import DepartemenSection from "@/components/landing_page/DepartemenSection";
import GetToKnow from "@/components/landing_page/GetToKnow";
import HeroSection from "@/components/landing_page/HeroSection";
import InformasiBerita from "@/components/landing_page/InformasiBerita";
import InformasiKabinet from "@/components/landing_page/InformasiKabinet";
import OrganigramSection from "@/components/landing_page/OrganigramSection";
import ProfilHimpunan from "@/components/landing_page/ProfilHimpunan";
import Layout from "@/layouts/Layout";
import { trackVisit } from "@/lib/analytic";
import { useEffect, useState } from "react";

export default function HomeClient() {
  useEffect(() => {
    trackVisit();
  }, []);

  const [wLayout, setWithLayout] = useState(true);
  return (
    <>
      <Layout withNavbar={wLayout} withFooter={true} transparentOnTop={true}>
        <main className="flex flex-col items-center mb-24 lg:mb-32 overflow-x-hidden overflow-y-hidden -mt-32">
          <div className="w-full">
            <HeroSection />
          </div>
          <div className="max-w-full flex flex-col gap-24 lg:gap-32 mt-24 lg:mt-32 px-6 lg:px-32">
            <ProfilHimpunan />
            <InformasiKabinet setLayout={setWithLayout} />
            <OrganigramSection />
            <GetToKnow />
            <DepartemenSection />
            <InformasiBerita />
          </div>
        </main>
        <BackToTop />
      </Layout>
    </>
  );
}
