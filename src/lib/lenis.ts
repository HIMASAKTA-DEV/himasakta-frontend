"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

type LenisWindow = typeof globalThis & {
  lenis?: Lenis;
};

const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1, // Sedikit dinaikkan biar momentumnya dapet (kalau terlalu kecil malah gak licin)
      lerp: 0.07,
      easing: (t) => t,
      smoothWheel: true,

      // Desktop kencang
      wheelMultiplier: 1.5,

      // MOBILE FIX:
      // 1. Naikkan touchMultiplier secara drastis (coba 5 sampai 10)
      touchMultiplier: 1.5,

      // 2. Aktifkan smoothTouch agar settingan di atas efeknya berasa di HP
      // Default-nya false, makanya settingan touchMultiplier sering gak berasa
      // @ts-ignore (beberapa versi lenis butuh ini)
      smoothTouch: true,

      infinite: false,
    });

    (globalThis as LenisWindow).lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      (globalThis as LenisWindow).lenis = undefined;
    };
  }, []);
};

export default useLenis;
