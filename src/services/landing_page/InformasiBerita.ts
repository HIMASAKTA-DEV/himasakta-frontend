// untuk InformasiBerita.tsx

import { ApiMeta } from "@/types/commons/apiMeta";
import { ApiResponse } from "@/types/commons/apiResponse";
import { NewsType } from "@/types/data/InformasiBerita";

// config base_url using env later
const BASE_URL = "https://himasakta-backend.vercel.app/api/v1";

// ini sama kek GetAllNews ah sudahlah
export const Get12RecentNews = async ({ ...params }: ApiMeta) => {
  const metaParams = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  );

  const resp = await fetch(`${BASE_URL}/news?${metaParams}`, {
    cache: "no-store",
  });

  if (!resp.ok) {
    throw new Error("Failed to load recent News");
  }

  const json: ApiResponse<NewsType[]> = await resp.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json; // because we use meta parameter, we return everything.
};
