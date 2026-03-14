export type SocialMediaType = {
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  linktree: string;
};

export type GlobalSettings = {
  ExternalSOPLink: string;
  InternalSOPLink: string;
  DeskripsiHimpunan: string;
  FotoHimpunan: string;
  SocialMedia: SocialMediaType;
  InMaintenance: boolean;
};
