"use client";

import NextImage from "@/components/NextImage";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import DesktopNavbar from "./_navbar/DesktopNavbar";
import MobileNavbar from "./_navbar/MobileNavbar";

type NavbarProps = {
  transparentOnTop?: boolean;
};

export default function Navbar({ transparentOnTop = false }: NavbarProps) {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    if (!transparentOnTop) return;

    const onScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  const isTransparent = transparentOnTop && isTop;

  const [open, setOpen] = useState(false);

  return (
    <nav
      className={clsx(
        "flex items-center justify-between py-8 px-6 lg:px-12 sticky top-0 z-[9999] transition-all duration-500",
        isTransparent
          ? "text-white"
          : "text-black xl:mx-12 xl:top-8 xl:shadow-[0_0_20px_rgba(0,0,0,0.25)] xl:rounded-2xl xl:py-6",
      )}
    >
      <div
        className={clsx(
          "absolute inset-0 -z-10 transition-all duration-300 transform-gpu shadow-md lg:ring-2 lg:ring-primaryPinkLight",
          isTransparent
            ? "bg-transparent opacity-0"
            : open
              ? "bg-white opacity-100"
              : "bg-white/75 backdrop-blur-lg opacity-100 xl:rounded-2xl",
        )}
      />
      {/* Logo */}
      <Link href="/" className="flex items-center gap-[24px]">
        <NextImage
          src={isTransparent ? "/HimasaktaMainWhite.png" : "/HimasaktaMain.png"}
          width={46}
          height={46}
          alt="Himasakta"
        />
        <h1
          className={clsx(
            "font-averia text-2xl xl:text-[32px] font-bold transition-colors duration-300",
            isTransparent ? "text-white" : "text-black",
          )}
        >
          HIMASAKTA ITS
        </h1>
      </Link>
      {/* Navigasi */}
      <DesktopNavbar isTransparent={isTransparent} />
      <MobileNavbar
        isTransparent={isTransparent}
        open={open}
        setOpen={setOpen}
      />
    </nav>
  );
}
