import type React from "react";
import { HiChevronDown } from "react-icons/hi";

export const AdminHeader: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
      <div className="flex-1"></div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-800">Admin</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Super Admin
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
            alt="Avatar"
          />
        </div>
        <HiChevronDown className="text-slate-400 cursor-pointer" />
      </div>
    </header>
  );
};
