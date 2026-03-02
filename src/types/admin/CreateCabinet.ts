import { UUID } from "crypto";

export type CreateCabinetType = {
  visi: string;
  misi: string;
  description: string;
  tagline: string;
  period_start: string;
  period_end: string;
  logo_id: UUID | undefined | null | string;
  organigram_id: UUID | undefined | null | string;
  is_active: boolean;
};
