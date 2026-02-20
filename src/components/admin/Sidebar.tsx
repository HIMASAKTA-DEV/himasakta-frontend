"use client";

import clsx from "clsx";

const menus = [
  { label: "Dashboard", hash: "dashboard" },
  { label: "Manage Cabinet", hash: "manage-cabinet" },
  { label: "Manage Department", hash: "manage-department" },
  { label: "Manage Berita", hash: "manage-news" },
  { label: "Manage Galeri", hash: "manage-gallery" },
  { label: "Manage Anggota", hash: "manage-anggota" },
  { label: "Manage Progenda", hash: "manage-progenda" },
];

export default function Sidebar({ active }: { active: string }) {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="font-bold text-lg mb-6">Admin Panel</h2>

      <nav className="flex flex-col gap-2">
        {menus.map((menu) => (
          <a
            key={menu.hash}
            href={`#${menu.hash}`}
            className={clsx(
              "px-4 py-2 rounded transition",
              active === menu.hash
                ? "bg-primaryPink text-white"
                : "hover:bg-gray-100",
            )}
          >
            {menu.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
