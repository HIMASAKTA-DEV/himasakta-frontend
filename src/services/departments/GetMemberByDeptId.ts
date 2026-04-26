import api from "@/lib/axios";
import type { ApiResponse } from "@/types/commons/apiResponse";
import type { MemberType } from "@/types/data/MemberType";

export const GetMemberByDeptId = async (
  deptId: string,
  limit: number = 50,
): Promise<ApiResponse<MemberType[]>> => {
  const resp = await api.get<ApiResponse<MemberType[]>>(
    `/member?filter_by=department_id&filter=${deptId}&limit=${limit}`,
  );

  return resp.data;
};
