// @ts-nocheck
import { FaTiktok } from "react-icons/fa";
import { FiInstagram, FiLink, FiLinkedin, FiYoutube } from "react-icons/fi";

export const configuration = {
  FotoHimpunan: "/images/ProfilHimpunan.png",
  DeskripsiHimpunan: `In the 2024 leadership period, HIMASAKTA ITS adopted the name AVANTURIER as the name of the cabinet. AVANTURIER is derived from Dutch, meaning "adventurer." As the 6th cabinet, Avanturier is expected to carry forward and continue the leadership legacy of HIMASAKTA. It is also hoped that HIMASAKTA ITS will continue to serve the needs of ITS Actuarial students.`,
  Visi: `To optimize the function of HIMASAKTA ITS as a home that accommodates the needs and potential of its members, while enhancing the presence of HIMASAKTA ITS both within and outside the Department of Actuarial Science at ITS.`,
  Misi: [
    "To foster a sense of belonging among members towards the organization, creating a healthy culture and work environment.",
    "To position HIMASAKTA as a facilitator that meets the needs and potential of ITS Actuarial students.",
    "To enhance the presence of HIMASAKTA through optimized branding, collaboration, strong relationships with various stakeholders, and the development of an informative and integrated information system.",
  ],
  ExternalSOPLink:
    "https://docs.google.com/forms/d/e/1FAIpQLScZJj7GNPPIYbVeOkkDHQx0rYE9KHR4MqC_KEBWG2jpkRzgGQ/viewform",
  InternalSOPLink: "#",
  MediaButtons: [
    {
      name: "External SOP of HIMASAKTA",
      url: "https://its.id/m/PostEksternalHimasakta",
    },
    {
      name: "Internal SOP of HIMASAKTA",
      url: "https://its.id/m/PostInternalHimasakta",
    },
  ],
  SocmedLinks: [
    {
      name: "instagram",
      url: "https://www.instagram.com/himasakta.its/?hl=id",
      icon: FiInstagram,
    },
    {
      name: "tiktok",
      url: "https://www.tiktok.com/@himasakta.its",
      icon: FaTiktok,
    },
    {
      name: "youtube",
      url: "https://www.youtube.com/@himasaktaits4262",
      icon: FiYoutube,
    },
    {
      name: "linkedin",
      url: "https://www.linkedin.com/company/himasaktaits/posts/?feedView=all",
      icon: FiLinkedin,
    },
    {
      name: "linktree",
      url: "https://himasaktaits.carrd.co/",
      icon: FiLink,
    },
  ] as const,
};

export const landingPageInfo = {
  visi: `
  Lorem ipsum dolor sit amet 
  `,
  misi: [`Misi 1`, `Misi 2`, `Misi 3`],
};
