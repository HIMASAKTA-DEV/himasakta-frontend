// mengubah data media ke hanya url

import { Media } from "@/types/commons/mediaType";

export function mediaToImages(media?: Media | Media[] | null): string[] {
  if (!media) return [];

  if (Array.isArray(media)) {
    return media
      .map((m) => m?.image_url)
      .filter((v): v is string => Boolean(v));
  }

  return media.image_url ? [media.image_url] : [];
}
