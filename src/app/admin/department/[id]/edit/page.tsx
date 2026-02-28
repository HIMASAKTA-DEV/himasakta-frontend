"use client";

import { useState } from "react";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa";
import {
  HiOutlinePencilAlt,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineUpload,
  HiX,
} from "react-icons/hi";

import Typography from "@/components/Typography";
import Link from "next/link";

type LinkItem = {
  id: number;
  label: string;
  url: string;
};

export default function EditDepartmentPage({
  params: _params,
}: { params: { id: string } }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([
    { id: 1, label: "Bank Soal Departemen", url: "" },
    { id: 2, label: "Silabus", url: "https://its.id/m/" },
  ]);

  const addLink = () => {
    setLinks((prev) => [...prev, { id: Date.now(), label: "", url: "" }]);
  };

  const removeLink = (id: number) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLink = (id: number, field: "label" | "url", value: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  };

  return (
    <div className="min-h-screen bg-white p-4 lg:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <Typography
          variant="h1"
          className="mb-10 font-averia text-4xl font-bold text-black lg:text-5xl"
        >
          Edit Department
        </Typography>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Left Column: Form */}
          <div className="flex flex-1 flex-col gap-6 lg:max-w-[55%]">
            {/* Title Field */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Insert post title..."
                className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
              />
            </div>

            {/* Description Field with Toolbar */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Description
              </label>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#f8fafc]">
                {/* Rich Text Toolbar */}
                <div className="flex items-center gap-1 border-b border-gray-200 px-3 py-2">
                  <button
                    type="button"
                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                  >
                    <BiBold size={18} />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                  >
                    <BiItalic size={18} />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                  >
                    <BiUnderline size={18} />
                  </button>
                  <div className="mx-1 h-5 w-px bg-gray-300" />
                  <button
                    type="button"
                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                  >
                    <AiOutlineUnorderedList size={18} />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                  >
                    <AiOutlineOrderedList size={18} />
                  </button>
                </div>
                {/* Textarea */}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Insert text here..."
                  rows={5}
                  className="w-full resize-none bg-transparent px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] focus:outline-none"
                />
              </div>
            </div>

            {/* Links Section */}
            <div>
              <label className="mb-3 block text-[15px] font-semibold text-black">
                Link
              </label>
              <div className="flex flex-col gap-3">
                {links.map((link) => (
                  <div key={link.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) =>
                          updateLink(link.id, "label", e.target.value)
                        }
                        placeholder="Label link..."
                        className="flex-1 rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                      />
                      <button
                        onClick={() => removeLink(link.id)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <HiX size={18} />
                      </button>
                    </div>
                    {link.url && (
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          updateLink(link.id, "url", e.target.value)
                        }
                        placeholder="https://..."
                        className="ml-0 rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-sm font-medium text-gray-600 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                      />
                    )}
                  </div>
                ))}

                {/* Add Link Button */}
                <button
                  onClick={addLink}
                  className="flex w-full items-center justify-between rounded-xl border border-dashed border-gray-300 bg-[#f8fafc] px-4 py-3 text-sm font-medium italic text-[#9BA5B7] transition-all hover:border-primaryPink hover:bg-pink-50/30 hover:text-primaryPink"
                >
                  Add Link
                  <HiOutlinePlus size={16} />
                </button>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6">
              <Link
                href="/admin#manage-department"
                className="flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-opacity-90"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </div>
          </div>

          {/* Right Column: Image & Save */}
          <div className="flex flex-1 flex-col">
            {/* Thumbnail Image */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Thumbnail Image
              </label>
              <div
                className="flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#d1d9e2] bg-[#f8fafc] transition-all hover:bg-slate-100"
                style={{ aspectRatio: "4/3" }}
              >
                <div className="flex flex-col items-center gap-4 text-[#9BA5B7]">
                  <HiOutlineUpload size={36} />
                  <p className="font-averia text-lg italic">
                    Upload your image here
                  </p>
                </div>
              </div>
            </div>

            {/* Image Action Buttons */}
            <div className="mt-4 flex flex-col gap-2">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 transition-all hover:bg-blue-100">
                <HiOutlinePencilAlt size={16} />
                Edit Image
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-100">
                <HiOutlineTrash size={16} />
                Delete Image
              </button>
            </div>

            {/* Save Changes */}
            <div className="mt-8 flex justify-end">
              <button className="rounded-[10px] bg-primaryPink px-8 py-3 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-opacity-90">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
