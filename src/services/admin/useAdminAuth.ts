"use client";

import { useEffect, useState } from "react";

const TOKEN_KEY = "jwt_token";

export function useAdminAuth() {
  const [jwtToken, setJwt] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const syncToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    setJwt(token);
    setReady(true);
  };

  useEffect(() => {
    // initial load
    syncToken();

    // tab switch / focus
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        syncToken();
      }
    };

    // storage update (login/logout from another tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) {
        syncToken();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { jwtToken, ready };
}
