// every req have this structure

import { ApiMeta } from "./apiMeta";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta: ApiMeta;
};
