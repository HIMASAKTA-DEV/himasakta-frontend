"use client";

import { mediaToImages } from "@/lib/mediaToImages";
import { DepartmentType } from "@/types/data/DepartmentType";
import Link from "next/link";
import HeaderSection from "../commons/HeaderSection";
import SocmedCard from "./_socmedCard";
import ImagesSlideshow from "./slideShowImages.tsx/ImagesSlideshow";

function InformasiDepartment({ ...dept }: DepartmentType) {
  const logoImages = mediaToImages(dept?.logo);

  return (
    <div className="flex items-center lg:items-start lg:justify-between lg:flex-row flex-col gap-8">
      <div className="md:w-[40%] w-full">
        <div className="w-full aspect-[9/11] rounded-xl relative shadow-md lg:shadow-lg hover:shadow-xl duration-300 transition-all">
          <ImagesSlideshow images={logoImages} />
        </div>
      </div>
      <div className="w-full lg:w-[55%] flex flex-col items-start justify-start lg:mt-8 gap-4">
        <HeaderSection
          title={`Departemen ${dept?.name}`}
          sub={"Informasi Department"}
          subStyle="font-libertine text-slate-700 text-lg font-semibold"
        />

        <p className="text-md font-libertine">{dept?.description}</p>

        <div className="gap-2 flex flex-col">
          <h1 className="font-libertine font-bold text-xl">Akademik</h1>
          <ul className="list-disc list-inside ml-6">
            <li
              key={"bankSoal"}
              className="text-md font-libertine hover:underline transition-all duration-300"
            >
              <Link href={dept?.bank_soal_link ?? "/"}>
                Bank Soal Department
              </Link>
            </li>
            <li
              key={"silabus"}
              className="text-md font-libertine hover:underline transition-all duration-300"
            >
              <Link href={dept?.silabus_link ?? "/"}>Silabus</Link>
            </li>
            <li
              key={"bankSoal"}
              className="text-md font-libertine hover:underline transition-all duration-300"
            >
              <Link href={dept?.bank_ref_link ?? "/"}>Bank Referensi</Link>
            </li>
          </ul>
        </div>

        <SocmedCard {...dept} />
      </div>
    </div>
  );
}

export default InformasiDepartment;
