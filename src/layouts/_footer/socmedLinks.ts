import {
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiLinkedin,
  FiLink,
} from "react-icons/fi";

// TODO: Add url
export const socmedLinks = [
  {
    name: "instagram",
    url: "https://instagram.com/username",
    icon: FiInstagram,
  },
  {
    name: "twitter",
    url: "https://twitter.com/username",
    icon: FiTwitter,
  },
  {
    name: "youtube",
    url: "https://youtube.com/username",
    icon: FiYoutube,
  },
  {
    name: "linkedin",
    url: "https://linkedin.com/in/username",
    icon: FiLinkedin,
  },
  {
    name: "linktree",
    url: "https://linktr.ee/username",
    icon: FiLink,
  },
] as const;
