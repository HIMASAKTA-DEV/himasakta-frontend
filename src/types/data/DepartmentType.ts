import { ApiMeta } from "../commons/apiMeta";
import { Media } from "../commons/mediaType";
import { MemberType } from "./MemberType";

export type DepartmentType = {
  created_at?: string;
  updated_at?: string;
  DeletedAt?: string | null;
  id?: string;
  name?: string;
  description?: string;
  logo?: Media;
  logo_id?: string;
  leader_id?: string | null;
  leader?: MemberType | null;
  social_media_link?: string;
  silabus_link?: string;
  bank_soal_link?: string;
  bank_ref_link?: string;
  meta?: ApiMeta;
};
