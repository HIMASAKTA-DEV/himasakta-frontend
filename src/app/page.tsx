import HeroSection from "@/components/landing_page/HeroSection";
import InformasiKabinet from "@/components/landing_page/InformasiKabinet";
import ProfilHimpunan from "@/components/landing_page/ProfilHimpunan";
import Layout from "@/layouts/Layout";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Layout withNavbar={true} withFooter={true}>
        <main className="h-min flex flex-col items-center gap-32">
          {/* full bleed container */}
          <div className="w-full">
            <HeroSection />
          </div>

          {/* normal content area */}
          <div className="max-w-8xl flex flex-col gap-32 mx-48">
            <ProfilHimpunan />
            <InformasiKabinet />
          </div>

          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
          <div>ini landing page</div>
        </main>
      </Layout>
    </>
  );
}
