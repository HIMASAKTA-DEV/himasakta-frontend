"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Departemen", href: "/#departments" },
  { name: "Berita", href: "/news" },
  { name: "Kabinet", href: "/#cabinet" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 5) {
      router.push("/admin");
      setClickCount(0);
    }

    // Reset count after 2 seconds of inactivity
    setTimeout(() => setClickCount(0), 2000);
  };

  return (
    <nav
      className={twMerge(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20 py-3"
          : "bg-transparent py-6",
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-8">
          {/* Logo with 5-click easter egg */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 shrink-0 group/logo"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner group-active/logo:scale-95 transition-transform">
              <span className="text-primary font-bold text-lg">H</span>
            </div>
            <div className="flex flex-col">
              <span
                className={clsx(
                  "font-extrabold text-lg leading-tight tracking-tight",
                  scrolled ? "text-slate-800" : "text-white",
                )}
              >
                HIMASAKTA
              </span>
              <span
                className={clsx(
                  "text-[10px] font-bold uppercase tracking-wider",
                  scrolled ? "text-slate-400" : "text-white/60",
                )}
              >
                ITS Surabaya
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6 mr-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={twMerge(
                    "text-sm font-semibold transition-all hover:text-primary relative group",
                    scrolled ? "text-slate-600" : "text-white/90",
                  )}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>
            <Link
              href="/info"
              className={twMerge(
                "px-6 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-md active:scale-95",
                scrolled
                  ? "bg-primary text-white hover:bg-primary/90 hover:shadow-primary/20"
                  : "bg-white text-primary hover:bg-white/90 hover:shadow-white/20",
              )}
            >
              Informasi
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={twMerge(
              "md:hidden p-2 rounded-xl transition-colors",
              scrolled
                ? "text-slate-800 hover:bg-slate-100"
                : "text-white hover:bg-white/10",
            )}
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-2xl p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-slate-600 font-bold text-lg hover:text-primary transition-colors flex items-center justify-between group"
                >
                  {link.name}
                  <span className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-primary transition-colors" />
                </Link>
              ))}
            </div>
            <Link
              href="/info"
              onClick={() => setIsOpen(false)}
              className="px-4 py-4 bg-primary text-white rounded-2xl text-center font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              Informasi
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
