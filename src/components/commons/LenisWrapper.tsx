"use client";

import { ReactNode } from "react";
import useLenis from "@/lib/lenis";

export default function LenisWrapper({ children }: { children: ReactNode }) {
  useLenis();
  return <>{children}</>;
}
