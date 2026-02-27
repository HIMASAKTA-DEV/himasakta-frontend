"use client";

import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { HiOutlineUpload } from "react-icons/hi";

import Typography from "@/components/Typography";

export default function EditGalleryPage({
  params: _params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Typography
          variant="h1"
          className="font-averia text-black text-5xl font-bold mb-10"
        >
          Edit Gallery
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
                Category
              </label>
              <input
                type="text"
                placeholder="Insert photo category..."
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-black font-semibold mb-2 text-[15px]">
                Department
              </label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium appearance-none">
                  <option value="">Departemen A</option>
                  <option value="dept-b">Departemen B</option>
                  <option value="dept-c">Departemen C</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/admin#manage-gallery"
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
                Image
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
