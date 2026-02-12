interface HashTagsProps {
  tags?: string[];
  maxShow?: number; // default 2, tampilin semua pakai tags.length
}

function normalizeTag(tag: string) {
  return tag.trim().replace(/^#+/, "");
}

export default function HashTags({ tags = [], maxShow = 2 }: HashTagsProps) {
  if (!tags.length) return null;

  const visibleTags = tags.slice(0, maxShow);
  const remaining = tags.length - visibleTags.length;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map((tag, idx) => {
        const cleanTag = normalizeTag(tag);

        return (
          <span
            key={idx}
            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
          >
            #{cleanTag}
          </span>
        );
      })}

      {remaining > 0 && (
        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
          +{remaining}
        </span>
      )}
    </div>
  );
}
