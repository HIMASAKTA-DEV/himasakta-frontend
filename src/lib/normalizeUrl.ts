export const normalizeLinks = (input?: unknown): string[] => {
  // Jika kosong (null/undefined)
  if (!input) return [];

  // Jika sudah berupa array, pastikan isinya string dan bersihkan
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }

  // Jika input adalah string, split berdasarkan koma
  if (typeof input === "string") {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
};
