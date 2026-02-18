// untuk InformasiKabinet.tsx , OrganigramSection.tsx

import { ApiResponse } from "@/types/commons/apiResponse";
import { CabinetInfo } from "@/types/data/InformasiKabinet";

// config base_url using env later
const BASE_URL = "https://himasakta-backend.vercel.app/api/v1";

export const getCurrentCabinetInfo = async () => {
  const resp = await fetch(`${BASE_URL}/current-cabinet`, {
    cache: "no-store",
  });

  if (!resp.ok) {
    throw new Error("Failed to load current cabinet info");
  }

  const respJson: ApiResponse<CabinetInfo> = await resp.json();

  if (!respJson.success) {
    throw new Error(respJson.message);
  }

  return respJson.data;
};
