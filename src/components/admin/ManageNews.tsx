"use client";

import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";

import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { GetManageNews } from "@/services/admin/GetManageNews";
import { ManageNewsType } from "@/types/admin/ManageNewsType";
import Link from "next/link";
import { useEffect, useState } from "react";
import Typography from "../Typography";
import RenderPagination from "../_news/RenderPagination";
import HeaderSection from "../commons/HeaderSection";
import ImageFallback from "../commons/ImageFallback";
import MarkdownRenderer from "../commons/MarkdownRenderer";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

function ManageNews() {
  const [newsData, setNewsData] = useState<ManageNewsType[]>([]);
  const [currPg, setCurrPg] = useState(1);
  const [totPage, setTotPage] = useState(1);
  const [totData, setTotData] = useState(0);
  const [loadData, setLoadData] = useState(false);
  const [limNews, setLimNews] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Preview state
  const [previewData, setPreviewData] = useState<{
    title: string;
    content: string;
    thumbnail?: string;
    published_at: string;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    const fetchManageNews = async () => {
      setLoadData(true);
      try {
        const json = await GetManageNews(currPg, limNews);
        setNewsData(json.data);
        setTotData(json.meta.total_data ?? 1);
        setTotPage(json.meta.total_page ?? 1);
      } catch (err) {
        console.error(err);
        alert(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
      } finally {
        setLoadData(false);
      }
    };
    fetchManageNews();
  }, [currPg, limNews]);

  const handleDelete = async () => {
    if (!selectedNewsId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete(`/news/${selectedNewsId}`);
      setShowDeleteModal(false);
      setSelectedNewsId(null);
      const json = await GetManageNews(currPg, limNews);
      setNewsData(json.data);
      setTotData(json.meta.total_data ?? 1);
      setTotPage(json.meta.total_page ?? 1);
    } catch (err) {
      console.error(err);
      setDeleteError(`Gagal menghapus berita: ${getApiErrorMessage(err)}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePreview = async (newsId: string) => {
    setPreviewLoading(true);
    setPreviewData(null);
    try {
      const resp = await api.get(`/news/${newsId}`);
      const d = resp.data?.data ?? resp.data;
      setPreviewData({
        title: d.title ?? "",
        content: d.content ?? d.body ?? "",
        thumbnail: d.thumbnail?.image_url ?? "",
        published_at: d.published_at ?? "",
      });
    } catch (err) {
      console.error(err);
      alert("Gagal memuat preview berita");
      setPreviewLoading(false);
      return;
    }
    setPreviewLoading(false);
  };

  useEffect(() => {
    const isModalOpen = showDeleteModal || !!previewData || previewLoading;
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeleteModal, previewData, previewLoading]);

  if (loadData) {
    return (
      <div className="p-10 w-full min-h-screen flex items-center justify-center">
        <SkeletonPleaseWait />
      </div>
    );
  }

  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-10 max-w-7xl mx-auto">
        <div className="flex items-center lg:justify-between gap-4 max-lg:flex-col w-full">
          <div>
            <HeaderSection
              title="Manage Posts"
              titleStyle="font-averia text-black text-5xl max-lg:text-3xl"
              className="gap-0"
            />
            <Typography
              variant="p"
              className="text-gray-600 mt-2 font-averia italic"
            >
              Atur publikasi berita di website
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 font-libertine">
                Show
              </label>
              <select
                value={limNews}
                onChange={(e) => {
                  setLimNews(Number(e.target.value));
                  setCurrPg(1);
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all cursor-pointer"
              >
                {[5, 10, 15, 20].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <Link
              href="/admin/news/add"
              className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm"
            >
              + Add Post
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-7xl mx-auto">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="flex flex-col rounded-[24px] overflow-hidden shadow-sm transition-transform hover:scale-[1.02] duration-300 border border-gray-200"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "53/40" }}
            >
              <ImageFallback
                src={news.thumbnail?.image_url}
                alt={news.title}
                isFill
                imgStyle="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-1 bg-[#EBEFF4]">
              <Typography
                variant="h6"
                className="font-bold text-[18px] leading-snug font-libertine text-black mb-4"
              >
                {news.title}
              </Typography>
              <div className="flex justify-between items-center mt-auto">
                <Typography
                  variant="p"
                  className="text-gray-800 font-medium font-libertine text-[10px]"
                >
                  Published at:
                  <br />
                  {new Date(news.published_at).toLocaleString("id-ID")}
                </Typography>
                <div className="flex gap-[8px]">
                  <Link
                    href={`/admin/news/${news.id}/edit`}
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlinePencilAlt size={16} />
                  </Link>
                  <button
                    onClick={() => handlePreview(news.id as string)}
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlineEye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNewsId(news.id as string);
                      setShowDeleteModal(true);
                    }}
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row mt-8">
        <p className="font-libertine text-sm text-primaryPink">
          Showing {Math.min((currPg - 1) * limNews + 1, totData)} to{" "}
          {Math.min(currPg * limNews, totData)} of {totData} in current
          selection
        </p>
        <RenderPagination
          currPage={currPg}
          totPage={totPage}
          onChange={setCurrPg}
        />
      </div>

      {/* News preview modal */}
      {(previewData || previewLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setPreviewData(null);
            setPreviewLoading(false);
          }}
        >
          <div
            className="bg-white rounded-2xl w-[90%] max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {previewLoading ? (
              <div className="py-16 flex items-center justify-center">
                <SkeletonPleaseWait />
              </div>
            ) : (
              previewData && (
                <>
                  {previewData.thumbnail && (
                    <div className="relative w-full h-56 overflow-hidden rounded-t-2xl">
                      <img
                        src={previewData.thumbnail}
                        alt={previewData.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <h2 className="text-2xl font-bold font-averia mb-2">
                      {previewData.title}
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">
                      {new Date(previewData.published_at).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                    <div className="prose prose-sm max-w-none">
                      <MarkdownRenderer>{previewData.content}</MarkdownRenderer>
                    </div>
                  </div>
                </>
              )
            )}
            <div className="px-8 pb-6 flex justify-end">
              <button
                onClick={() => setPreviewData(null)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Hapus Berita</h2>
            <p className="text-sm text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus berita ini?{" "}
              <b>Tindakan ini tidak dapat dibatalkan.</b>
            </p>
            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedNewsId(null);
                  setDeleteError(null);
                }}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90 disabled:opacity-50"
              >
                {deleteLoading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageNews;
