import api from "@/lib/axios";
import { ApiResponse } from "@/types/commons/apiResponse";
import { CreateMemberType } from "@/types/data/CreateMember";

export const PostCreateMember = async (
  data: CreateMemberType,
): Promise<ApiResponse<CreateMemberType>> => {
  const resp = await api.post<ApiResponse<CreateMemberType>>(`/member`, data);

  return resp.data;
};
