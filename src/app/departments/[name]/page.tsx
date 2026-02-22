"use client";

import NotFound from "@/app/not-found";
import EventSkeleton from "@/components/commons/skeletons/SkeletonGrid";
import SkeletonHeaderSection from "@/components/commons/skeletons/SkeletonHeaderSection";
import SkeletonParagraph from "@/components/commons/skeletons/SkeletonParagraph";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import SkeletonSection from "@/components/commons/skeletons/SkeletonSection";
import GalleryDept from "@/components/departments/GalleryDept";
import InformasiDepartment from "@/components/departments/InformasiDepartment";
import ProgendaDept from "@/components/departments/ProgendaDept";
import StrukturAnggota from "@/components/departments/StrukturAnggota";
import ButtonLink from "@/components/links/ButtonLink";
import Layout from "@/layouts/Layout";
import { GetDeptByName } from "@/services/departments/[name]/GetDepartmentByName";
import { DepartmentType } from "@/types/data/DepartmentType";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

function page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dept, setDept] = useState<DepartmentType | null>(null);
  // fetch depts info
  const params = useParams();
  const { name } = params;
  const fetchDeptsByName = async (name: string) => {
    setLoading(true);
    try {
      const data = await GetDeptByName(name);
      // console.log(data);
      setDept(data.data);
    } catch (err) {
      console.error(err);
      setError(true);
      setDept(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!name) return;
    const inp = Array.isArray(name) ? name[0] : name;
    fetchDeptsByName(inp);
  }, [name]);
  if (error) {
    NotFound();
  }

  return (
    <Layout withFooter withNavbar={false} transparentOnTop>
      <main className="min-h-screen px-10 flex flex-col lg:px-40 gap-4 mb-20 py-10">
        <section>Ini Navbar</section>
        <section className="bg-white rounded-lg shadow-[0_0_12px_rgba(0,0,0,0.15)] mb-10 flex flex-col gap-8 p-10">
          {loading ? (
            <div className="flex items-center lg:items-start lg:justify-between lg:flex-row flex-col gap-8">
              {/* Skeleton matches the 40% column */}
              <div className="md:w-[40%] w-full">
                <SkeletonSection />{" "}
                {/* Ensure this has a height/aspect ratio inside */}
              </div>
              {/* Skeleton matches the 55% column */}
              <div className="w-full lg:w-[100%] flex flex-col gap-4 lg:mt-8">
                <SkeletonHeaderSection />
                <SkeletonParagraph />
              </div>
              <SkeletonPleaseWait />
            </div>
          ) : (
            <InformasiDepartment {...dept} />
          )}
          <StrukturAnggota {...dept} />
          <ProgendaDept {...dept} />
          <GalleryDept {...dept} />
          <p>Hi ini main</p>
          <p>Hi ini main</p>
          <p>Hi ini main</p>
          <p>Hi ini main</p>
        </section>

        <ButtonLink
          href="/"
          className="w-28 flex gap-4 items-center mb-10"
          variant="black"
        >
          <FaChevronLeft />
          <p>Home</p>
        </ButtonLink>
      </main>
    </Layout>
  );
}

export default page;
