// ini digunakan untuk menormalisasi hashtag karena ternyata data json yg dikirim adalah string bukan array or string
// update: sekarang bisa menangani data array of objects juga (tags)

export function normalizeHashtags(
  raw?: string | { id: string; name: string }[] | null,
): string[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.map((t) => t.name.replace(/^#+/, ""));
  }

  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.replace(/^#+/, ""));
}
