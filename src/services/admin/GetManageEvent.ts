import api from "@/lib/axios";
import { ManageEventsType } from "@/types/admin/ManageEvents";
import { ApiResponse } from "@/types/commons/apiResponse";

export const GetManageEvents = async (
  currPg: number,
  lim: number,
  search?: string,
): Promise<ApiResponse<ManageEventsType[]>> => {
  const resp = await api.get<ApiResponse<ManageEventsType[]>>(
    `/monthly-event?page=${currPg}&limit=${lim}${search ? `&search=${search}` : ""}`,
  );

  return resp.data;
};
