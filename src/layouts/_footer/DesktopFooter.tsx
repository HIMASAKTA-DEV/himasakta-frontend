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

type ThisSocmed = {
  name: string;
  link: string;
};

export default function DesktopFooter() {
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
  return (
    <footer
      className="
        w-full h-[500px]
        px-[120px] py-[32px]
        bg-white text-black
        dark:bg-black dark:text-white
      "
    >
      {/* Atas */}
      <div className="flex justify-between items-start mb-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-8">
          <NextImage
            src="/HimasaktaMainWhite.png"
            width={96}
            height={96}
            alt="Himasakta"
          />
          <h1 className="font-averia text-[40px] font-bold">HIMASAKTA</h1>
        </Link>

        {/* Links */}
        <div className="font-libertine text-[24px] flex flex-col">
          <p className="mb-6">HIMASAKTA</p>
          {footerLink.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="
                mb-3
                transition-all
                hover:text-neutral-500
                dark:hover:text-neutral-300
                hover:translate-x-1
              "
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bawah */}
      <div className="flex justify-between items-center">
        <p className="font-libertine text-[24px] text-white">
          &copy; 2026 HIMASAKTA ITS | Flexoo Academny
        </p>

        <div className="flex gap-4">
          {links.map(({ name, link }) => {
            const Icon = icons[name.toLocaleLowerCase()] || FiLink;
            return (
              <Link
                key={name}
                href={link ?? "/"}
                target="_blank"
                className="
                p-3 rounded-2xl
                bg-neutral-100 text-black
                hover:bg-neutral-200
                transition
              "
              >
                <Icon className="text-xl" />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
