"use client";

import NotFound from "@/app/not-found";
import SkeletonHeaderSection from "@/components/commons/skeletons/SkeletonHeaderSection";
import SkeletonParagraph from "@/components/commons/skeletons/SkeletonParagraph";
import SkeletonSection from "@/components/commons/skeletons/SkeletonSection";
import GalleryDept from "@/components/departments/GalleryDept";
import InformasiDepartment from "@/components/departments/InformasiDepartment";
import NavbarDept from "@/components/departments/NavbarDept";
import ProgendaDept from "@/components/departments/ProgendaDept";
import StrukturAnggota from "@/components/departments/StrukturAnggota";
import Layout from "@/layouts/Layout";
import clsxm from "@/lib/clsxm";
import { GetDeptBySlug } from "@/services/departments/[slug]/GetDepartmentBySlug";
import { DepartmentType } from "@/types/data/DepartmentType";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DepartmentClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dept, setDept] = useState<DepartmentType | null>(null);
  const [viewingImg, setViewingImg] = useState(false);
  const params = useParams();
  const { slug } = params;
  const fetchDeptsBySlug = async (slug: string) => {
    setLoading(true);
    try {
      const data = await GetDeptBySlug(slug);
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
    if (!slug) return;
    const inp = Array.isArray(slug) ? slug[0] : slug;
    fetchDeptsBySlug(inp);
  }, [slug]);
  if (error) {
    return <NotFound />;
  }

  return (
    <Layout withFooter withNavbar={false} transparentOnTop>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div
          className={clsxm(
            "sticky top-0 left-0 w-full h-20 bg-gradient-to-b from-white/95 to-white pointer-events-none z-[500] backdrop-blur-sm",
            viewingImg ? "hidden" : "",
          )}
        />
        <main className="min-h-screen w-[95vw] px-4 flex flex-col lg:px-40 gap-4 mb-10 py-6 lg:py-10 relative">
          <NavbarDept className={`${viewingImg ? "hidden" : ""}`} />
          <section className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] mb-10 flex flex-col gap-8 p-5 lg:p-12 overflow-hidden ring-1 ring-primaryPink/50">
            {loading ? (
              <div className="flex items-center lg:items-start lg:justify-between lg:flex-row flex-col gap-8 cursor-wait">
                <div className="md:w-[40%] w-full">
                  <SkeletonSection />{" "}
                </div>
                <div className="w-full lg:w-[100%] flex flex-col gap-4 lg:mt-8">
                  <SkeletonHeaderSection />
                  <SkeletonParagraph />
                </div>
              </div>
            ) : (
              <InformasiDepartment {...dept} />
            )}
            <StrukturAnggota {...dept} viewingImg={setViewingImg} />
            <ProgendaDept {...dept} />
            <GalleryDept {...dept} viewingImg={setViewingImg} />
          </section>
        </main>
      </div>
    </Layout>
  );
}
