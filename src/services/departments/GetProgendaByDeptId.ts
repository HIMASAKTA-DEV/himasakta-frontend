import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { ProgendaType } from "@/types/data/ProgendaType";

export const GetProgendaByDeptId = async (
  deptId: string,
): Promise<ApiResponse<ProgendaType[]>> => {
  const resp = await api.get<ApiResponse<ProgendaType[]>>(
    `/progenda?filter_by=department_id&filter=${deptId}`,
  );

  return resp.data;
};
