"use client";

import SimpleImgViewer from "@/components/commons/_variantsInteractiveImgViewer/SimpleImgViewer";
import AdvancedImgViewer from "@/components/commons/_variantsInteractiveImgViewer/AdvancedImgViewer";

export type ViewerVariant = "simple" | "advanced";

export default function InteractiveImgViewer({
  src,
  alt,
  variant = "simple",
}: {
  src: string;
  alt?: string;
  variant?: ViewerVariant;
}) {
  switch (variant) {
    case "simple":
      return <SimpleImgViewer src={src} alt={alt} />;
    case "advanced":
    default:
      return <AdvancedImgViewer src={src} alt={alt} />;
  }
}
