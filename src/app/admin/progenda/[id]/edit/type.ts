import { ProgendaType } from "@/types/data/ProgendaType";

export type FormValues = ProgendaType;
export type OptionType = { label?: string; value?: string };
export type ProgendaLinkType =
  | "website_link"
  | "instagram_link"
  | "twitter_link"
  | "linkedin_link"
  | "youtube_link";

export type LinkProps = {
  id: string;
  type: ProgendaLinkType;
  label: string;
  url: string;
};

export const linkOpts = [
  { type: "website_link", label: "Website" },
  { type: "instagram_link", label: "Instagram" },
  { type: "twitter_link", label: "Twitter" },
  { type: "linkedin_link", label: "LinkedIn" },
  { type: "youtube_link", label: "YouTube" },
] as const;

export type PhotoData = {
  id: string;
  image_url: string;
};
