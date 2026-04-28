import api from "@/lib/axios";
import { ManageNewsType } from "@/types/admin/ManageNewsType";
import { ApiResponse } from "@/types/commons/apiResponse";

export const GetManageNews = async (
  currPg: number,
  lim: number,
  search?: string,
): Promise<ApiResponse<ManageNewsType[]>> => {
  const resp = await api.get<ApiResponse<ManageNewsType[]>>(
    `/news?page=${currPg}&limit=${lim}${search ? `&search=${search}` : ""}`,
  );

  return resp.data;
};
