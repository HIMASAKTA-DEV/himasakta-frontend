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
        "flex items-center justify-between h-[115px] px-6 lg:px-12 sticky top-0 z-[9999] transition-all duration-500",
        isTransparent ? "text-white" : "text-black lg:mx-12 lg:top-8",
      )}
    >
      <div
        className={clsx(
          "absolute inset-0 -z-10 transition-all duration-300 transform-gpu shadow-md lg:ring-2 lg:ring-primaryPinkLight",
          isTransparent
            ? "bg-transparent opacity-0"
            : open
              ? "bg-white opacity-100"
              : "bg-white/80 backdrop-blur-md opacity-100 lg:rounded-2xl",
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
            "font-averia text-xl lg:text-[32px] font-bold transition-colors duration-300",
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
