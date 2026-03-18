import api from "@/lib/axios";
import { ApiResponse } from "@/types/commons/apiResponse";
import { CreateMemberType } from "@/types/data/CreateMember";

export const PutUpdateMember = async (
  id: string,
  data: Partial<CreateMemberType>,
): Promise<ApiResponse<CreateMemberType>> => {
  const resp = await api.put<ApiResponse<CreateMemberType>>(
    `/member/${id}`,
    data,
  );

  return resp.data;
};
