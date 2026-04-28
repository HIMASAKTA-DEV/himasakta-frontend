import api from "@/lib/axios";
import { ManageCabinet } from "@/types/admin/ManageCabinetType";
import { ApiResponse } from "@/types/commons/apiResponse";

export const GetManageCabinet = async (
  currPage: number,
  limit: number,
  search?: string,
): Promise<ApiResponse<ManageCabinet[]>> => {
  const resp = await api.get<ApiResponse<ManageCabinet[]>>(
    `/cabinet-info?page=${currPage}&limit=${limit}${search ? `&search=${search}` : ""}`,
  );

  return resp.data;
};
