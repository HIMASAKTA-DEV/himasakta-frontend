"use client";

import clsx from "clsx";
import type { IconType } from "react-icons";
import { FaRegBuilding, FaRegUser } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { IoImagesOutline } from "react-icons/io5";
import { LuClipboardList, LuScroll, LuUsers } from "react-icons/lu";
import { MdDashboard } from "react-icons/md";
import NextImage from "../NextImage";

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
    "
    >
      {/* Background blob */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-primaryPink/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primaryGreen/20 rounded-full blur-3xl animate-blob [animation-delay:4s]" />
      </div>

      {/* Title (desktop only) */}
      <div className="flex items-center w-full p-4 gap-2 my-2">
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
          )}
        >
          HIMASAKTA
        </h1>
      </div>

      <nav className="flex flex-col gap-2">
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
    </aside>
  );
}
