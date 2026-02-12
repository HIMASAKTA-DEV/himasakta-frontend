import { FaTiktok } from "react-icons/fa";
import { FiInstagram, FiLink, FiLinkedin, FiYoutube } from "react-icons/fi";

// TODO: Add url
export const socmedLinks = [
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
] as const;
