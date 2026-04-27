import { UUID } from "crypto";

export type ManageEventsType = {
  id: UUID | string;
  title: string;
  created_at: string; // published at
  link: string;
  month: string;
};
