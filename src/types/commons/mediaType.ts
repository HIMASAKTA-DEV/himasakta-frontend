import { UUID } from "crypto";

export type Media = {
  id: UUID;
  image_url: string;
  caption?: string;
  category?: string;
  department_id?: UUID | null;
  progenda_id?: UUID | null;
  cabinet_id?: UUID | null;
};
