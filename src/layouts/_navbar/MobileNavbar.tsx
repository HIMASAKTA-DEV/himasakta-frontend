// ketika ukuran lebar layar < 1024px
"use client";

import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import ButtonLink from "@/components/links/ButtonLink";
import { navigationBtn } from "./navigationBtn";
import Link from "next/link";
import NextImage from "@/components/NextImage";

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);

  const navBtnStyle =
    "rounded-full p-2 transition-all duration-200 " +
    "hover:bg-neutral-100 hover:scale-100 " +
    "active:bg-neutral-200 active:scale-95 " +
    "focus-visible:outline-none focus-visible:ring focus-visible:ring-neutral-400";

  return (
    <>
      {/* Hamburger */}
      <button
        className={`lg:hidden text-3xl ${navBtnStyle}`}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <HiMenu />
      </button>

      {/* Overlay */}
      <div
        className={`
          fixed inset-0 z-[500] lg:hidden
          bg-white transition-opacity duration-300 ease-in-out
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-[115px] px-12 border-b">
          <Link href="/" className="flex items-center gap-[24px]">
            <NextImage
              src="/HimasaktaMain.png"
              width={46}
              height={46}
              alt="Himasakta"
            />
            <h1 className="font-averia text-[32px] font-bold">HIMASAKTA</h1>
          </Link>

          {/* Close button */}
          <button
            className={`text-3xl ${navBtnStyle}`}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <HiX />
          </button>
        </div>

        {/* Menu */}
        <div
          className={`
            flex flex-col items-center justify-center gap-6
            h-[calc(100vh-115px)]
            transition-opacity duration-300 delay-100
            ${open ? "opacity-100" : "opacity-0"}
          `}
        >
          {navigationBtn.map((item) => (
            <ButtonLink
              key={item.label}
              href={item.href}
              variant="ghost"
              size="lg"
              className="
                font-libertine text-2xl text-black
                transition-all duration-200
                hover:bg-neutral-100 hover:scale-105
                active:bg-neutral-200 active:scale-95
                rounded-lg px-6 py-3
              "
              onClick={() => setOpen(false)}
            >
              {item.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </>
  );
}
