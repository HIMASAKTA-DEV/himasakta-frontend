"use client";

import Image from "next/image";
import { ReactNode, useState } from "react";
import NoImage from "./NoImg";

export default function ImageFallback({
  src,
  alt = "No Image",
  isFill = false,
  imgStyle = "group-hover:scale-105",
  fallback, // New optional prop
}: {
  src?: string;
  alt?: string;
  isFill?: boolean;
  imgStyle?: string;
  fallback?: ReactNode;
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
      className={`object-cover transition-transform duration-300 ${imgStyle}`}
      onError={() => setError(true)}
    />
  );
}
