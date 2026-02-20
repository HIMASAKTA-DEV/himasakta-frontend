export interface PhotoType {
  id: string;
  image_url: string;
  caption: string;
  category: string;
  department_id?: string | null;
  progenda_id?: string | null;
  cabinet_id?: string | null;
}
