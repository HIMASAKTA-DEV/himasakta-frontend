// this is meta in json and it is optional

export type ApiMeta = {
  limit?: number;
  page?: number;
  total_data?: number;
  total_page?: number;
  sort?: string;
  sort_by?: string;
};
