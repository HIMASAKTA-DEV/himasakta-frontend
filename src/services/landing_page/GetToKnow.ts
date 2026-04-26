import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { MonthlyEvent } from "@/types/data/GetToKnow";

export const GetEventThisMonth = async (
  limit: number = 20,
): Promise<ApiResponse<MonthlyEvent[]>> => {
  const resp = await api.get<ApiResponse<MonthlyEvent[]>>(
    `/monthly-event/this-month?limit=${limit}`,
  );

  return resp.data;
};
