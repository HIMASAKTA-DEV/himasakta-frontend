import { UUID } from "crypto";
import { Media } from "../commons/mediaType";
import { DepartmentType } from "./DepartmentType";

interface BaseEntity {
  created_at: string;
  updated_at: string;
  DeletedAt: string | null;
  id: UUID | string;
}

export interface Timelines extends BaseEntity {
  progenda_id: UUID | string;
  date: string;
  info: string;
  link: string;
}

export interface ProgendaType extends BaseEntity {
  name: string;
  thumbnail_id?: string | null;
  thumbnail?: Media | null;
  goal: string;
  description: string;
  website_link: string;
  instagram_link: string;
  twitter_link: string;
  linkedin_link: string;
  youtube_link: string;
  department_id?: UUID | string | null;
  department?: DepartmentType | null;
  timelines?: Timelines[] | null;
  feeds?: Media[];
}
