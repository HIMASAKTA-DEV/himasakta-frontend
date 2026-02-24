import * as React from "react";
import { FaPlus } from "react-icons/fa";
import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";

import HeaderSection from "../commons/HeaderSection";
import ButtonLink from "../links/ButtonLink";
import NextImage from "../NextImage";
import Typography from "../Typography";

const newsData = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: "Lorem ipsum dolor sit amet.",
  date: "09 Februari 2026",
  image: "/_dummy_images/no1.jpg",
}));

function ManageNews() {
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
                  <button className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all">
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
