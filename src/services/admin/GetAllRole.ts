import api from "@/lib/axios";
import { ApiResponse } from "@/types/commons/apiResponse";
import { RoleType } from "@/types/data/RoleType";

export const GetAllRole = async (
  currPage: number,
  limit: number,
): Promise<ApiResponse<RoleType[]>> => {
  const resp = await api.get<ApiResponse<RoleType[]>>(
    `/role?page=${currPage}&limit=${limit}`,
  );

  return resp.data;
};
