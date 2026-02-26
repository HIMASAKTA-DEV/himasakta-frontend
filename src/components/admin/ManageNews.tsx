import { useState } from "react";
import { FaChevronLeft, FaPlus } from "react-icons/fa";
import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUpload,
} from "react-icons/hi";

import NextImage from "../NextImage";
import Typography from "../Typography";
import HeaderSection from "../commons/HeaderSection";
import ButtonLink from "../links/ButtonLink";

const newsData = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: "Lorem ipsum dolor sit amet.",
  date: "09 Februari 2026",
  image: "/_dummy_images/no1.jpg",
}));

function ManageNews() {
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  if (editingPostId !== null) {
    return (
      <div className="p-10 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Typography
            variant="h1"
            className="font-averia text-black text-5xl font-bold mb-10"
          >
            Edit Post
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
                <button
                  onClick={() => setEditingPostId(null)}
                  className="flex items-center gap-2 bg-[#12182B] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all font-medium text-sm"
                >
                  <FaChevronLeft size={12} /> Back
                </button>
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

  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-10 max-w-7xl mx-auto">
        <div>
          <HeaderSection
            title="Manage Posts"
            titleStyle="font-averia text-black text-5xl"
            className="gap-0"
          />
          <Typography
            variant="p"
            className="text-gray-600 mt-2 font-averia italic"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </Typography>
        </div>
        <ButtonLink
          href=""
          className="bg-primaryPink hover:bg-[#C27A84] active:bg-[#C27A84] border-none rounded-xl py-3 px-8 h-fit text-white font-averia text-lg shadow-md transition-all active:scale-95 focus:outline-none"
          leftIcon={FaPlus}
        >
          Add Post
        </ButtonLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-7xl mx-auto">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="flex flex-col rounded-[24px] overflow-hidden shadow-sm transition-transform hover:scale-[1.02] duration-300 border border-gray-200"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "53/40" }}
            >
              <NextImage
                src={news.image}
                alt={news.title}
                width={800}
                height={600}
                className="w-full h-full object-cover rounded-t-[24px]"
                imgClassName="w-full h-full object-cover"
                serverStaticImg={true}
              />
            </div>
            <div className="p-6 flex flex-col flex-1 bg-[#EBEFF4]">
              <Typography
                variant="h6"
                className="font-bold text-[18px] leading-snug font-libertine text-black mb-4"
              >
                {news.title}
              </Typography>
              <div className="flex justify-between items-center mt-auto">
                <Typography
                  variant="p"
                  className="text-gray-800 text-[13px] font-medium font-libertine"
                >
                  {news.date}
                </Typography>
                <div className="flex gap-[8px]">
                  <button
                    onClick={() => setEditingPostId(news.id)}
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlinePencilAlt size={16} />
                  </button>
                  <button className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all">
                    <HiOutlineEye size={16} />
                  </button>
                  <button className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all">
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageNews;
