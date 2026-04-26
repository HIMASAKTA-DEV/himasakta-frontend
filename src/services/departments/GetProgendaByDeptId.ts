import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { ProgendaType } from "@/types/data/ProgendaType";

export const GetProgendaByDeptId = async (
  deptId: string,
  limit: number = 50,
): Promise<ApiResponse<ProgendaType[]>> => {
  const resp = await api.get<ApiResponse<ProgendaType[]>>(
    `/progenda?filter_by=department_id&filter=${deptId}&limit=${limit}`,
  );

  return resp.data;
};
