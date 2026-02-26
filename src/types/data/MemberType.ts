import { ApiMeta } from "../commons/apiMeta";
import { PhotoType } from "../commons/PhotoType";
import { DepartmentType } from "./DepartmentType";
import { RoleType } from "./RoleType";

export type MemberType = {
  id: string;
  nrp: string;
  name: string;
  role_id: string;
  role: RoleType;
  department_id: string;
  department: DepartmentType;
  photo_id: string;
  photo: PhotoType | null;
  cabinet_id: string;
  index: number;
  meta?: ApiMeta;
};
