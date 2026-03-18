"use client";

import useLenis from "@/lib/lenis";
import { ReactNode } from "react";

export default function LenisWrapper({ children }: { children: ReactNode }) {
  useLenis();
  return <>{children}</>;
}
