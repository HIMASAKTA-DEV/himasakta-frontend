// untuk data fetching GetToKnow.tsx

import { ApiResponse } from "@/types/commons/apiResponse";
import { MonthlyEvent } from "@/types/data/GetToKnow";

import { baseURL } from "@/lib/axios";

export const getEventThisMonth = async () => {
  const resp = await fetch(`${baseURL}/monthly-event/this-month`);

  if (!resp.ok) {
    throw new Error("Failed to load event this month");
  }

  const json: ApiResponse<MonthlyEvent[]> = await resp.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json;
};
