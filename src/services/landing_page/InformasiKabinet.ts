import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { CabinetInfo } from "@/types/data/InformasiKabinet";

export const GetCurrentCabinet = async (): Promise<
  ApiResponse<CabinetInfo>
> => {
  const resp = await api.get<ApiResponse<CabinetInfo>>(`/current-cabinet`);

  return resp.data;
};
