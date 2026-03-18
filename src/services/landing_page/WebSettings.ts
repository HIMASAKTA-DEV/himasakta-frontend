import { baseURL } from "@/lib/axios";
import { ApiResponse } from "@/types/commons/apiResponse";
import { GlobalSettings } from "@/types/data/GlobalSettings";

export const getWebSettings = async (): Promise<GlobalSettings> => {
  const resp = await fetch(`${baseURL}/settings/web`);

  if (!resp.ok) {
    throw new Error("Failed to load web settings");
  }

  const respJson: ApiResponse<GlobalSettings> = await resp.json();

  if (!respJson.success) {
    throw new Error(respJson.message);
  }

  return respJson.data;
};
