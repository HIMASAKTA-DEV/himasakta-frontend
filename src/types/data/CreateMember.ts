import { UUID } from "crypto";

export type CreateMemberType = {
  nrp: string; // wajib
  name: string; // wajib
  role_id: UUID | string; // wajib
  department_id?: UUID | null | undefined | string;
  photo_id?: UUID | string | null | undefined;
  cabinet_id: UUID | string;
  index?: number | null | undefined;
};
