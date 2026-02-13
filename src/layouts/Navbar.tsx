"use client";

import { useEffect, useState } from "react";
import NextImage from "@/components/NextImage";
import Link from "next/link";
import DesktopNavbar from "./_navbar/DesktopNavbar";
import MobileNavbar from "./_navbar/MobileNavbar";
import clsx from "clsx";

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

  return (
    <nav
      className={clsx(
        "flex items-center justify-between h-[115px] px-12 sticky top-0 z-[500] transition-all duration-300",
        isTransparent
          ? "bg-transparent border-transparent shadow-none text-white"
          : "bg-white/80 backdrop-blur-md border-b border-neutral-300 shadow-md text-black",
      )}
    >
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
            "font-averia text-2xl lg:text-[32px] font-bold transition-colors duration-300",
            isTransparent ? "text-white" : "text-black",
          )}
        >
          HIMASAKTA
        </h1>
      </Link>

      {/* Navigasi */}
      <DesktopNavbar isTransparent={isTransparent} />
      <MobileNavbar />
    </nav>
  );
}
