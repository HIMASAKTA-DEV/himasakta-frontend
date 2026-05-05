export type SocialMediaDTO = {
  name: string;
  link: string;
};

export type GlobalSettings = {
  ExternalSOPLink: string;
  InternalSOPLink: string;
  DeskripsiHimpunan: string;
  FotoHimpunan: string;
  VisiHimpunan: string;
  MisiHimpunan: string;
  FotoSejarahHimpunan: string;
  SocialMedia: SocialMediaDTO[];
  InMaintenance: boolean;
};

export type AuthSettings = {
  username: string; // The user specified "superadmin" in the button but the DTO shows "Username"
  password: string; // The user specified "superadmin" but the DTO shows "Password"
};
// Actually, looking at the user's request:
// { "username": "...", "password": "..." } for POST /auth/update
// But the DTO shows:
// type AuthSettings struct { Username string, Password string }
// I'll define both for clarity or use the lowercase version for the payload.
