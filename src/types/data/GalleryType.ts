import { ApiMeta } from "../commons/apiMeta";
import { Media } from "../commons/mediaType";

export interface GalleryType extends Media {
  meta: ApiMeta;
}
