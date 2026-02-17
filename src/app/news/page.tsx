import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getAllNews } from "@/services/api";
import { News } from "@/types";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

type Props = {
  searchParams: { page?: string; search?: string };
};

export default async function NewsPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const limit = 9;

  const { data: news, meta } = await getAllNews(page, limit, search);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Berita & Artikel
              </h1>
              <p className="text-slate-500">
                Update terbaru seputar kegiatan dan informasi HIMASAKTA ITS
              </p>
            </div>

            {/* Search Form */}
            <form className="w-full md:w-auto relative">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Cari berita..."
                className="w-full md:w-80 pl-10 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </form>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {news.map((item: News) => (
              <Link
                href={`/news/${item.slug}`}
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="aspect-video bg-slate-200 relative overflow-hidden">
                  {item.thumbnail?.image_url ? (
                    <img
                      src={item.thumbnail.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                    {item.tagline || "Berita"}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs text-slate-500 mb-2 font-medium">
                    {format(new Date(item.published_at), "dd MMMM yyyy", {
                      locale: idLocale,
                    })}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">
                    {item.content.replace(/#|[*]/g, "").substring(0, 120)}...
                  </p>
                  <span className="text-primary font-semibold text-sm">
                    Baca Selengkapnya &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {news.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              Tidak ada berita ditemukan.
            </div>
          )}

          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <div className="flex justify-center gap-4">
              {page > 1 && (
                <Link
                  href={`/news?page=${page - 1}&search=${search}`}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FaChevronLeft size={12} /> Sebelumnya
                </Link>
              )}
              <span className="px-4 py-2 text-slate-500">
                Halaman {page} dari {meta.total_pages}
              </span>
              {page < meta.total_pages && (
                <Link
                  href={`/news?page=${page + 1}&search=${search}`}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
                >
                  Selanjutnya <FaChevronRight size={12} />
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
