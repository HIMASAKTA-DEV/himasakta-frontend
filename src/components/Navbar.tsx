"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Departemen", href: "/#departments" }, // Anchor link for now
  { name: "Berita", href: "/news" },
  { name: "Kabinet", href: "/#cabinet" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={twMerge(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              {/* Placeholder for Logo */}
              <span className="text-primary font-bold text-lg">H</span>
            </div>
            <div className="flex flex-col">
              <span
                className={clsx(
                  "font-bold text-lg leading-tight",
                  scrolled ? "text-slate-800" : "text-white",
                )}
              >
                HIMASAKTA
              </span>
              <span
                className={clsx(
                  "text-xs font-medium",
                  scrolled ? "text-slate-500" : "text-white/80",
                )}
              >
                ITS Surabaya
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={twMerge(
                  "text-sm font-medium transition-colors hover:text-accent",
                  scrolled ? "text-slate-600" : "text-white/90",
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="https://himasaktaits.carrd.co/"
              target="_blank"
              className={twMerge(
                "px-4 py-2 rounded-full text-sm font-semibold transition-all",
                scrolled
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-white text-primary hover:bg-white/90",
              )}
            >
              Info
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={twMerge(
              "md:hidden p-2 rounded-md",
              scrolled ? "text-slate-800" : "text-white",
            )}
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-slate-600 font-medium hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="https://himasaktaits.carrd.co/"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-primary text-white rounded-md text-center font-semibold hover:bg-primary/90"
            >
              Info / Linktree
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
