// untuk GetToKnow.tsx

import { UUID } from "crypto";
import { Media } from "../commons/mediaType";

export type MonthlyEvent = {
  id: UUID | string;
  title: string;
  thumbnail_id: UUID | string;
  thumbnail: Media | null;
  description: string;
  month: string;
  link: string;
};
