// ini untuk DepartmentSection.tsx

import { ApiResponse } from "@/types/commons/apiResponse";
import { DepartmentInfo } from "@/types/data/DepartmentSection";

import { baseURL } from "@/lib/axios";

export const getDepartmentInfo = async (limit: number = 20) => {
  const resp = await fetch(`${baseURL}/department?limit=${limit}`);

  if (!resp.ok) {
    throw new Error("Failed to load department info");
  }

  const json: ApiResponse<DepartmentInfo[]> = await resp.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json.data;
};
