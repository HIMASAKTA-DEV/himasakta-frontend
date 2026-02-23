"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard() {
  const pathname = usePathname();

  useEffect(() => {
    // kalau keluar dari /admin → logout
    if (!pathname.startsWith("/admin")) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("admin_username");
    }
  }, [pathname]);

  return null;
}
