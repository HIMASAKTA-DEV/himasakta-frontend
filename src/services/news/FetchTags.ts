import { ApiMeta } from "@/types/commons/apiMeta";
import { ApiResponse } from "@/types/commons/apiResponse";

import { baseURL } from "@/lib/axios";

export type TagType = {
  id: string;
  name: string;
};

export const FetchTags = async ({
  limit = 15,
  ...params
}: ApiMeta & { search?: string }) => {
  const metaParams = new URLSearchParams(
    Object.entries({ limit, ...params })
      .filter(([_, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)]),
  );

  const resp = await fetch(`${baseURL}/news/tags?${metaParams.toString()}`);

  if (!resp.ok) {
    throw new Error("Failed to load news tags");
  }

  const json: ApiResponse<TagType[]> = await resp.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json;
};
