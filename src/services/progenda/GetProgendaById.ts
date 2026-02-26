import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { ProgendaType } from "@/types/data/ProgendaType";

export const GetProgendaById = async (
  progendaId: string,
): Promise<ApiResponse<ProgendaType>> => {
  const resp = await api.get<ApiResponse<ProgendaType>>(
    `/progenda/${progendaId}`,
  );

  return resp.data;
};
