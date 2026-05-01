import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import { KeyboardEvent, useRef, useState } from "react";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Tulis markdown di sini...",
  minHeight = "200px",
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (before: string, after = before) => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);

    let prefix = "";
    if (before === "1. " || before === "- ") {
      const textBefore = value.slice(0, start);
      prefix = textBefore === "" || textBefore.endsWith("\n") ? "" : "\n";
    }

    const newValue =
      value.slice(0, start) +
      prefix +
      before +
      selected +
      after +
      value.slice(end);
    onChange(newValue);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + prefix.length + before.length,
        start + prefix.length + before.length + selected.length,
      );
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      const el = e.currentTarget;
      const start = el.selectionStart;
      const beforeCursor = value.slice(0, start);
      const lines = beforeCursor.split("\n");
      const lastLine = lines[lines.length - 1];

      // Match ordered list: e.g. "1. ", " 2. "
      const olMatch = lastLine.match(/^(\s*)(\d+)\.\s(.*)/);
      // Match unordered list: e.g. "- ", "  - "
      const ulMatch = lastLine.match(/^(\s*)-\s(.*)/);

      if (olMatch) {
        e.preventDefault();
        const indent = olMatch[1];
        const num = parseInt(olMatch[2], 10);
        const content = olMatch[3];

        if (content.trim() === "") {
          // If empty list item, remove it
          const newValue =
            value.slice(0, start - lastLine.length) + value.slice(start);
          onChange(newValue);
          setTimeout(() => {
            el.selectionStart = el.selectionEnd = start - lastLine.length;
          }, 0);
        } else {
          // Add next number
          const insertText = `\n${indent}${num + 1}. `;
          const newValue =
            value.slice(0, start) + insertText + value.slice(start);
          onChange(newValue);
          setTimeout(() => {
            el.selectionStart = el.selectionEnd = start + insertText.length;
          }, 0);
        }
      } else if (ulMatch) {
        e.preventDefault();
        const indent = ulMatch[1];
        const content = ulMatch[2];

        if (content.trim() === "") {
          const newValue =
            value.slice(0, start - lastLine.length) + value.slice(start);
          onChange(newValue);
          setTimeout(() => {
            el.selectionStart = el.selectionEnd = start - lastLine.length;
          }, 0);
        } else {
          const insertText = `\n${indent}- `;
          const newValue =
            value.slice(0, start) + insertText + value.slice(start);
          onChange(newValue);
          setTimeout(() => {
            el.selectionStart = el.selectionEnd = start + insertText.length;
          }, 0);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex w-44 overflow-hidden rounded-lg border text-sm">
        <button
          type="button"
          onClick={() => setMode("edit")}
          className={`flex-1 px-4 py-1.5 font-medium transition ${
            mode === "edit"
              ? "bg-primaryPink text-white"
              : "bg-white text-gray-500 hover:bg-gray-100"
          }`}
        >
          Markdown
        </button>
        <button
          type="button"
          onClick={() => setMode("preview")}
          className={`flex-1 px-4 py-1.5 font-medium transition ${
            mode === "preview"
              ? "bg-primaryPink text-white"
              : "bg-white text-gray-500 hover:bg-gray-100"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#f8fafc]">
        {mode === "edit" && (
          <>
            <div className="flex items-center gap-2 border-b bg-white px-3 py-2">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyFormat("**");
                }}
                className="rounded p-1 hover:bg-gray-100"
              >
                <BiBold size={18} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyFormat("*");
                }}
                className="rounded p-1 hover:bg-gray-100"
              >
                <BiItalic size={18} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyFormat("<u>", "</u>");
                }}
                className="rounded p-1 hover:bg-gray-100"
              >
                <BiUnderline size={18} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyFormat("- ", "");
                }}
                className="rounded p-1 hover:bg-gray-100"
              >
                <AiOutlineUnorderedList size={18} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyFormat("1. ", "");
                }}
                className="rounded p-1 hover:bg-gray-100"
              >
                <AiOutlineOrderedList size={18} />
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`min-h-[${minHeight}] w-full resize-y bg-[#f8fafc] p-4 font-medium text-gray-800 focus:outline-none`}
              style={{ minHeight }}
              placeholder={placeholder}
            />
          </>
        )}
        {mode === "preview" && (
          <div
            className={`prose min-h-[${minHeight}] w-full max-w-none bg-[#f8fafc] p-4`}
            style={{ minHeight }}
          >
            <MarkdownRenderer className="text-justify">
              {value || "_Tidak ada konten_"}
            </MarkdownRenderer>
          </div>
        )}
      </div>
    </div>
  );
}
