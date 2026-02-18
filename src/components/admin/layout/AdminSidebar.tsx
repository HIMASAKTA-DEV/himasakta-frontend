import Link from "next/link";
import type React from "react";
import { IconType } from "react-icons";
import { FaSignOutAlt } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface AdminSidebarProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  handleLogout: () => void;
  sidebarLinks: { name: string; icon: IconType; id: string }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  handleTabChange,
  handleLogout,
  sidebarLinks,
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col z-20">
      <div className="p-8 border-b border-slate-50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-95">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-extrabold text-slate-800 tracking-tight text-lg">
            HIMASAKTA
          </span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-8">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">
          Main Menu
        </div>
        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleTabChange(link.id)}
              className={twMerge(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all relative group",
                activeTab === link.id
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
              )}
            >
              <link.icon
                size={20}
                className={
                  activeTab === link.id
                    ? "text-primary"
                    : "text-slate-400 group-hover:text-slate-600 transition-colors"
                }
              />
              {link.name}
              {activeTab === link.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full -ml-0.75" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
        >
          <FaSignOutAlt size={18} />
          Keluar Dashboard
        </button>
      </div>
    </aside>
  );
};
