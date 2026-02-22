import api from "@/lib/axios";
import type { ApiResponse } from "@/types/commons/apiResponse";
import { GalleryType } from "@/types/data/GalleryType";

export const GetGalleryByDeptId = async (
  deptId: string,
  curr: number,
  lim: number,
): Promise<ApiResponse<GalleryType[]>> => {
  const resp = await api.get<ApiResponse<GalleryType[]>>(
    `/gallery?filter_by=department_id&filter=${deptId}&page=${curr}&limit=${lim}`,
  );

  return resp.data;
};
