// untuk news/page.tsx

import { ApiMeta } from "@/types/commons/apiMeta";
import { ApiResponse } from "@/types/commons/apiResponse";
import { NewsType } from "@/types/data/InformasiBerita";

import { baseURL } from "@/lib/axios";

export const GetAllNews = async ({
  ...params
}: ApiMeta & { search?: string; tags?: string; slug?: string }) => {
  const metaParams = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)]),
  );

  const resp = await fetch(`${baseURL}/news?${metaParams.toString()}`);

  if (!resp.ok) {
    const errorJson = await resp.json().catch(() => ({}));
    throw new Error(errorJson.message || `Failed to load news: ${resp.status}`);
  }

  const json: ApiResponse<NewsType[]> = await resp.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json; // because we use meta parameter, we return everything.
};
