import { GlobalSettings } from "@/types/data/GlobalSettings";
import Link from "next/link";
import { FiLink } from "react-icons/fi";
import { configuration } from "../../../config";
import HeaderSection from "../commons/HeaderSection";

interface ContactProps {
  data: GlobalSettings | null;
}

function Contact({ data }: ContactProps) {
  // Merge backend social media with config fallbacks
  const mergedSocmed = configuration.SocmedLinks.map((staticSocmed) => {
    const backendMatch = data?.SocialMedia.find(
      (s) => s.name.toLowerCase() === staticSocmed.name.toLowerCase(),
    );
    return {
      ...staticSocmed,
      url: backendMatch ? backendMatch.link : staticSocmed.url,
    };
  });

  // Also include any unknown social media from backend
  const extraSocmed = (data?.SocialMedia || [])
    .filter(
      (s) =>
        !configuration.SocmedLinks.some(
          (staticS) => staticS.name.toLowerCase() === s.name.toLowerCase(),
        ),
    )
    .map((s) => ({
      name: s.name,
      url: s.link,
      icon: FiLink, // Default icon for unknown socmed
    }));

  const allSocmed = [...mergedSocmed, ...extraSocmed];

  return (
    <section className="flex flex-col gap-4" id="contact">
      <HeaderSection
        title="Contact Us"
        titleStyle="text-primaryPink font-averia"
      />
      <p className="text-lg">
        If you have any questions or need further discussion, please feel free
        to contact us.
      </p>
      <div className="flex gap-4 flex-wrap">
        {allSocmed.map(({ name, url, icon: Icon }) => (
          <Link
            key={name}
            href={url}
            target="_blank"
            className="
                p-3 rounded-2xl
                bg-black text-white
                hover:bg-neutral-800
                transition
              "
            title={name}
          >
            <Icon className="text-xl" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Contact;
