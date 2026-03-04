import { UUID } from "crypto";

export type ManageGalleryType = {
  updated_at: string;
  id: UUID | string;
  image_url: string;
  caption: string;
  category: string;
  department_id?: string | null;
  progenda_id?: string | null;
  cabinet_id?: string | null;
};
