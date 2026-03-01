// untuk InformasiKabinet.tsx , OrganigramSection.tsx

import { ApiResponse } from "@/types/commons/apiResponse";
import { CabinetInfo } from "@/types/data/InformasiKabinet";

import { baseURL } from "@/lib/axios";

export const getCurrentCabinetInfo = async () => {
  const resp = await fetch(`${baseURL}/current-cabinet`);

  if (!resp.ok) {
    throw new Error("Failed to load current cabinet info");
  }

  const respJson: ApiResponse<CabinetInfo> = await resp.json();

  if (!respJson.success) {
    throw new Error(respJson.message);
  }

  return respJson.data;
};
