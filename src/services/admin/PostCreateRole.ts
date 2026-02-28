import api from "@/lib/axios";
import { ApiResponse } from "@/types/commons/apiResponse";
import { CreateRoleType } from "@/types/data/CreateRole";

export const PostCreateRole = async (
  data: CreateRoleType,
): Promise<ApiResponse<CreateRoleType>> => {
  const resp = await api.post<ApiResponse<CreateRoleType>>(`/role`, data);

  return resp.data;
};
