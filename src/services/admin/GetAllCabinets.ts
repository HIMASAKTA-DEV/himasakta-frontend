import api from "@/lib/axios";
import { ApiResponse } from "@/types/commons/apiResponse";
import { CabinetInfo } from "@/types/data/InformasiKabinet";

export const GetAllCabinets = async (
  currPage: number,
  limit: number,
): Promise<ApiResponse<CabinetInfo[]>> => {
  const resp = await api.get<ApiResponse<CabinetInfo[]>>(
    `/cabinet-info?page=${currPage}&limit=${limit}`,
  );

  return resp.data;
};
