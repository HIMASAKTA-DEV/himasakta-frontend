import DepartemenSection from "@/components/landing_page/DepartemenSection";
import GetToKnow from "@/components/landing_page/GetToKnow";
import HeroSection from "@/components/landing_page/HeroSection";
import InformasiBerita from "@/components/landing_page/InformasiBerita";
import InformasiKabinet from "@/components/landing_page/InformasiKabinet";
import OrganigramSection from "@/components/landing_page/OrganigramSection";
import ProfilHimpunan from "@/components/landing_page/ProfilHimpunan";
import Layout from "@/layouts/Layout";

export default async function Home() {
  return (
    <>
      {/* TODO: Add hover effect in each section */}
      <Layout withNavbar={true} withFooter={true} transparentOnTop={true}>
        <main className="flex flex-col items-center mb-24 lg:mb-32">
          {/* Full bleed Hero */}
          <div className="w-full mt-[-115px]">
            <HeroSection />
          </div>

          {/* Normal content area */}
          <div className="max-w-8xl flex flex-col gap-24 lg:gap-32 mt-24 lg:mt-32 px-6 lg:px-32">
            <ProfilHimpunan />
            <InformasiKabinet />
            <OrganigramSection />
            <GetToKnow />
            <DepartemenSection />
            <InformasiBerita />
          </div>
        </main>
      </Layout>
    </>
  );
}
