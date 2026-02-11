import Link from "next/link";
import NoImage from "../commons/NoImg";
import { useState } from "react";
import Image from "next/image";
import { newsType } from "@/types/_dummy_db/allTypes";
import HashTags from "../commons/HashTags";

function NewsImage({ src, alt = "No Image" }: { src?: string; alt?: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <NoImage className="w-full h-full" text="No Image" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      onError={() => setError(true)}
    />
  );
}

// pemaakaian <NewsComps news={news} />

export default function NewsComps({ news }: { news: newsType }) {
  return (
    <div key={news.id} className="flex flex-col gap-3">
      {/* IMAGE */}
      <Link
        href={`/news/${news.id}`}
        className="group relative w-full h-[140px] lg:h-[180px] rounded-xl overflow-hidden"
      >
        <NewsImage src={news.image} alt={news.title} />

        {/* OVERLAY */}
        <div
          className="
            absolute inset-0 bg-black/50 opacity-0 
            group-hover:opacity-50 
            group-active:opacity-70
            transition-all duration-300 z-30
          "
        />

        {/* VIEW DETAIL */}
        <p
          className="
            absolute inset-0 flex items-center justify-center
            font-bold font-inter text-xl lg:text-2xl text-white
            opacity-0
            group-hover:opacity-100
            group-active:opacity-100
            transition duration-300
            z-40
          "
        >
          View Detail
        </p>
      </Link>

      {/* TITLE */}
      <Link href={`/news/${news.id}`}>
        <h3 className="font-semibold text-base lg:text-lg line-clamp-2 hover:underline active:text-primaryGreen">
          {news.title}
        </h3>
      </Link>

      {/* HASHTAGS */}
      <HashTags tags={news.hashtags} />

      {/* TAGLINE */}
      <Link href={`/news/${news.id}`}>
        <p className="text-sm text-gray-500 line-clamp-2 hover:text-gray-700 transition active:text-primaryGreen">
          {news.tagline}
        </p>
      </Link>

      {/* CONTENT */}
      <Link href={`/news/${news.id}`}>
        <p className="text-sm text-gray-600 line-clamp-2 lg:line-clamp-3 hover:text-gray-800 transition active:text-primaryGreen">
          {news.content}
        </p>
      </Link>
    </div>
  );
}
