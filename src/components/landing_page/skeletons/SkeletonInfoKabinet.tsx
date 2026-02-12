import Skeleton from "@/components/Skeleton";
import SkeletonHeaderSection from "@/components/commons/skeletons/SkeletonHeaderSection";
import SkeletonList from "@/components/commons/skeletons/SkeletonList";
import SkeletonParagraph from "@/components/commons/skeletons/SkeletonParagraph";

export default function SkeletonInformasiKabinet() {
  return (
    <section className="w-full flex flex-col lg:flex-row gap-8 lg:gap-24">
      {/* Text skeleton */}
      <div className="order-2 lg:order-1 flex flex-col gap-4 w-full">
        <SkeletonHeaderSection />
        <SkeletonParagraph />
        <SkeletonList />
      </div>

      {/* gambar skeleton desktop */}
      <Skeleton className="order-1 lg:order-2 hidden lg:block w-[402px] h-[569px] rounded-3xl" />

      {/* gambar skeleton mobile */}
      <Skeleton className="lg:hidden w-full relative aspect-[16/12] rounded-3xl" />
    </section>
  );
}
