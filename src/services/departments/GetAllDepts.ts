import api from "@/lib/axios";
import type { ApiResponse } from "@/types/commons/apiResponse";
import { DepartmentType } from "@/types/data/DepartmentType";

export const GetAllDepts = async (
  currPage: number,
  lim: number,
): Promise<ApiResponse<DepartmentType[]>> => {
  const params = new URLSearchParams({
    page: currPage.toString(),
    limit: lim.toString(),
  });
  const resp = await api.get<ApiResponse<DepartmentType[]>>(
    `/department?${params.toString()}`,
  );

  return resp.data; // Let say there's only < 20 depts
};
