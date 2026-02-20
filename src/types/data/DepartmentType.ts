// this is for DepartementSection.tsx

import { UUID } from "crypto";
import { ApiMeta } from "../commons/apiMeta";
import { Media } from "../commons/mediaType";

export type DepartmentType = {
  created_at?: string;
  updated_at?: string;
  DeletedAt?: string | null;
  id?: UUID | string;
  name?: string;
  description?: string;
  logo?: Media | Media[] | null;
  social_media_link?: string[] | string | null;
  silabus_link?: string;
  bank_soal_link?: string;
  bank_ref_link?: string;
  meta?: ApiMeta;
};
