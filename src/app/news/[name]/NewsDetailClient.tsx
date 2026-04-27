"use client";

import NotFound from "@/app/not-found";
import AdvanceHashTags from "@/components/commons/AdvanceHastags";
import BackToTop from "@/components/commons/BackToTop";
import HeaderSection from "@/components/commons/HeaderSection";
import ImageFallback from "@/components/commons/ImageFallback";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import SkeletonHeaderSection from "@/components/commons/skeletons/SkeletonHeaderSection";
import SkeletonParagraph from "@/components/commons/skeletons/SkeletonParagraph";
import SkeletonSection from "@/components/commons/skeletons/SkeletonSection";
import ButtonLink from "@/components/links/ButtonLink";
import Layout from "@/layouts/Layout";
import { normalizeHashtags } from "@/lib/normalizeHashTags";
import { GetNewsByNameOrSlug } from "@/services/news/[name]/FetchNewsByNameOrSlug";
import { NewsType } from "@/types/data/InformasiBerita";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

export default function NewsDetailClient() {
  const params = useParams();
  const [news, setNews] = useState<NewsType | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { name } = params;

  const fetchSingleNews = async (slug: string) => {
    setLoading(true);
    setError(false);

    try {
      const data = await GetNewsByNameOrSlug(slug);
      setNews(data);
    } catch (err) {
      console.error(err);
      setError(true);
      setNews(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const inp = Array.isArray(name) ? name[0] : name;
    fetchSingleNews(inp);
  }, [name]);

  if (error) {
    return <NotFound />;
  }

  const tags = normalizeHashtags(news?.tags || news?.hashtags);

  const footerNav = [
    {
      label: "Back",
      href: "/news",
    },
    {
      label: "Headline",
      href: `/news/${name}#headline`,
    },
    {
      label: "Content",
      href: `/news/${name}#content`,
    },
  ];
  return (
    <Layout
      withFooter
      withNavbar={false}
      transparentOnTop
      footerLinksData={footerNav}
    >
      <ButtonLink
        href="/news"
        className="w-28 flex gap-4 items-center m-8"
        variant="black"
      >
        <FaChevronLeft />
        <p>Back</p>
      </ButtonLink>
      <main className="min-h-screen px-10 flex flex-col lg:px-40 gap-4 mb-20">
        {loading ? (
          <>
            <SkeletonHeaderSection />
            <SkeletonParagraph />
            <SkeletonSection />
            <SkeletonParagraph />
          </>
        ) : (
          <div id="headline">
            <HeaderSection
              title={news?.title}
              sub={news?.tagline}
              subStyle="font-libertine text-2xl text-slate-700"
            />
            <p className="font-libertine text-xl text-slate-700 mb-10">
              Published on{" "}
              {news?.published_at
                ? new Date(news.published_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })
                : ""}{" "}
              &middot; By HIMASAKTA ITS
            </p>

            <div className="flex flex-col items-center justify-center mb-10">
              <div className="aspect-video relative w-full lg:w-[40vw] shadow-md hover:shadow-xl transition-all duration-300 rounded-xl hover:-translate-y-1">
                <ImageFallback
                  isFill
                  src={news?.thumbnail?.image_url}
                  imgStyle="rounded-xl"
                />
              </div>
            </div>
            <div id="content">
              {(news?.content ?? "").split("\n\n").map((p, idx) => (
                <MarkdownRenderer key={idx}>{p}</MarkdownRenderer>
              ))}
            </div>
            <AdvanceHashTags tags={tags} />
          </div>
        )}
      </main>
      <BackToTop />
    </Layout>
  );
}
