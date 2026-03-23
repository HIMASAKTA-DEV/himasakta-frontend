import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { DepartmentType } from "@/types/data/DepartmentType";

export const GetDeptBySlug = async (
  slug: string,
): Promise<ApiResponse<DepartmentType>> => {
  const resp = await api.get<ApiResponse<DepartmentType>>(
    `/department/${slug}`,
  );

  return resp.data;
};
