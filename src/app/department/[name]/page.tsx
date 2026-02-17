import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { DeptGallery } from "@/components/department/DeptGallery";
import { DeptHero } from "@/components/department/DeptHero";
import { DeptMembers } from "@/components/department/DeptMembers";
import { DeptProgenda } from "@/components/department/DeptProgenda";
import {
  getDepartmentByName,
  getDepartments,
  getGalleryByDepartment,
  getMembersByDepartment,
  getProgendaByDepartment,
} from "@/services/api";

type Props = {
  params: { name: string };
};

export const dynamic = "force-dynamic";

// Generate static params for all departments
export async function generateStaticParams() {
  const response = await getDepartments(1, 100);
  const departments = response.data || [];
  return departments.map((dept) => ({
    name: dept.name,
  }));
}

import { notFound } from "next/navigation";

// ...

export default async function DepartmentPage({ params }: Props) {
  let department;
  try {
    department = await getDepartmentByName(params.name);
  } catch (_e) {
    notFound();
  }

  if (!department) {
    notFound();
  }

  // Parallel Fetching for secondary data using the UUID
  const [progendas, gallery, members] = await Promise.all([
    getProgendaByDepartment(department.id),
    getGalleryByDepartment(department.id),
    getMembersByDepartment(department.id),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <DeptHero department={department} />
        {/* Structure specific to dept would go here */}
        <DeptProgenda progendas={progendas} />
        <DeptMembers members={members} />
        <DeptGallery gallery={gallery} />
      </main>
      <Footer />
    </>
  );
}
