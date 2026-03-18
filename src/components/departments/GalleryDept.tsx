"use client";

import { GetGalleryByDeptId } from "@/services/departments/GetGalleryByDept";
import { ApiMeta } from "@/types/commons/apiMeta";
import { DepartmentType } from "@/types/data/DepartmentType";
import { GalleryType } from "@/types/data/GalleryType";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import RenderPagination from "../_news/RenderPagination";
import HeaderSection from "../commons/HeaderSection";
import ImageFallback from "../commons/ImageFallback";
import EventSkeleton from "../commons/skeletons/SkeletonGrid";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

type GalleryCard = {
  imageUrl: string;
};

const LimitGallery = 9;

function GalleryDept({ ...dept }: DepartmentType) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [galleries, setGalleries] = useState<GalleryCard[]>([]);
  const [metaData, setMetaData] = useState<ApiMeta | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [_cntItems, setCntItems] = useState(3);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    caption?: string;
  } | null>(null);
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setCntItems(2); // mobile & tablet
    } else {
      setCntItems(3); // desktop
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchGallery = async (deptId: string) => {
    try {
      const json = await GetGalleryByDeptId(deptId, currentPage, LimitGallery);
      const cards: GalleryCard[] = json.data.map((g: GalleryType) => ({
        imageUrl: g.image_url,
      }));
      setMetaData(json.meta);
      setGalleries(cards);
      setHasNext(json.data.length === LimitGallery);
    } catch (err) {
      console.error(err);
      setError(true);
      setGalleries([]);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dept?.id) return;
    fetchGallery(dept.id);
  }, [dept?.id]);

  useEffect(() => {
    const isModalOpen = !!previewImage;
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [previewImage]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 items-center">
        <HeaderSection title={"Galeri Departemen"} />
        <div className="w-full">
          <EventSkeleton
            className="grid grid-cols-3 grid-rows-3"
            count={LimitGallery}
          />
        </div>
        <SkeletonPleaseWait />
      </div>
    );
  }

  if (error) return <p>&#9940; Gagal memuat data :&#40;</p>;

  return (
    <div className="flex flex-col gap-8">
      <HeaderSection title={"Galeri Departemen"} />
      {galleries.length <= 0 ? (
        <div className="w-full flex items-center">
          <p>Departemen tidak memiliki progenda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {galleries.map((g, idx) => (
            <div
              className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg cursor-pointer group/item"
              key={idx}
              onClick={() =>
                setPreviewImage({
                  url: g.imageUrl,
                })
              }
            >
              <ImageFallback
                isFill
                src={g.imageUrl}
                imgStyle="rounded-lg object-cover group-hover/item:scale-110 duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/item:opacity-100 flex items-center justify-center text-white font-medium transition-all duration-500">
                Lihat Foto
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination & navigation */}
      <div className="flex max-lg:flex-col-reverse items-center justify-between gap-6 py-10">
        <p className="font-libertine text-gray-500">
          Showing{" "}
          <span>
            {Math.min(metaData?.total_data ?? 1, currentPage * LimitGallery)}
          </span>{" "}
          images of <span>{metaData?.total_data}</span> images
        </p>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {/* Prev page */}
          <button
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`p-2 rounded-md border disabled:opacity-40 hover:bg-gray-100 transition flex items-center gap-4 ${currentPage === 1 || loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <FaChevronLeft />
          </button>

          {/* Pagination */}
          <RenderPagination
            currPage={currentPage}
            totPage={metaData?.total_page || 1}
            onChange={setCurrentPage}
          />

          {/* Next page */}
          <button
            disabled={!hasNext || loading}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`p-2 rounded-md border disabled:opacity-40 hover:bg-gray-100 transition flex items-center gap-4 ${!hasNext || loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      {/* Image preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative lg:max-w-[50vw] lg:max-h-[70vh] max-h-[80vh] max-w-[80vw] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.url}
              alt={previewImage.caption}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white text-center text-sm font-medium bg-black/40 px-4 py-2 rounded-lg">
              {previewImage.caption}
            </p>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all text-gray-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryDept;
