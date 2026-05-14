"use client";

import Image from "next/image";
import { ReactNode, useState } from "react";
import NoImage from "./NoImg";

export default function ImageFallback({
  src,
  alt = "No Image",
  isFill = false,
  imgStyle = "group-hover:scale-110",
  fallback, // New optional prop
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: {
  src?: string;
  alt?: string;
  isFill?: boolean;
  imgStyle?: string;
  fallback?: ReactNode;
  sizes?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    // Kalo ada fallback return fallback
    return fallback ? (
      <>{fallback}</>
    ) : (
      <NoImage className="w-full h-full" text="No Image" />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={isFill}
      sizes={isFill ? sizes : undefined}
      className={`object-cover transition-transform duration-500 ${imgStyle}`}
      onError={() => setError(true)}
    />
  );
}
