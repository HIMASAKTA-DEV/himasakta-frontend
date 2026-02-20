"use client";

import { useState } from "react";

interface HashTagsProps {
  tags?: string[];
  maxShow?: number; // default 3, tampilin semua pakai tags.length
}

function normalizeTag(tag: string) {
  return tag.trim().replace(/^#+/, "");
}

export default function AdvanceHashTags({
  tags = [],
  maxShow = 3,
}: HashTagsProps) {
  if (!tags.length) return null;

  const [showAll, setShowAll] = useState(false);

  const currMax = showAll ? tags.length : maxShow;
  const visibleTags = tags.slice(0, currMax);
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
        <span
          className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600"
          onClick={() => setShowAll(true)}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
}
