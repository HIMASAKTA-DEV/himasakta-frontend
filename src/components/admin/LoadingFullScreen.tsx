"use client";

import { useEffect } from "react";

function LoadingFullScreen({
  isSubmitting,
  label,
  styling = "bg-black/50 text-white",
  loaderStyle = "loader-full-scr",
}: {
  isSubmitting: boolean;
  label: string;
  styling?: string;
  loaderStyle?: string;
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
      className={`flex w-full min-h-screen items-center justify-center backdrop-blur-sm fixed inset-0 cursor-wait ${styling}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className={`${loaderStyle}`}></div>
        <p className="font-averia text-lg">{label}</p>
      </div>
    </div>
  );
}

export default LoadingFullScreen;
