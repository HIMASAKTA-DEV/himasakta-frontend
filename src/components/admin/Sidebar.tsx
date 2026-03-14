"use client";

import clsx from "clsx";
import type { IconType } from "react-icons";
import { FaChevronLeft, FaRegBuilding, FaRegUser } from "react-icons/fa";
import { FiCheckSquare, FiEdit3 } from "react-icons/fi";
import { IoIosSettings } from "react-icons/io";
import { IoImagesOutline } from "react-icons/io5";
import { LuClipboardList, LuScroll, LuUsers } from "react-icons/lu";
import { MdDashboard } from "react-icons/md";
import NextImage from "../NextImage";
import ButtonLink from "../links/ButtonLink";

type Menu = {
  label: string;
  hash: string;
  icon: IconType;
};

const menus: Menu[] = [
  { label: "Dashboard", hash: "dashboard", icon: MdDashboard },
  { label: "Manage Kabinet", hash: "manage-cabinet", icon: LuUsers },
  {
    label: "Manage Departemen",
    hash: "manage-department",
    icon: FaRegBuilding,
  },
  { label: "Manage Berita", hash: "manage-news", icon: FiEdit3 },
  { label: "Manage Galeri", hash: "manage-gallery", icon: IoImagesOutline },
  { label: "Manage Anggota", hash: "manage-anggota", icon: FaRegUser },
  { label: "Manage Kegiatan", hash: "manage-kegiatan", icon: LuScroll },
  { label: "Manage Progenda", hash: "manage-progenda", icon: LuClipboardList },
  {
    label: "Manage Nrp Whitelist",
    hash: "manage-nrp-whitelist",
    icon: FiCheckSquare,
  },
  { label: "Global Settings", hash: "global-settings", icon: IoIosSettings },
];

export default function Sidebar({ active }: { active: string }) {
  return (
    <aside
      className="
      relative
      w-20 lg:w-80
      min-h-screen
      bg-white/70
      backdrop-blur-xl
      border-r
      p-3 lg:p-4
      transition-all
      flex flex-col
      justify-between
      items-center
    "
    >
      <div>
        {/* Background blob */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-primaryPink/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primaryGreen/20 rounded-full blur-3xl animate-blob [animation-delay:4s]" />
        </div>

        {/* Title (desktop only) */}
        <div className="flex flex-col w-full items-center mb-4">
          <div className="flex items-center w-full p-2 gap-2 mt-2">
            <NextImage
              src={"/HimasaktaMain.png"}
              width={36}
              height={36}
              alt="Himasakta"
            />
            <h1
              className={clsx(
                "font-averia text-xl hidden lg:inline-block lg:text-[32px] font-bold transition-colors duration-300",
                "text-black",
                "shimmer animate-shimmer [animation-delay: 30s]",
              )}
            >
              HIMASAKTA
            </h1>
          </div>
          <h1 className="font-inter hidden lg:inline-block text-xl font-bold transition-colors duration-300 shimmer animate-shimmer [animation-delay: 30s]">
            Administrator
          </h1>
        </div>

        <nav className="flex flex-col gap-2 justify-between items-center">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = active === menu.hash;

            return (
              <a
                key={menu.hash}
                href={`#${menu.hash}`}
                title={menu.label}
                className={clsx(
                  "group transition-all rounded-xl",
                  // mobile
                  "flex items-center justify-center w-12 h-12 mx-auto",
                  // desktop
                  "lg:w-full lg:h-auto lg:justify-start lg:px-3 lg:py-4 lg:gap-3",
                  active === menu.hash
                    ? "bg-primaryPink text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-700",
                )}
              >
                <Icon
                  className={`text-xl shrink-0
                  ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 group-hover:text-black"
                  }`}
                />

                {/* Label only show on lg */}
                <span className="hidden lg:inline text-sm font-medium">
                  {menu.label}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
      {/* Back Home Button */}
      <div className="flex items-center flex-col justify-center">
        <ButtonLink
          href="/"
          variant="black"
          className="
          flex items-center justify-start gap-8
          lg:w-full py-3
          m-4
          "
        >
          <FaChevronLeft />
          <p className="text-sm hidden lg:inline-block">
            Back to Landing Page (Logout)
          </p>
        </ButtonLink>
        <small className="text-gray-400 font-medium mb-4 lg:inline-block hidden">
          &copy; HIMASAKTA 2026
        </small>
      </div>
    </aside>
  );
}
