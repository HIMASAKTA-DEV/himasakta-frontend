// untuk news/page.tsx

import { ApiResponse } from "@/types/commons/apiResponse";
import { NewsType } from "@/types/data/InformasiBerita";

// config base_url using env later
const BASE_URL = "https://himasakta-backend.vercel.app/api/v1";

export const GetNewsByNameOrSlug = async (slug: string) => {
  const resp = await fetch(`${BASE_URL}/news/${slug}`, {
    cache: "no-store",
  });

  if (!resp.ok) {
    throw new Error("Failed to load recent News");
  }

  const json: ApiResponse<NewsType> = await resp.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json.data; // We don't need metadata
};
