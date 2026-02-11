import Image from "next/image";
import { notFound } from "next/navigation";
import beritaDataAllRaw from "@/lib/_dummy_db/_berita/dummyBeritaDataAll.json";
import { newsType } from "@/types/_dummy_db/allTypes";
import HashTags from "@/components/commons/HashTags";

const beritaDataAll: newsType[] = beritaDataAllRaw;

interface PageProps {
  params: {
    id: string;
  };
}

export default function NewsDetailPage({ params }: PageProps) {
  const news = beritaDataAll.find((item) => item.id === params.id);

  if (!news) return notFound();

  return (
    <article className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-6">
      {/* TITLE */}
      <h1 className="text-3xl lg:text-4xl font-bold">{news.title}</h1>

      {/* META */}
      <div className="flex flex-col gap-2 text-gray-500 text-sm">
        <span>{news.date}</span>
        <p className="italic">{news.tagline}</p>
      </div>

      {/* IMAGE */}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
        <Image
          src={news.image}
          alt={news.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* HASHTAGS */}
      <HashTags tags={news.hashtags} />

      {/* CONTENT */}
      <div className="prose prose-gray max-w-none">
        <p>{news.content}</p>
      </div>
    </article>
  );
}
