"use client";

import api from "@/lib/axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // validation only for /cp routes
    if (pathname.startsWith("/cp")) {
      const token = localStorage.getItem("jwt_token");

      if (!token) {
        // if accessing subpages without token, redirect to main /cp (login)
        if (pathname !== "/cp") {
          router.push("/cp");
        }
        return;
      }

      // background validation
      api.post("/auth/validate", {}).catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("jwt_token");
          localStorage.removeItem("admin_username");
          // redirect to login page suddenly
          if (pathname !== "/cp") {
            router.push("/cp");
          } else {
            // if already on /cp, we need to trigger a re-render to show login form
            // since /cp/page.tsx watches localStorage/state
            window.location.reload();
          }
        }
      });
    }
  }, [pathname, router]);

  return null;
}
