import { UUID } from "crypto";

export interface RoleType {
  id: UUID | string;
  name: string;
  level: number;
  description: string;
}
