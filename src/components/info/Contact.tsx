"use client";

import api from "@/lib/axios";
import { SettingsWebType } from "@/types/SettingsWebType";
import { ApiResponse } from "@/types/commons/apiResponse";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { FiLink, FiLinkedin, FiYoutube } from "react-icons/fi";
import HeaderSection from "../commons/HeaderSection";

type ThisSocmedLinkArr = {
  name: string;
  link: string;
};

function Contact() {
  const [links, setLinks] = useState<ThisSocmedLinkArr[]>([]);

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
    <section className="flex flex-col gap-4" id="contact">
      <HeaderSection
        title="Contact Us"
        titleStyle="text-primaryPink font-averia"
      />
      <p className="text-lg">
        If you have any questions or need further discussion, please feel free
        to contact us.
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
                bg-black text-white
                hover:bg-neutral-800
                transition
              "
            >
              <Icon className="text-xl" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Contact;
