"use client";

import CardNews from "@/components/_news/CardsNews";
import RenderPagination from "@/components/_news/RenderPagination";
import BackToTop from "@/components/commons/BackToTop";
import HeaderSection from "@/components/commons/HeaderSection";
import SkeletonGrid from "@/components/commons/skeletons/SkeletonGrid";
import ButtonLink from "@/components/links/ButtonLink";
import Layout from "@/layouts/Layout";
import { baseURL } from "@/lib/axios";
import clsxm from "@/lib/clsxm";
import { GetAllNews } from "@/services/news/FetchAllNews";
import { FetchTags, TagType } from "@/services/news/FetchTags";
import { NewsType } from "@/types/data/InformasiBerita";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  FaCheck,
  FaChevronDown,
  FaChevronLeft,
  FaFilter,
  FaSearch,
  FaSortAmountUpAlt,
} from "react-icons/fa";

const NEWS_PER_PAGE = 9;
const MIN_LOADING_TIME = 1000;

function NewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const initialQuery = searchParams.get("s") || "";
  const initialSortBy = searchParams.get("sort_by") || "id";
  const initialTags = searchParams.get("tags")
    ? searchParams.get("tags")!.split(",")
    : [];

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(1);

  const [news, setNews] = useState<NewsType[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [_hasNext, setHasNext] = useState(false);
  const [error, setError] = useState(false);

  // global news data fetching
  const fetchNews = async (
    searchParams = "",
    sortBy = "id",
    tagsParams = "",
    slugParams = "",
  ) => {
    setLoading(true);
    setError(false);

    const startTime = Date.now();

    try {
      const params = {
        limit: NEWS_PER_PAGE,
        page: currentPage,
        sort: "asc",
        sort_by: sortBy, // opsional
        search: searchParams, // opsional
        tags: tagsParams, // optional
        slug: slugParams, // opsional
      };

      const AllData = await GetAllNews(params);

      const data = AllData.data;

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

  useEffect(() => {
    const s = searchParams.get("s") || "";
    const sort_by = searchParams.get("sort_by") || "id";
    const tagsStr = searchParams.get("tags") || "";
    const tagsArray = tagsStr ? tagsStr.split(",") : [];

    setQuery(s);
    setSortBy(sort_by);
    setSelectedTags(tagsArray);
    setCurrentPage(1); // Reset page on filter change

    const tagsWithHash = tagsArray.map((t) =>
      t.startsWith("#") ? t : `#${t}`,
    );
    fetchNews(s, sort_by, tagsWithHash.join(","));
  }, [searchParams]);

  useEffect(() => {
    const tagsWithHash = selectedTags.map((t) =>
      t.startsWith("#") ? t : `#${t}`,
    );
    fetchNews(query, sortBy, tagsWithHash.join(","));
  }, [currentPage]);

  // URL Sync helper
  const updateUrl = (
    newQuery: string,
    newSortBy: string,
    newTags: string[],
  ) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("s", newQuery);
    if (newSortBy && newSortBy !== "id") params.set("sort_by", newSortBy);
    params.set("sort", "asc"); // API requirement based on initial task
    if (newTags.length > 0) {
      params.set("tags", newTags.join(","));
    } else {
      params.delete("tags");
    }

    router.push(`/news?${params.toString()}`, { scroll: false });
  };

  // search bar handler
  const [query, setQuery] = useState(initialQuery);
  const [dropdown, setDropdown] = useState<string[]>([]);
  // dd = drop down
  const [showDd, setShowDd] = useState(false);
  const inputReference = useRef<HTMLInputElement>(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  const fetchDropdown = async (query: string) => {
    if (!query.trim()) {
      setDropdown([]);
      return;
    }

    try {
      // config for api, use from env later
      const params = new URLSearchParams({ search: query });
      const resp = await fetch(
        `${baseURL}/news/autocompletion?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      if (!resp.ok) throw new Error("Can't fetch suggestions");

      const json = await resp.json();
      if (!json.success) throw new Error(json.message);
      setDropdown(json.data ?? []);
    } catch (err) {
      console.error(err);
      setDropdown([]);
    }
  };

  const handleSubmitSearch = (ev: React.FormEvent) => {
    ev.preventDefault();
    setShowDd(false);
    setCurrentPage(1);
    const tagsWithHash = selectedTags.map((t) =>
      t.startsWith("#") ? t : `#${t}`,
    );
    updateUrl(query, sortBy, selectedTags);
    fetchNews(query, sortBy, tagsWithHash.join(","));
  };

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    if (!value.trim()) {
      setDropdown([]);
      setShowDd(false);
      setQuery("");
      const tagsWithHash = selectedTags.map((t) =>
        t.startsWith("#") ? t : `#${t}`,
      );
      updateUrl("", sortBy, selectedTags);
      fetchNews("", sortBy, tagsWithHash.join(","));
      return;
    }
    setQuery(value);
    setShowDd(true);
    fetchDropdown(value);
  };

  const handleSelectDd = (val: string) => {
    setQuery(val);
    setShowDd(false);
    setCurrentPage(1);
    const tagsWithHash = selectedTags.map((t) =>
      t.startsWith("#") ? t : `#${t}`,
    );
    updateUrl(val, sortBy, selectedTags);
    fetchNews(val, sortBy, tagsWithHash.join(","));
  };

  const handleSearchKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdown.length) return;

    switch (ev.key) {
      case "ArrowDown":
        ev.preventDefault();
        setActiveIdx((prev) => (prev + 1) % dropdown.length);
        break;
      case "ArrowUp":
        ev.preventDefault();
        setActiveIdx((prev) => (prev <= 0 ? dropdown.length - 1 : prev - 1));
        break;
      case "Enter":
        ev.preventDefault();
        if (activeIdx >= 0 && activeIdx < dropdown.length) {
          handleSelectDd(dropdown[activeIdx]);
        } else {
          handleSubmitSearch(ev);
        }
        break;
      case "Escape":
        setShowDd(false);
        break;
    }
  };

  // sort handler
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [showSortDd, setShowSortDd] = useState(false);

  const sortOpts = [
    {
      label: "Default",
      value: "id",
    },
    {
      label: "Judul",
      value: "title",
    },
    {
      label: "Tanggal",
      value: "published_at",
    },
  ];

  const handleSelectSort = (val: string) => {
    setSortBy(val);
    setShowSortDd(false);
    setCurrentPage(1);
    const tagsWithHash = selectedTags.map((t) =>
      t.startsWith("#") ? t : `#${t}`,
    );
    updateUrl(query, val, selectedTags);
    fetchNews(query, val, tagsWithHash.join(","));
  };

  // filter handler
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [showFilterDd, setShowFilterDd] = useState(false);
  const [tagQuery, setTagQuery] = useState("");

  const [filteredTags, setFilteredTags] = useState<TagType[]>([]);
  const [tagPage, setTagPage] = useState(1);
  const [hasMoreTags, setHasMoreTags] = useState(true);
  const [loadingTags, setLoadingTags] = useState(false);

  const fetchTheTags = async (page = 1, isLoadMore = false) => {
    setLoadingTags(true);
    try {
      const resp = await FetchTags({ search: tagQuery, page });
      const newTags = resp.data ?? [];

      if (isLoadMore) {
        setFilteredTags((prev) => [...prev, ...newTags]);
      } else {
        setFilteredTags(newTags);
      }

      // If we got fewer tags than the limit (15), there are no more tags
      setHasMoreTags(newTags.length === 15);
      setTagPage(page);
    } catch (err) {
      console.error("Failed to fetch tags", err);
      if (!isLoadMore) setFilteredTags([]);
    } finally {
      setLoadingTags(false);
    }
  };

  useEffect(() => {
    // Initial fetch of news matching URL params
    const tagsWithHash = initialTags.map((t) =>
      t.startsWith("#") ? t : `#${t}`,
    );
    fetchNews(initialQuery, initialSortBy, tagsWithHash.join(","));
  }, []); // Only on mount

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTheTags();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [tagQuery]);

  const handleToggleTag = (tag: string) => {
    let newTags: string[];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    setSelectedTags(newTags);
    setCurrentPage(1);

    // sync URL
    updateUrl(query, sortBy, newTags);

    const tagsWithHash = newTags.map((t) => (t.startsWith("#") ? t : `#${t}`));
    fetchNews(query, sortBy, tagsWithHash.join(","));
  };

  const handleLoadMoreTags = () => {
    if (loadingTags || !hasMoreTags) return;
    fetchTheTags(tagPage + 1, true);
  };

  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jika entry.isIntersecting FALSE, berarti sentinel sudah di atas layar
        // dan navigasi sudah menempel (sticky).
        setIsSticky(!entry.isIntersecting);
      },
      {
        // threshold 1 berarti 100% elemen harus terlihat untuk dianggap intersecting
        threshold: [1],
        rootMargin: "0px 0px 0px 0px",
      },
    );

    if (navRef.current) {
      observer.observe(navRef.current);
    }

    return () => {
      if (navRef.current) {
        observer.unobserve(navRef.current);
      }
    };
  }, []);

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
      <main className="min-h-screen flex flex-col gap-6">
        <HeaderSection
          title="Informasi Berita"
          sub="Jangan lewatkan berita-berita penting dari HIMASAKTA ITS"
          subStyle="font-libertine text-black"
          className="px-10 lg:px-20"
        />

        {/* Search with autocomplete */}
        <div className="w-full h-1 -mb-6" ref={navRef} />
        <div
          className={clsxm(
            "w-full flex flex-col lg:flex-row items-center gap-6 lg:justify-between sticky top-0 z-[999] bg-white/80 backdrop-blur-2xl py-8 px-10 lg:px-20",
            isSticky ? "shadow-md" : "",
          )}
        >
          <form
            className="relative w-full flex flex-row gap-2"
            onSubmit={handleSubmitSearch}
          >
            <ButtonLink
              href="/"
              className={clsxm(
                "items-center gap-2 lg:px-4 py-1 rounded-full shrink-0 transition-all duration-300",
                isSticky ? "opacity-100 flex" : "opacity-0 hidden",
              )}
              variant="black"
            >
              <FaChevronLeft />
              <span className="text-sm max-lg:hidden">Home</span>
            </ButtonLink>
            <div className="w-full">
              <FaSearch
                className={clsxm(
                  "absolute top-1/2 -translate-y-1/2 text-gray-400 z-[1000]",
                  isSticky
                    ? "landscape:left-[7.65rem] portrait:left-28"
                    : "left-5",
                )}
              />
              <input
                type="text"
                value={query}
                ref={inputReference}
                onChange={handleInputChange}
                onFocus={() => setShowDd(true)}
                placeholder="Cari berita..."
                className="w-full shadow-lg p-2 lg:p-4 border rounded-full bg-white/50 focus:bg-white transition-colors outline-none focus:ring-2 ring-primaryPink/50 pl-12 lg:pl-16"
                onKeyDown={handleSearchKeyDown}
              />
            </div>

            {showDd && dropdown.length > 0 && (
              <ul
                className="
              absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto z-[1000]
            "
                data-lenis-prevent
              >
                {dropdown.map((data, idx) => (
                  <li
                    key={idx}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 ${
                      idx === activeIdx ? "bg-gray-100" : null
                    }`}
                    onClick={() => handleSelectDd(data)}
                  >
                    {data}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="relative w-full lg:w-[450px] flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setShowSortDd((prev) => !prev);
                setShowFilterDd(false);
              }}
              className="gap-4 w-[50%] p-2 lg:p-3 border border-gray-200 rounded-md flex justify-between items-center shadow-lg bg-white hover:bg-gray-100 transition-all duration-300"
            >
              <FaSortAmountUpAlt />
              Sort
              <FaChevronDown
                className={`transition-all duration-300 ${showSortDd ? "rotate-180" : null}`}
              />
            </button>

            {showSortDd && (
              <ul
                className="
                  absolute top-full right-0 w-full
                  bg-white
                  border border-gray-200 rounded-md mt-1 shadow-lg z-[1000] p-4
                "
              >
                <h1 className="px-4 py-2 font-semibold">Urut berdasarkan:</h1>
                {sortOpts.map((sort) => (
                  <li
                    key={sort.value}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectSort(sort.value)}
                  >
                    {sort.label}
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={() => {
                setShowFilterDd((prev) => !prev);
                setShowSortDd(false);
              }}
              className="flex w-[50%] gap-4 p-2 lg:p-3 border border-gray-200 rounded-md justify-between items-center shadow-lg bg-white hover:bg-gray-100 transition-all duration-300"
            >
              <FaFilter />
              Filter
              <FaChevronDown
                className={`transition-all duration-300 ${showFilterDd ? "rotate-180" : null}`}
              />
            </button>

            {showFilterDd && (
              <div
                className={`
                  absolute top-full right-0 w-[100%] bg-white backdrop-blur-lg border border-gray-200 rounded-md mt-1 shadow-lg z-[1000] p-4
                `}
              >
                <h1 className="px-4 py-2 font-semibold">
                  Filter berdasarkan tag:
                </h1>
                <input
                  type="text"
                  placeholder="Cari tag..."
                  value={tagQuery}
                  onChange={(ev) => setTagQuery(ev.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primaryPink mb-2"
                />

                {/* Selected tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-green-100 text-primaryGreen px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            const newTags = selectedTags.filter(
                              (t) => t !== tag,
                            );
                            setSelectedTags(newTags);
                            setCurrentPage(1);
                            const tagsWithHash = newTags.map((t) =>
                              t.startsWith("#") ? t : `#${t}`,
                            );
                            updateUrl(query, sortBy, newTags);
                            fetchNews(query, sortBy, tagsWithHash.join(","));
                          }}
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <ul className="max-h-60 overflow-auto" data-lenis-prevent>
                  {filteredTags.map((tagObj) => (
                    <li
                      key={tagObj.id}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                        selectedTags.includes(tagObj.name)
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                      onClick={() => handleToggleTag(tagObj.name)}
                    >
                      {tagObj.name}
                      {selectedTags.includes(tagObj.name) && (
                        <FaCheck className="text-green-500 ml-2" />
                      )}
                    </li>
                  ))}

                  {hasMoreTags && (
                    <li className="p-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadMoreTags();
                        }}
                        disabled={loadingTags}
                        className="w-full text-center py-2 text-xs text-primaryPink hover:underline disabled:opacity-50"
                      >
                        {loadingTags ? "Loading..." : "Load More"}
                      </button>
                    </li>
                  )}

                  {!loadingTags && filteredTags.length === 0 && (
                    <li className="px-4 py-2 text-center text-xs text-gray-500 italic">
                      No tags found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <SkeletonGrid
            count={NEWS_PER_PAGE}
            withDesc
            className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10 lg:px-20"
          />
        ) : error || news.length === 0 ? (
          <div className="px-10 lg:px-20 py-12 text-center text-gray-500">
            <p className="text-lg font-semibold">Belum ada berita</p>
            <p className="text-sm">Silakan cek kembali nanti.</p>
          </div>
        ) : (
          <section className="px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n, idx) => (
              <CardNews key={n.id} {...n} idx={idx} />
            ))}
          </section>
        )}

        <div className="px-10 lg:px-20 flex items-center justify-between gap-6 py-10">
          <p className="font-libertine text-gray-500">
            Showing{" "}
            <span>{Math.min(totalData, currentPage * NEWS_PER_PAGE)}</span> news
            of <span>{totalData}</span> news
          </p>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {/* Pagination */}
            <RenderPagination
              currPage={currentPage}
              totPage={totalPage}
              onChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
      <BackToTop />
    </Layout>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold font-inter text-2xl text-gray-500 animate-pulse">
          Loading News...
        </div>
      }
    >
      <NewsPage />
    </Suspense>
  );
}
