"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";

type Props = {
  usr: string;
  onLogout: () => void;
};

function AccDropDown({ usr, onLogout }: Props) {
  const [openDd, setOpenDd] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenDd(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative lg:w-[15vw]" ref={ref}>
      <button
        onClick={() => setOpenDd((p) => !p)}
        className={`w-6 h-6 lg:w-full lg:h-10 rounded-full lg:rounded-md text-white flex gap-2 items-center justify-start lg:text-black transition-all duration-300 ${openDd ? "hover:bg-slate-500 lg:hover:bg-slate-300 bg-slate-600 lg:bg-slate-200" : "bg-slate-700 lg:bg-white/50 hover:bg-slate-600 lg:hover:bg-slate-200"}`}
      >
        <FaUserCircle className="w-10 h-6" />
        <span className="hidden lg:flex text-sm font-bold">{usr}</span>
        <FaChevronDown
          className={`hidden lg:block ml-auto transition-transform duration-200 mr-2 ${
            openDd ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {openDd && (
        <div className="absolute right-0 mt-2 w-36 lg:w-full bg-slate-200 rounded-lg shadow-lg border z-50 p-4">
          <div className="px-4 py-3">
            <p className="text-sm font-medium">{usr}</p>
            <p className="text-xs text-gray-700">Administrator</p>
          </div>
          <br />
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 bg-slate-100 border hover:bg-red-600 hover:text-white rounded-lg transition-all duration-300 font-semibold"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default AccDropDown;
