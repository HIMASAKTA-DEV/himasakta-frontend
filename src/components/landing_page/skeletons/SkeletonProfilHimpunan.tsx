import Skeleton from "@/components/Skeleton";
import HeaderSectionSkeleton from "@/components/commons/skeletons/SkeletonHeaderSection";
import ParagraphSkeleton from "@/components/commons/skeletons/SkeletonParagraph";
import clsx from "clsx";

export default function SkeletonProfilHimpunan({
  className,
}: {
  className?: string;
}) {
  return (
    <section className={clsx("flex flex-col items-center gap-4", className)}>
      {/* Image placeholder */}
      <div className="w-[75vw] aspect-[16/5]">
        <Skeleton className="w-full h-full rounded-3xl" />
      </div>

      {/* HeaderSection placeholder */}
      <HeaderSectionSkeleton className="w-[75vw] items-start" />

      {/* Paragraph placeholder */}
      <ParagraphSkeleton className="w-[75vw]" />
    </section>
  );
}
