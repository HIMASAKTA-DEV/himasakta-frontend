type ThisSocmed = {
  name: string;
  link: string;
};

export type SettingsWebType = {
  ExternalSOPLink: string;
  InternalSOPLink: string;
  DeskripsiHimpunan: string;
  FotoHimpunan: string;
  SocialMedia: ThisSocmed[];
  InMaintenance: boolean;
};
