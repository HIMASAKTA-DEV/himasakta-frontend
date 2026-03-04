import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";

import NextImage from "../NextImage";
import Typography from "../Typography";
import HeaderSection from "../commons/HeaderSection";
import ButtonLink from "../links/ButtonLink";
import { useEffect, useState } from "react";
import { ManageGalleryType } from "@/types/admin/ManageGallery";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/commons/apiResponse";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import ImageFallback from "../commons/ImageFallback";
import RenderPagination from "../_news/RenderPagination";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

// const galleryData = Array.from({ length: 6 }).map((_, i) => ({
//   id: i + 1,
//   title: "Lorem ipsum dolor sit amet.",
//   date: "09 Februari 2026",
//   image: "/_dummy_images/no1.jpg",
// }));

function ManageGallery() {
  const [galleryData, setGalleryData] = useState<ManageGalleryType[]>([]);
  const [loadData, setLoadData] = useState(false);
  const [totData, setTotData] = useState(1);
  const [totPg, setTotPg] = useState(1);
  const [currPg, setCurrPg] = useState(1);
  const LIM_GALLERY = 6;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchGalleryData = async () => {
    setLoadData(true);
    try {
      const json = await api.get<ApiResponse<ManageGalleryType[]>>(
        `/gallery?page=${currPg}&limit=${LIM_GALLERY}`,
      );
      const data = json.data;

      const sortedData = [...data.data].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );

      setGalleryData(sortedData);
      setTotData(data.meta.total_data ?? 1);
      setTotPg(data.meta.total_page ?? 1);
    } catch (err) {
      console.error(err);
      alert(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
    } finally {
      setLoadData(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, [currPg]);

  // handle delete image
  const handleDeleteGallery = async () => {
    if (!selectedGalleryId) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await api.delete(`/gallery/${selectedGalleryId}`);
      setShowDeleteModal(false);
      setSelectedGalleryId(null);

      // Refetch gallery
      fetchGalleryData();
    } catch (err) {
      console.error(err);
      setDeleteError("Gagal menghapus gambar");
    } finally {
      setDeleteLoading(false);
    }
  };

  // prevent scrolling when modal opened
  useEffect(() => {
    const isModalOpen = showDeleteModal;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeleteModal]);

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
        <div>
          <HeaderSection
            title="Manage Gallery"
            titleStyle="font-averia text-black text-5xl"
            className="gap-0"
          />
          <Typography
            variant="p"
            className="text-gray-600 mt-2 font-averia italic"
          >
            Atur semua informasi media gambar dalam website
          </Typography>
        </div>
        <ButtonLink
          href="/admin/gallery/add"
          className="bg-primaryPink hover:bg-[#C27A84] active:bg-[#C27A84] border-none rounded-xl py-3 px-8 h-fit text-white font-averia text-lg shadow-md transition-all active:scale-95 focus:outline-none"
          leftIcon={FaPlus}
        >
          Add Photo
        </ButtonLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-7xl mx-auto">
        {galleryData.map((gallery) => (
          <div
            key={gallery.id}
            className="flex flex-col rounded-[24px] overflow-hidden shadow-sm transition-transform hover:scale-[1.02] duration-300 border border-gray-200"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "53/40" }}
            >
              <ImageFallback
                src={gallery.image_url}
                alt={gallery.caption}
                isFill
                imgStyle="w-full h-full object-cover rounded-t-[24px]"
              />
            </div>
            <div className="p-6 flex flex-col flex-1 bg-[#EBEFF4]">
              <Typography
                variant="h6"
                className="font-bold text-[18px] leading-snug font-libertine text-black mb-4"
              >
                {gallery.caption}
              </Typography>
              <div className="flex justify-between items-center mt-auto">
                <Typography
                  variant="p"
                  className="text-gray-800 text-[13px] font-medium font-libertine"
                >
                  Updated at:
                  <br />
                  {new Date(gallery.updated_at).toLocaleString("id-ID")}
                </Typography>
                <div className="flex gap-[8px]">
                  <Link
                    href={`/admin/gallery/${gallery.id}/edit`}
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlinePencilAlt size={16} />
                  </Link>
                  {/* Not available */}
                  {/* <button className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all">
                    <HiOutlineEye size={16} />
                  </button> */}
                  <button
                    onClick={() => {
                      setSelectedGalleryId(gallery.id);
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
          Showing {Math.min(currPg * LIM_GALLERY, totData)} of {totData} in
          current selection
        </p>

        {/* Pagination controls */}
        <div className="flex items-center gap-3">
          {/* Prev page */}
          <button
            disabled={currPg === 1 || loadData}
            onClick={() => setCurrPg((p) => p - 1)}
            className={`p-2 rounded-md border disabled:opacity-40 
                                hover:bg-gray-100 transition flex items-center gap-4
                                ${currPg === 1 || loadData ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {/* icon kiri */}
            &lt;
          </button>

          {/* Page numbers */}
          <RenderPagination
            currPage={currPg}
            totPage={totPg}
            onChange={setCurrPg}
          />

          {/* Next page */}
          <button
            disabled={currPg === totPg || loadData}
            onClick={() => setCurrPg((p) => p + 1)}
            className={`p-2 rounded-md border disabled:opacity-40 
                                hover:bg-gray-100 transition flex items-center gap-4
                                ${currPg === totPg || loadData ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {/* icon kanan */}
            &gt;
          </button>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Hapus Gambar</h2>
            <p className="text-sm text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus gambar ini?{" "}
              <b>Tindakan ini tidak dapat dibatalkan.</b>
            </p>

            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedGalleryId(null);
                }}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteGallery}
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

export default ManageGallery;
