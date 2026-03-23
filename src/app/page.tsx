import JsonLd from "@/components/seo/JsonLd";
import HomeClient from "./HomeClient";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "HIMASAKTA ITS",
          alternateName: "Himpunan Mahasiswa Aktuaria ITS",
          url: "https://himasakta.com",
          logo: "https://himasakta.com/images/ProfilHimpunan.png",
          description:
            "Himpunan Mahasiswa Aktuaria Institut Teknologi Sepuluh Nopember (ITS), Surabaya, Indonesia.",
          sameAs: [
            "https://www.instagram.com/himasakta.its/",
            "https://www.youtube.com/@himasaktaits4262",
            "https://www.linkedin.com/company/himasaktaits/",
            "https://www.tiktok.com/@himasakta.its",
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "HIMASAKTA ITS",
          url: "https://himasakta.com",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://himasakta.com/news?s={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <HomeClient />
    </>
  );
}
