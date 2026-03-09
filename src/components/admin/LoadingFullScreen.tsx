"use client";

import { useEffect } from "react";

function LoadingFullScreen({
  isSubmitting,
  label,
  styling,
}: {
  isSubmitting: boolean;
  label: string;
  styling?: string | "bg-black/50 text-white";
}) {
  // prevent scrolling when modal opened
  useEffect(() => {
    const isModalOpen = isSubmitting;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSubmitting]);
  if (!isSubmitting) return;
  return (
    <div
      className={`flex w-full min-h-screen items-center justify-center backdrop-blur-sm fixed inset-0 cursor-not-allowed ${styling}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primaryPink border-t-transparent" />
        <p className="font-averia text-lg">{label}</p>
      </div>
    </div>
  );
}

export default LoadingFullScreen;
