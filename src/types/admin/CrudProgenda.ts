import { CrudTimelineType } from "./CrudTimelines";

export type CrudProgendaType = {
  name: string;
  thumbnail_id: string;
  goal: string;
  description: string;
  website_link: string;
  instagram_link: string;
  twitter_link: string;
  linkedin_link: string;
  youtube_link: string;
  department_id: string;
  timelines: CrudTimelineType[];
};
