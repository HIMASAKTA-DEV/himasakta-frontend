"use client";

import CardNews from "@/components/_news/CardsNews";
import NewsComps from "@/components/_news/NewsComponents";
import RenderPagination from "@/components/_news/RenderPagination";
import HeaderSection from "@/components/commons/HeaderSection";
import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import ButtonLink from "@/components/links/ButtonLink";
import Layout from "@/layouts/Layout";
import beritaDataAllRaw from "@/lib/_dummy_db/_berita/dummyBeritaDataAll.json";
import { GetAllNews } from "@/services/news/FetchAllNews";
import type { newsType } from "@/types/_dummy_db/allTypes";
import { NewsType } from "@/types/data/InformasiBerita";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const NEWS_PER_PAGE = 9;
const MIN_LOADING_TIME = 1000;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(1);

  const [news, setNews] = useState<NewsType[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(false);

      const startTime = Date.now();

      try {
        const start = (currentPage - 1) * NEWS_PER_PAGE;
        const end = start + NEWS_PER_PAGE;
        const AllData = await GetAllNews({
          limit: NEWS_PER_PAGE,
          page: currentPage,
          sort: "asc",
          sort_by: "id",
        });
        const data = AllData.data.slice(start, end);

        setNews(data);
        setTotalPage(AllData.meta.total_page ?? 1);
        setTotalData(AllData.meta.total_data ?? 1);
        setHasNext(data.length === NEWS_PER_PAGE);
      } catch (err) {
        console.error(err);
        setError(true);
        setNews([]);
        setHasNext(false);
      } finally {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(MIN_LOADING_TIME - elapsed, 0);

        setTimeout(() => {
          setLoading(false);
        }, delay);
      }
    };

    fetchNews();
  }, [currentPage]);

  return (
    <Layout withFooter withNavbar={false} transparentOnTop>
      <ButtonLink
        href="/"
        className="w-28 flex gap-4 items-center m-8"
        variant="black"
      >
        <FaChevronLeft />
        <p>Home</p>
      </ButtonLink>
      <main className="min-h-screen px-10 flex flex-col lg:px-20 gap-6">
        <HeaderSection
          title="Informasi Berita"
          sub="Jangan lewatkan berita-berita penting dari HIMASAKTA"
          subStyle="font-libertine text-black"
        />

        {/* Search with autocomplete */}

        {loading ? (
          <SkeletonGrid
            count={NEWS_PER_PAGE}
            withDesc
            className="grid-cols-2 lg:grid-cols-3 gap-6"
          />
        ) : error || news.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p className="text-lg font-semibold">Belum ada berita</p>
            <p className="text-sm">Silakan cek kembali nanti.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n) => (
              <CardNews key={n.id} {...n} />
            ))}
          </section>
        )}

        <div className="flex items-center justify-between gap-6 py-10">
          <p className="font-libertine text-gray-500">
            Showing{" "}
            <span>{Math.min(totalData, currentPage * NEWS_PER_PAGE)}</span> news
            of <span>{totalData}</span> news
          </p>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {/* Prev page */}
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-md border disabled:opacity-40 hover:bg-gray-100 transition flex items-center gap-4"
            >
              <FaChevronLeft />
            </button>

            {/* Pagination */}
            <RenderPagination
              currPage={currentPage}
              totPage={totalPage}
              onChange={setCurrentPage}
            />

            {/* Next page */}
            <button
              disabled={!hasNext || loading}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-md border disabled:opacity-40 hover:bg-gray-100 transition flex items-center gap-4"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
