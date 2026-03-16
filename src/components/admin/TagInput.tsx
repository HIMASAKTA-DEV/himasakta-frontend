"use client";

import { useEffect, useState } from "react";
import { HiOutlineHashtag, HiOutlineTrash } from "react-icons/hi";

interface TagInputProps {
  value: string; // comma separated string
  onChange: (value: string) => void;
  error?: string;
}

export default function TagInput({ value, onChange, error }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  // Helper to parse comma string to #tags
  const parseTags = (val: string) => {
    return val
      ? val
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .map((t) => (t.startsWith("#") ? t : `#${t}`))
      : [];
  };

  const [tags, setTags] = useState<string[]>(() => parseTags(value));

  // Sync from external value
  useEffect(() => {
    const list = parseTags(value);

    // Only update if different to avoid infinite loop
    if (list.join(",") !== tags.join(",")) {
      setTags(list);
    }
  }, [value]);

  const validateTag = (tag: string) => {
    // 1. Remove # if user typed it
    let clean = tag.replace(/^#+/, "");

    // 2. Max length 20
    if (clean.length > 20) clean = clean.slice(0, 20);

    // 3. Alphanumeric and dash, no leading dash
    // Remove invalid chars
    clean = clean.replace(/[^a-zA-Z0-9-]/g, "");
    // Remove leading dashes
    clean = clean.replace(/^-+/, "");

    return clean;
  };

  const addTag = (tag: string) => {
    const clean = validateTag(tag);
    if (!clean) return;

    const formatted = `#${clean}`;
    if (!tags.includes(formatted)) {
      const newTags = [...tags, formatted];
      setTags(newTags);
      onChange(newTags.join(","));
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((t) => t !== tagToRemove);
    setTags(newTags);
    onChange(newTags.join(","));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`flex flex-wrap items-center gap-2 w-full bg-[#f8fafc] border rounded-xl px-4 py-2 min-h-[50px] transition-all focus-within:ring-2 focus-within:ring-primaryPink/50 ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-pink-50 text-primaryPink px-3 py-1 rounded-full text-sm font-medium border border-pink-100"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-pink-700 transition-colors"
            >
              <HiOutlineTrash size={14} />
            </button>
          </span>
        ))}

        <div className="flex-1 flex items-center gap-2 min-w-[120px]">
          <HiOutlineHashtag className="text-gray-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag(inputValue)}
            placeholder="Type and comma..."
            className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-[#9BA5B7] placeholder:italic text-sm py-1"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      <p className="text-[10px] text-gray-400 mt-1 italic">
        Max 20 chars, alphanumeric & dash only.
      </p>
    </div>
  );
}
