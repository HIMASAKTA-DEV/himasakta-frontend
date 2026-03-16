import RenderPagination from "@/components/_news/RenderPagination";
import HeaderSection from "@/components/commons/HeaderSection";
import ImageFallback from "@/components/commons/ImageFallback";
import EventSkeleton from "@/components/commons/skeletons/SkeletonGrid";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import SkeletonSection from "@/components/commons/skeletons/SkeletonSection";
import { GetGalleryByCabinetId } from "@/services/landing_page/GeGalleryByCabinetId";
import { ApiMeta } from "@/types/commons/apiMeta";
import { GalleryType } from "@/types/data/GalleryType";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import { useEffect, useState } from "react";

function GalleryCabinet({ ...cabinet }: CabinetInfo) {
  const [loading, setLoading] = useState(false);
  const [galleries, setGalleries] = useState<GalleryType[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [currPg, setCurrPg] = useState(1);
  const [error, setError] = useState(false);
  const [metaData, setMetaData] = useState<ApiMeta | null>(null);
  const [LimitGallery, setLimitGallery] = useState(3);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    caption?: string;
  } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setLimitGallery(3);
      } else if (window.innerWidth > 768) {
        setLimitGallery(2);
      } else {
        setLimitGallery(1);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchGalleryByCabinet = async (cabinetId: string) => {
      setLoading(true);
      setError(false);
      try {
        const json = await GetGalleryByCabinetId(
          cabinetId,
          currPg,
          LimitGallery,
        );
        setGalleries(json.data);
        setMetaData(json.meta);
        setHasNext(json.data.length === LimitGallery);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!cabinet.id) return;
    fetchGalleryByCabinet(cabinet.id);
  }, [currPg, LimitGallery, cabinet.id]);

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
          <SkeletonSection />
        </div>
        <SkeletonPleaseWait />
      </div>
    );
  }

  if (error) return <p>&#9940; Gagal memuat data :&#40;</p>;

  return (
    <div className="flex flex-col gap-8 px-4 w-full">
      <div>
        <h1 className="text-2xl font-libertine font-semibold">
          Galeri Kabinet
        </h1>
      </div>
      {galleries.length <= 0 ? (
        <div className="w-full flex items-center">
          <p>Departemen tidak memiliki progenda</p>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:w-[70vw] w-full">
            {galleries.map((g, idx) => (
              <div
                className="group relative aspect-square overflow-hidden bg-gray-100 w-full lg:h-[400px] rounded-lg"
                key={idx}
                onClick={() =>
                  setPreviewImage({
                    url: g.image_url,
                    caption: g.caption || g.id,
                  })
                }
              >
                <ImageFallback
                  isFill
                  src={g.image_url}
                  imgStyle="rounded-lg object-cover group-hover:scale-110 duration-500 group-hover:cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* PAGINATION */}
      <div className="flex items-center justify-between gap-6 py-10 max-lg:flex-col">
        <p className="font-libertine text-gray-500 max-lg:order-2">
          Showing{" "}
          <span>
            {Math.min(metaData?.total_data ?? 1, currPg * LimitGallery)}
          </span>{" "}
          images of <span>{metaData?.total_data}</span> images
        </p>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {/* Pagination */}
          <RenderPagination
            currPage={currPg}
            onChange={setCurrPg}
            totPage={metaData?.total_page || 1}
          />
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

export default GalleryCabinet;
