import { UUID } from "crypto";

export type CreateMemberType = {
  nrp: string; // wajib
  name: string; // wajib
  role_id: UUID | string; // wajib
  department_id?: UUID | null | undefined | string;
  photo_id?: FileList | UUID | null | undefined | string;
  cabinet_id: UUID | string;
  index?: number | null | undefined;
};
