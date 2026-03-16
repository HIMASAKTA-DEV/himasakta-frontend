// ini digunakan untuk menormalisasi hashtag karena ternyata data json yg dikirim adalah string bukan array or string

export function normalizeHashtags(
  raw?: string | { id: string; name: string }[] | null,
): string[] {
  if (!raw) return [];

  // If it's already an array of objects
  if (Array.isArray(raw)) {
    return raw.map((t) => {
      const name = t.name.trim();
      return name.startsWith("#") ? name : `#${name}`;
    });
  }

  // Legacy string format
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`));
}
