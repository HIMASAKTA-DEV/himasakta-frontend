"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      // 1. DURASI SANGAT PENDEK (Respon Instan)
      // Makin kecil, makin gak kerasa "berat" di awal.
      duration: 0.3,

      // 2. LERP TINGGI (Ngikutin mouse 1:1)
      // 0.15 - 0.2 adalah batas aman sebelum efek "smooth"-nya hilang.
      lerp: 0.25,

      // 3. EASING LINEAR (Gak nahan di akhir)
      // Kita pakai t (linear) supaya kecepatannya konstan dari awal sampai akhir.
      easing: (t) => t,

      smoothWheel: true,

      // 4. MULTIPLIER EKSTRIM
      // Kalau 3.0 kurang, kita gas ke 4.5. Ini harusnya sekali scroll
      // bisa langsung pindah satu section besar.
      wheelMultiplier: 5,

      // 5. TOUCH AGGRESSIVE (Buat trackpad/mobile)
      touchMultiplier: 2.5,

      infinite: false,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
};

export default useLenis;
