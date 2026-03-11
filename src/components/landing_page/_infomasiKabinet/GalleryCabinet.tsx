import RenderPagination from "@/components/_news/RenderPagination";
import HeaderSection from "@/components/commons/HeaderSection";
import ImageFallback from "@/components/commons/ImageFallback";
import EventSkeleton from "@/components/commons/skeletons/SkeletonGrid";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import { GetGalleryByCabinetId } from "@/services/landing_page/GeGalleryByCabinetId";
import { ApiMeta } from "@/types/commons/apiMeta";
import { GalleryType } from "@/types/data/GalleryType";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const LimitGallery = 3;

function GalleryCabinet({ ...cabinet }: CabinetInfo) {
  const [loading, setLoading] = useState(false);
  const [galleries, setGalleries] = useState<GalleryType[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [currPg, setCurrPg] = useState(1);
  const [error, setError] = useState(false);
  const [metaData, setMetaData] = useState<ApiMeta | null>(null);

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
  }, [currPg]);

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
    <div className="flex flex-col gap-8 px-4 w-full">
      <h1 className="text-lg font-libertine font-semibold">Galeri Kabinet</h1>
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
              >
                <ImageFallback
                  isFill
                  src={g.image_url}
                  imgStyle="rounded-lg object-cover group-hover:scale-105 group-hover:cursor-pointer"
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
          {/* Prev page */}
          <button
            disabled={currPg === 1 || loading}
            onClick={() => setCurrPg((p) => p - 1)}
            className={`p-2 rounded-md border disabled:opacity-40 hover:bg-gray-100 transition flex items-center gap-4 ${currPg === 1 || loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <FaChevronLeft />
          </button>

          {/* Pagination */}
          <RenderPagination
            currPage={currPg}
            onChange={setCurrPg}
            totPage={metaData?.total_page || 1}
          />

          {/* Next page */}
          <button
            disabled={!hasNext || loading}
            onClick={() => setCurrPg((p) => p + 1)}
            className={`p-2 rounded-md border disabled:opacity-40 hover:bg-gray-100 transition flex items-center gap-4 ${!hasNext || loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GalleryCabinet;
