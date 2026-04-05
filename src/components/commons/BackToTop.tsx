"use client";

import clsxm from "@/lib/clsxm";
import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 200); // muncul setelah scroll 200px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={show ? scrollToTop : () => null}
      className={clsxm(
        "fixed bottom-10 right-10 z-50 p-3 lg:p-4 rounded-full bg-primaryPink/60 backdrop-blur-2xl text-white shadow-lg hover:scale-110 transition-all duration-200 opacity-0",
        show ? "opacity-100 block" : "cursor-default",
      )}
    >
      <FaChevronUp />
    </button>
  );
}
