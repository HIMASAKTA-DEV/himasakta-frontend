// untuk InformasiBerita.tsx

import { UUID } from "crypto";
import { Media } from "../commons/mediaType";

export type NewsType = {
  id: UUID | string;
  title: string;
  slug?: string | null;
  tagline?: string | null;
  hashtag?: string | null;
  content?: string | null;
  thumbnail_id?: UUID | string | null;
  thumbnail?: Media | null;
  published_at?: string | null;
};
