// untuk news/page.tsx

import { ApiResponse } from "@/types/commons/apiResponse";
import { NewsType } from "@/types/data/InformasiBerita";

import { baseURL } from "@/lib/axios";

export const GetNewsByNameOrSlug = async (slug: string) => {
  const resp = await fetch(`${baseURL}/news/s/${slug}`);

  if (!resp.ok) {
    throw new Error("Failed to load recent News");
  }

  const json: ApiResponse<NewsType> = await resp.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json.data; // We don't need metadata
};
