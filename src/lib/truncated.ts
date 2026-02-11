// truncated.ts adalah function untuk memangkas dan menampilkan sebanyak num karakter string

function truncate({ text, max = 150 }: { text: string; max?: number }) {
  return text.length > max ? text.slice(0, max) + "..." : text;
}

export default truncate;

// Cara pakai {truncate({text:..., max:...})}
