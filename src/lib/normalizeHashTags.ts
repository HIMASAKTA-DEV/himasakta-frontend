// ini digunakan untuk menormalisasi hashtag karena ternyata data json yg dikirim adalah string bukan array or string

export function normalizeHashtags(raw?: string | null): string[] {
  if (!raw) return [];

  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.replace(/^#+/, ""));
}
