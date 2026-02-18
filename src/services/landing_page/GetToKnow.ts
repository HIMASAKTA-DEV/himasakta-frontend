// untuk data fetching GetToKnow.tsx

import { ApiResponse } from "@/types/commons/apiResponse";
import { MonthlyEvent } from "@/types/data/GetToKnow";

// config base_url using env later
const BASE_URL = "https://himasakta-backend.vercel.app/api/v1";

export const getEventThisMonth = async () => {
  const resp = await fetch(`${BASE_URL}/monthly-event/this-month`, {
    cache: "no-store",
  });

  if (!resp.ok) {
    throw new Error("Failed to load event this month");
  }

  const json: ApiResponse<MonthlyEvent[]> = await resp.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json.data.slice(0, 5);
};
