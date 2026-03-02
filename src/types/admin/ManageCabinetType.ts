import { UUID } from "crypto";

export type ManageCabinet = {
  id: UUID | string;
  tagline: string;
  period_start: string;
  period_end: string;
  is_active: boolean;
};
