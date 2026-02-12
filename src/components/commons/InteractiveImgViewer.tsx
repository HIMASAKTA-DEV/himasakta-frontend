"use client";

import AdvancedImgViewer from "@/components/commons/_variantsInteractiveImgViewer/AdvancedImgViewer";
import SimpleImgViewer from "@/components/commons/_variantsInteractiveImgViewer/SimpleImgViewer";

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
