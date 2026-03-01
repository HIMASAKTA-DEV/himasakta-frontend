// untuk InformasiBerita.tsx

import { ApiMeta } from "@/types/commons/apiMeta";
import { ApiResponse } from "@/types/commons/apiResponse";
import { NewsType } from "@/types/data/InformasiBerita";

import { baseURL } from "@/lib/axios";

// ini sama kek GetAllNews ah sudahlah
export const Get12RecentNews = async ({ ...params }: ApiMeta) => {
  const metaParams = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  );

  const resp = await fetch(`${baseURL}/news?${metaParams}`);

  if (!resp.ok) {
    throw new Error("Failed to load recent News");
  }

  const json: ApiResponse<NewsType[]> = await resp.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json; // because we use meta parameter, we return everything.
};
