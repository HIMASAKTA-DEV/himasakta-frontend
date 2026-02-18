// untuk InformasiKabinet.tsx

import { UUID } from "crypto";
import { Media } from "../commons/mediaType";

export type CabinetInfo = {
  id: UUID | string;
  visi: string;
  misi: string;
  description: string;
  tagline: string;
  period_start: string;
  period_end: string;
  logo_id: string;
  logo: Media | null;
  organigram_id: string | null;
  organigram: Media | null;
  is_active: boolean;
};
