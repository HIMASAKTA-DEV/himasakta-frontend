"use client";

import { useState } from "react";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft, FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

import Typography from "@/components/Typography";
import Link from "next/link";

export default function EditCabinetPage({
  params: _params,
}: {
  params: { id: string };
}) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [content, setContent] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  return (
    <div className="min-h-screen bg-white p-4 lg:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <Typography
          variant="h1"
          className="mb-10 font-averia text-4xl font-bold text-black lg:text-5xl"
        >
          Edit Informasi Kabinet
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

            {/* Sub-title Field */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Sub-title
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Insert short description..."
                className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
              />
            </div>

            {/* Visi Field */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Visi
              </label>
              <textarea
                value={visi}
                onChange={(e) => setVisi(e.target.value)}
                placeholder="Insert text here..."
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
              />
            </div>

            {/* Misi Field */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Misi
              </label>
              <textarea
                value={misi}
                onChange={(e) => setMisi(e.target.value)}
                placeholder="Insert text here..."
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
              />
            </div>

            {/* Content Field with Rich Text Toolbar */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Content
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
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Insert text here..."
                  rows={5}
                  className="w-full resize-none bg-transparent px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] focus:outline-none"
                />
              </div>
            </div>

            {/* Period Date Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-[15px] font-semibold text-black">
                  Period Start Date
                </label>
                <div className="relative">
                  <FaRegCalendarAlt
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA5B7]"
                  />
                  <input
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    placeholder="Pick a date"
                    className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] py-3 pl-10 pr-4 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[15px] font-semibold text-black">
                  Period End Date
                </label>
                <div className="relative">
                  <FaRegCalendarAlt
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA5B7]"
                  />
                  <input
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    placeholder="Pick a date"
                    className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] py-3 pl-10 pr-4 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  />
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6">
              <Link
                href="/admin#manage-cabinet"
                className="flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-opacity-90"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </div>
          </div>

          {/* Right Column: Image & Save */}
          <div className="flex flex-1 flex-col">
            {/* Headline Image */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Headline Image
              </label>
              <div
                className="flex w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-[#f8fafc]"
                style={{ aspectRatio: "4/3" }}
              >
                <p className="text-sm italic text-[#9BA5B7]">
                  No image uploaded
                </p>
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
