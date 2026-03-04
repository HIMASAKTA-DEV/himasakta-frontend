"use client";

import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";

import Link from "next/link";
import NextImage from "../NextImage";
import Typography from "../Typography";
import HeaderSection from "../commons/HeaderSection";
import ButtonLink from "../links/ButtonLink";
import { useEffect, useState } from "react";
import { UUID } from "crypto";
import { ManageNewsType } from "@/types/admin/ManageNewsType";
import { GetManageNews } from "@/services/admin/GetManageNews";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import ImageFallback from "../commons/ImageFallback";
import RenderPagination from "../_news/RenderPagination";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

// const newsData = Array.from({ length: 6 }).map((_, i) => ({
//   id: i + 1,
//   title: "Lorem ipsum dolor sit amet.",
//   date: "09 Februari 2026",
//   image: "/_dummy_images/no1.jpg",
// }));

function ManageNews() {
  const [newsData, setNewsData] = useState<ManageNewsType[]>([]);
  const [currPg, setCurrPg] = useState(1);
  const [totPage, setTotPage] = useState(1);
  const [totData, setTotData] = useState(0);
  const [loadData, setLoadData] = useState(false);
  const LIM_NEWS = 6;

  useEffect(() => {
    const fetchManageNews = async () => {
      setLoadData(true);
      try {
        const json = await GetManageNews(currPg, LIM_NEWS);
        setNewsData(json.data);
        setTotData(json.meta.total_data ?? 1);
        setTotPage(json.meta.total_page ?? 1);
      } catch (err) {
        console.error(err);
        alert(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
      } finally {
        setLoadData(false);
      }
    };

    fetchManageNews();
  }, [currPg]);

  if (loadData) {
    return (
      <div className="p-10 w-full min-h-screen flex items-center justify-center">
        <SkeletonPleaseWait />
      </div>
    );
  }
  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-10 max-w-7xl mx-auto">
        <div className="flex items-center lg:justify-between gap-4 max-lg:flex-col w-full">
          <div>
            <HeaderSection
              title="Manage Posts"
              titleStyle="font-averia text-black text-5xl max-lg:text-3xl"
              className="gap-0"
            />
            <Typography
              variant="p"
              className="text-gray-600 mt-2 font-averia italic"
            >
              Atur publikasi berita di website
            </Typography>
          </div>
          <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90  active:opacity-80 duration-300 transition-all max-lg:text-sm">
            <Link href="/admin/news/add">+ Add Post</Link>
          </button>
        </div>
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
              <ImageFallback
                src={news.thumbnail?.image_url}
                alt={news.title}
                isFill
                imgStyle="w-full h-full object-cover"
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
                  className="text-gray-800 font-medium font-libertine text-[10px]"
                >
                  Published at:
                  <br />
                  {new Date(news.published_at).toLocaleString("id-ID")}
                </Typography>
                <div className="flex gap-[8px]">
                  <Link
                    href={`/admin/news/${news.id}/edit`}
                    target="_blank"
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlinePencilAlt size={16} />
                  </Link>
                  <button className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all">
                    <Link href={`/news/${news.id}`}>
                      <HiOutlineEye size={16} />
                    </Link>
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
      {/* Footer: Showing X of Y + Pagination + Publish */}
      <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row mt-8">
        <p className="font-libertine text-sm text-primaryPink">
          Showing {Math.min(currPg * LIM_NEWS, totData)} of {totData} in current
          selection
        </p>

        {/* Pagination controls */}
        <div className="flex items-center gap-3">
          {/* Prev page */}
          <button
            disabled={currPg === 1 || loadData}
            onClick={() => setCurrPg((p) => p - 1)}
            className={`p-2 rounded-md border disabled:opacity-40 
                          hover:bg-gray-100 transition flex items-center gap-4
                          ${currPg === 1 || loadData ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {/* icon kiri */}
            &lt;
          </button>

          {/* Page numbers */}
          <RenderPagination
            currPage={currPg}
            totPage={totPage}
            onChange={setCurrPg}
          />

          {/* Next page */}
          <button
            disabled={currPg === totPage || loadData}
            onClick={() => setCurrPg((p) => p + 1)}
            className={`p-2 rounded-md border disabled:opacity-40 
                          hover:bg-gray-100 transition flex items-center gap-4
                          ${currPg === totPage || loadData ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {/* icon kanan */}
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageNews;
