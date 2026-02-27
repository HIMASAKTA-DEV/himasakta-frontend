"use client";

import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { HiOutlineUpload } from "react-icons/hi";

import Typography from "@/components/Typography";

export default function AddNewsPage() {
  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Typography
          variant="h1"
          className="font-averia text-black text-5xl font-bold mb-10"
        >
          Add Post
        </Typography>

        <div className="flex flex-col lg:flex-row gap-12 md:gap-16">
          {/* Left Column: Form Fields */}
          <div className="flex-1 lg:max-w-[55%] flex flex-col gap-6">
            <div>
              <label className="block text-black font-semibold mb-2 text-[15px]">
                Title
              </label>
              <input
                type="text"
                placeholder="Insert post title..."
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-black font-semibold mb-2 text-[15px]">
                  Publish Date
                </label>
                <input
                  type="text"
                  placeholder="Insert project title..."
                  className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-2 text-[15px]">
                  Author
                </label>
                <input
                  type="text"
                  placeholder="Written by..."
                  className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-black font-semibold mb-2 text-[15px]">
                Short Description
              </label>
              <input
                type="text"
                placeholder="Insert short description..."
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-black font-semibold mb-2 text-[15px]">
                Tags
              </label>
              <input
                type="text"
                placeholder="Add tags separated by comma, ex: Pendidikan, ..."
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-black font-semibold mb-2 text-[15px]">
                Content
              </label>
              <textarea
                placeholder="Insert text here..."
                rows={6}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all resize-none font-medium"
              ></textarea>
            </div>

            <div className="mt-6">
              <Link
                href="/admin#manage-news"
                className="w-fit flex items-center gap-2 bg-[#12182B] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all font-medium text-sm"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </div>
          </div>

          {/* Middle Divider */}
          <div className="hidden lg:block w-[1px] bg-gray-200 min-h-full"></div>

          {/* Right Column: Image Upload & Publish */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <label className="block text-black font-semibold mb-2 text-[15px]">
                Headline Image
              </label>
              <div className="w-full aspect-[4/3] bg-[#f8fafc] border-2 border-dashed border-[#d1d9e2] rounded-2xl flex flex-col items-center justify-center text-[#9BA5B7] cursor-pointer hover:bg-slate-100 transition-all">
                <HiOutlineUpload size={36} className="mb-4" />
                <p className="font-averia italic text-[22px]">
                  Upload your image here
                </p>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button className="bg-primaryPink text-white px-8 py-3 w-40 rounded-[10px] hover:bg-opacity-90 transition-all font-medium text-[15px] shadow-sm">
                Publish Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
