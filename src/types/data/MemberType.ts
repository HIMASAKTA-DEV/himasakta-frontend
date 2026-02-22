import { PhotoType } from "../commons/PhotoType";
import { DepartmentType } from "./DepartmentType";
import { RoleType } from "./RoleType";

interface BaseEntity {
  created_at: string; // ISO date
  updated_at: string; // ISO date
  DeletedAt: string | null;
}

export interface MemberType extends BaseEntity {
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
}
