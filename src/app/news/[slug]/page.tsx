import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getNewsBySlug } from "@/services/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { FaArrowLeft, FaCalendar, FaTag } from "react-icons/fa";

type Props = {
  params: { slug: string };
};

export default async function NewsDetailPage({ params }: Props) {
  const news = await getNewsBySlug(params.slug);

  if (!news) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h1>
            <Link href="/news" className="text-primary hover:underline">
              Kembali ke Berita
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors"
          >
            <FaArrowLeft /> Kembali ke Berita
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-medium">
                <FaTag size={12} className="text-primary" />{" "}
                {news.tagline || "Berita"}
              </span>
              <span className="flex items-center gap-1">
                <FaCalendar size={12} />{" "}
                {format(new Date(news.published_at), "dd MMMM yyyy", {
                  locale: idLocale,
                })}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              {news.title}
            </h1>
          </div>

          <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden mb-10 shadow-lg">
            {news.thumbnail?.image_url ? (
              <img
                src={news.thumbnail.image_url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                No Image
              </div>
            )}
          </div>

          <article className="prose prose-lg prose-slate max-w-none">
            {/* Simple content rendering preserving newlines */}
            <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
              {news.content}
            </div>
          </article>

          {news.hashtags && (
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
              {news.hashtags.split(",").map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="text-sm text-primary bg-primary/5 px-3 py-1 rounded-full"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
