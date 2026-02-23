import { Media } from "../commons/mediaType";
import { DepartmentType } from "./DepartmentType";

interface BaseEntity {
  created_at: string;
  updated_at: string;
  DeletedAt: string | null;
  id: string;
}

export interface ProgendaType extends BaseEntity {
  name: string;
  thumbnail_id: string;
  thumbnail: Media;
  goal: string;
  description: string;
  website_link: string;
  instagram_link: string;
  twitter_link: string;
  linkedin_link: string;
  youtube_link: string;
  department_id: string;
  department: DepartmentType;
}
