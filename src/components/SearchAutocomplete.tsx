"use client";

import { getNewsAutocompletion } from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiSearch, HiX } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

export function SearchAutocomplete() {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (keyword.length >= 2) {
        setIsLoading(true);
        try {
          const results = await getNewsAutocompletion(keyword);
          setSuggestions(results);
          setIsOpen(true);
        } catch (error) {
          console.error("Autocompletion error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSearchTerm = (term: string) => {
    router.push(`/news?search=${encodeURIComponent(term)}`);
    setIsOpen(false);
    setKeyword("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/news?search=${encodeURIComponent(keyword)}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari berita..."
          className={twMerge(
            "w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100/50 border border-transparent transition-all duration-300",
            "focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none",
            "placeholder:text-slate-400 text-slate-700 text-sm",
          )}
        />
        <HiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
          size={20}
        />
        {keyword && (
          <button
            type="button"
            onClick={() => setKeyword("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <HiX size={16} />
          </button>
        )}
      </form>

      {/* Dropdown Suggestions */}
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-slate-500">
              <div className="inline-block w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
              Mencari...
            </div>
          ) : (
            <div className="py-2">
              <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Hasil Pencarian
              </div>
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchTerm(item)}
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <span className="line-clamp-1 group-hover:text-primary transition-colors">
                    {item}
                  </span>
                  <HiSearch
                    size={14}
                    className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
