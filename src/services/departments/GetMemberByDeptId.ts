import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { MemberType } from "@/types/data/MemberType";

export const GetMemberByDeptId = async (
  deptId: string,
): Promise<ApiResponse<MemberType[]>> => {
  const resp = await api.get<ApiResponse<MemberType[]>>(
    `/member?filter_by=department_id&filter=${deptId}`,
  );

  return resp.data;
};
