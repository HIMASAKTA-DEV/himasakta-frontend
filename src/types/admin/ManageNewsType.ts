import { UUID } from "crypto";
import { Media } from "../commons/mediaType";

export type ManageNewsType = {
  id: UUID | string;
  title: string;
  published_at: string;
  thumbnail: Media | null;
};
