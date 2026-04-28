import api from "@/lib/axios";
import type { ApiResponse } from "@/types/commons/apiResponse";
import type { MemberType } from "@/types/data/MemberType";

export const GetMemberByDeptIdPaginated = async (
  currPage: number,
  limit: number,
  deptId: string,
  search?: string,
): Promise<ApiResponse<MemberType[]>> => {
  const resp = await api.get<ApiResponse<MemberType[]>>(
    `/member?filter_by=department_id&filter=${deptId}&page=${currPage}&limit=${limit}${search ? `&search=${search}` : ""}`,
  );

  return resp.data;
};
