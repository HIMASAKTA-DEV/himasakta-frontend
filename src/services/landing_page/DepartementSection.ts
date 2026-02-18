// ini untuk DepartmentSection.tsx

import { ApiResponse } from "@/types/commons/apiResponse";
import { DepartmentInfo } from "@/types/data/DepartmentSection";

// config base_url using env later
const BASE_URL = "https://himasakta-backend.vercel.app/api/v1";

export const getDepartmentInfo = async () => {
  const resp = await fetch(`${BASE_URL}/department`, {
    cache: "no-store",
  });

  if (!resp.ok) {
    throw new Error("Failed to load department info");
  }

  const json: ApiResponse<DepartmentInfo[]> = await resp.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json.data;
};
