"use client";

import Image from "next/image";
import HeaderSection from "../commons/HeaderSection";
import { dummyListData } from "./_infomasiKabinet/dummyListData";
import { useEffect, useState } from "react";
import SkeletonInformasiKabinet from "./skeletons/SkeletonInfoKabinet";

export default function InformasiKabinet() {
  // Comment this after creating data fetching
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // TODO: Ini bakal ada data fetching (Buat folder services di src)
  // Informasi kabinet:
  // tampilkan visi, misi, tagline, period, image_url (gambar), untuk deskripsi kabinet sekarang dibuat statis dulu seperti:

  return loading ? (
    <SkeletonInformasiKabinet />
  ) : (
    <section className="w-full flex flex-col lg:flex-row  gap-8 lg:gap-24">
      <div className="order-2 lg:order-1 flex flex-col gap-4">
        <HeaderSection
          title="Informasi Kabinet"
          sub="Lorem ipsum dolor sit amet constectur"
        />
        <p className="font-libertine lg:text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore aliqua. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore aliqua. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        </p>
        <h1 className="font-libertine font-bold lg:text-2xl">
          Lorem ipsum dolor sit amet
        </h1>
        {/* Ini ul kemungkinan ada dua: visi dan misi */}
        <ul className="list-disc list-inside ml-6">
          {dummyListData.map((li) => (
            <li key={li.name}>{li.data}</li>
          ))}
        </ul>
      </div>
      <Image
        src="/images/InformasiKabinet.png"
        alt="profil-himpunan"
        width={402}
        height={569}
        className="order-1 lg:order-2 rounded-3xl hidden lg:inline-block"
      />
      <div className="lg:hidden w-full relative aspect-[16/12]">
        <Image
          src="/images/InformasiKabinet.png"
          alt="profil-himpunan"
          fill
          className="order-1 lg:order-2 rounded-3xl object-cover object-center"
        />
      </div>
    </section>
  );
}
