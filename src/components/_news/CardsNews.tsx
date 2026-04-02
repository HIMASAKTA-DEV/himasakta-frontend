"use client";

import clsxm from "@/lib/clsxm";
import { normalizeHashtags } from "@/lib/normalizeHashTags";
import { NewsType } from "@/types/data/InformasiBerita";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import HashTags from "../commons/HashTags";
import ImageFallback from "../commons/ImageFallback";
import MarkdownRenderer from "../commons/MarkdownRenderer";

export default function CardNews({
  idx = 0,
  ...news
}: NewsType & { idx?: number }) {
  // wajib normalize tags ke string[]
  const tags = normalizeHashtags(news.tags || news.hashtags);

  return (
    <div
      className={`
        flex flex-col gap-3 group/card rounded-xl shadow-md hover:shadow-lg 
        transition-all duration-300 p-3
        ${idx % 2 === 0 ? "bg-primaryPinkLight" : "bg-white"}
      `}
    >
      <Link
        href={`/news/${news.slug}`}
        className="group relative w-full h-[140px] lg:h-[180px] rounded-xl overflow-hidden bg-gray-100"
      >
        {/* Overlay */}
        <div
          className="
            absolute inset-0 bg-black opacity-0 
            group-hover:opacity-40 
            transition-all duration-300 z-30
          "
        />
        <div
          className="
            absolute inset-0 flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-all duration-300 z-40
          "
        >
          <span
            className="
            flex items-center gap-2 text-white font-bold font-inter text-md lg:text-xl
            transition-colors duration-300 hover:text-primaryGreen
          "
          >
            View Detail
            <FaArrowRight className="w-6 h-6" />
          </span>
        </div>

        <ImageFallback
          src={news.thumbnail?.image_url}
          alt={news.title}
          isFill
        />
      </Link>

      {/* Text */}
      <div className="flex flex-col gap-2">
        <Link href={`/news/${news.slug}`}>
          <h3 className="font-semibold text-base lg:text-lg line-clamp-2 hover:underline active:text-primaryGreen transition-colors">
            {news.title}
          </h3>
        </Link>

        {tags && <HashTags tags={tags} clickable />}

        <div className="space-y-1">
          <Link href={`/news/${news.slug}`}>
            <p className="text-sm text-gray-500 line-clamp-1 italic hover:text-gray-700 transition active:text-primaryGreen">
              {news.tagline}
            </p>
          </Link>

          <Link href={`/news/${news.slug}`}>
            <div className="relative group text-sm text-gray-600 h-[72px] lg:h-[96px] overflow-hidden">
              <MarkdownRenderer>{news.content}</MarkdownRenderer>
              <div
                className={clsxm(
                  "pointer-events-none absolute bottom-0 left-0 w-full h-10 group-hover:h-24 bg-gradient-to-t transition-all duration-300 flex items-end justify-center",
                  idx % 2 === 0
                    ? "from-primaryPinkLight to-transparent"
                    : "from-white to-transparent",
                )}
              >
                <p className="pointer-events-auto text-sm font-semibold text-gray-600 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 mb-2">
                  Baca selengkapnya
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
