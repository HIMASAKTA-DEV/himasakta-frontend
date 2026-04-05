"use client";

import NextImage from "@/components/NextImage";
import api from "@/lib/axios";
import { SettingsWebType } from "@/types/SettingsWebType";
import { ApiResponse } from "@/types/commons/apiResponse";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { FiLink, FiLinkedin, FiYoutube } from "react-icons/fi";
import { footerLink } from "./footerLinks";
import Lenis from "@studio-freight/lenis/types";

type ThisSocmed = {
  name: string;
  link: string;
};

type LenisWindow = typeof globalThis & {
  lenis?: Lenis;
};

export default function MobileFooter() {
  const [links, setLinks] = useState<ThisSocmed[]>([]);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const json =
          await api.get<ApiResponse<SettingsWebType>>("/settings/web");
        const dt = json.data.data;
        setLinks(dt.SocialMedia);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSocialMedia();
  }, []);

  const icons: Record<string, IconType> = {
    instagram: FaInstagram,
    linkedin: FiLinkedin,
    youtube: FiYoutube,
    tiktok: FaTiktok,
    linktree: FiLink,
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const lenis = (globalThis as LenisWindow).lenis;
    if (!lenis) return;

    const target = e.currentTarget.getAttribute("href");
    if (!target || !target.startsWith("#")) return;

    e.preventDefault();

    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;

    lenis.scrollTo(el, {
      offset: -140, // adjust kalau ada navbar fixed
      duration: 0.5,
    });
  };

  return (
    <footer className="py-8 px-4 bg-black text-white flex flex-col items-center justify-center">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-4 mb-6 w-full">
        <NextImage
          src="/HimasaktaMainWhite.png"
          width={70}
          height={70}
          alt="Himasakta"
        />
        <h1 className="font-averia text-3xl font-bold">HIMASAKTA</h1>
      </Link>

      {/* Links */}
      <div className="font-libertine text-lg flex flex-col mb-6 w-full">
        {footerLink.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="mb-3 hover:text-neutral-50"
            onClick={handleScroll}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Social */}
      <div className="flex gap-4 mb-6 w-full">
        {links.map(({ name, link }) => {
          const Icon = icons[name.toLocaleLowerCase()] || FiLink;
          return (
            <Link
              key={name}
              href={link ?? "/"}
              target="_blank"
              className="
              p-3 rounded-xl
              bg-neutral-100 text-black
            "
            >
              <Icon className="text-md" />
            </Link>
          );
        })}
      </div>

      <p className="font-libertine text-sm lg:text-md text-white w-full">
        &copy; 2026 HIMASAKTA ITS | Flexoo Academy
      </p>
    </footer>
  );
}
