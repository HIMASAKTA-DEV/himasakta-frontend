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
      <div className="mb-20">
        <HeroSection />
      </div>
      <div className="flex flex-col justify-center mx-20 lg:mx-40 gap-12 mb-16">
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
    </Layout>
  );
}

export default page;
