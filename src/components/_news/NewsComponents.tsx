"use client";

import { normalizeHashtags } from "@/lib/normalizeHashTags";
import { NewsType } from "@/types/data/InformasiBerita";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import HashTags from "../commons/HashTags";
import ImageFallback from "../commons/ImageFallback";

export default function NewsComps({ ...news }: NewsType) {
  // wajib normalize tags ke string[]
  const tags = normalizeHashtags(news.hashtag);

  return (
    <div key={news.id} className="flex flex-col gap-3 group/card">
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
        <Link href={`/news/${news.id}`}>
          <h3 className="font-semibold text-base lg:text-lg line-clamp-2 hover:underline active:text-primaryGreen transition-colors">
            {news.title}
          </h3>
        </Link>

        {tags && <HashTags tags={tags} />}

        <div className="space-y-1">
          <Link href={`/news/${news.id}`}>
            <p className="text-sm text-gray-500 line-clamp-1 italic hover:text-gray-700 transition active:text-primaryGreen">
              {news.tagline}
            </p>
          </Link>

          <Link href={`/news/${news.id}`}>
            <p className="text-sm text-gray-600 line-clamp-2 lg:line-clamp-3 hover:text-gray-800 transition active:text-primaryGreen">
              {news.content}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
