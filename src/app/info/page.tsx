import About from "@/components/info/About";
import Contact from "@/components/info/Contact";
import HeroSection from "@/components/info/HeroSection";
import MediaPartner from "@/components/info/MediaPartner";
import ButtonLink from "@/components/links/ButtonLink";
import Layout from "@/layouts/Layout";
import { FaChevronLeft } from "react-icons/fa";

function page() {
  return (
    <Layout withFooter={true} withNavbar={false} transparentOnTop={false}>
      <main>
        <div className="mb-20">
          <HeroSection />
        </div>
        <div className="max-w-8xl flex flex-col gap-24 lg:gap-32 mt-24 lg:mt-32 px-6 lg:px-32 mb-16">
          <MediaPartner />
          <About />
          <Contact />
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

export default page;
