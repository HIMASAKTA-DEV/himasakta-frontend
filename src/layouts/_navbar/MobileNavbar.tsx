"use client";

import NextImage from "@/components/NextImage";
import ButtonLink from "@/components/links/ButtonLink";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { navigationBtn } from "./navigationBtn";

export default function MobileNavbar({
  isTransparent,
  open,
  setOpen,
}: {
  isTransparent: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic Icon Styling
  const iconBtnStyle = clsx(
    "rounded-full p-2 transition-all duration-300",
    open ? "text-black" : isTransparent ? "text-white" : "text-black",
    "hover:bg-neutral-200/50 active:scale-95 focus:outline-none",
  );

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={clsx(
          "fixed top-8 right-12 z-[1000] lg:hidden text-3xl",
          iconBtnStyle,
        )}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <HiX /> : <HiMenu />}
      </button>

      <div
        className={clsx(
          "fixed inset-0 z-[999] lg:hidden transition-all duration-500 ease-in-out",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="fixed inset-0 bg-white/80 backdrop-blur-xl" />

        <div className="inset-0 fixed z-10 flex flex-col h-full">
          <div className="flex items-center px-12 h-[115px] border-b border-neutral-100">
            <Link
              href="/"
              className="flex items-center gap-4"
              onClick={() => setOpen(false)}
            >
              <NextImage
                src="/HimasaktaMain.png"
                width={46}
                height={46}
                alt="Himasakta"
              />
              <h1 className="font-averia text-black text-2xl font-bold">
                HIMASAKTA
              </h1>
            </Link>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-8">
            {navigationBtn.map((item, index) => (
              <div
                key={item.label}
                className={clsx(
                  "transition-all duration-500 delay-100",
                  open
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0",
                )}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <ButtonLink
                  href={item.href}
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="font-libertine text-3xl text-black hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </ButtonLink>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

{
  /**
  <nav class="flex items-center justify-between h-[115px] px-12 sticky top-0 z-[499] transition-all duration-300 bg-transparent border-transparent shadow-none text-white"> */
}
{
  /**
  <nav class="flex items-center justify-between h-[115px] px-12 sticky top-0 z-[499] transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-neutral-300 shadow-md text-black"> */
}
