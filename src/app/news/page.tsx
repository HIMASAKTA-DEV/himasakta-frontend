"use client";

import NewsComps from "@/components/_news/NewsComponents";
import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import ButtonLink from "@/components/links/ButtonLink";
import Layout from "@/layouts/Layout";
import beritaDataAllRaw from "@/lib/_dummy_db/_berita/dummyBeritaDataAll.json";
import type { newsType } from "@/types/_dummy_db/allTypes";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const NEWS_PER_PAGE = 8;
const MIN_LOADING_TIME = 1000;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [news, setNews] = useState<newsType[]>([]);
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
        const data = (beritaDataAllRaw as newsType[]).slice(start, end);

        setNews(data);
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
      <main className="min-h-screen flex flex-col p-10 gap-6">
        <ButtonLink
          href="/"
          className="w-28 flex gap-4 items-center"
          variant="black"
        >
          <FaChevronLeft />
          <p>Home</p>
        </ButtonLink>

        {loading ? (
          <SkeletonGrid
            count={NEWS_PER_PAGE}
            withDesc
            className="grid-cols-2 lg:grid-cols-4 gap-6"
          />
        ) : error || news.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p className="text-lg font-semibold">Belum ada berita</p>
            <p className="text-sm">Silakan cek kembali nanti.</p>
          </div>
        ) : (
          <section className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((n) => (
              <NewsComps key={n.id} news={n} />
            ))}
          </section>
        )}

        <div className="flex items-center justify-between gap-6 py-10">
          <button
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-3 rounded-full border disabled:opacity-40 hover:bg-gray-100 transition flex items-center gap-4"
          >
            <FaChevronLeft />
            Back
          </button>

          <button
            disabled={!hasNext || loading}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-3 rounded-full border disabled:opacity-40 hover:bg-gray-100 transition flex items-center gap-4"
          >
            Next
            <FaChevronRight />
          </button>
        </div>
      </main>
    </Layout>
  );
}
