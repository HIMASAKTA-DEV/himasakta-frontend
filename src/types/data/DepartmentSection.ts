// this is for DepartementSection.tsx

import { UUID } from "crypto";
import { ApiMeta } from "../commons/apiMeta";
import { Media } from "../commons/mediaType";

export type DepartmentInfo = {
  id: UUID | string;
  name: string;
  description: string;
  logo?: Media;
  social_media_link?: string;
  silabus_link?: string;
  bank_ref_link?: string;
  meta?: ApiMeta;
};
