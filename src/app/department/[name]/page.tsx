import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { DeptGallery } from "@/components/department/DeptGallery";
import { DeptHero } from "@/components/department/DeptHero";
import { DeptProgenda } from "@/components/department/DeptProgenda";
import {
  getDepartmentByName,
  getDepartments,
  getGalleryByDepartment,
  getProgendaByDepartment,
} from "@/services/api";

type Props = {
  params: { name: string };
};

// Generate static params for all departments
export async function generateStaticParams() {
  const departments = await getDepartments();
  return departments.map((dept) => ({
    name: dept.name,
  }));
}

export default async function DepartmentPage({ params }: Props) {
  // Parallel Fetching
  const [department, progendas, gallery] = await Promise.all([
    getDepartmentByName(params.name),
    getProgendaByDepartment(params.name), // Note: Check if backend supports name here too
    getGalleryByDepartment(params.name),
  ]);

  if (!department) {
    return <div>Department not found</div>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <DeptHero department={department} />
        {/* Structure specific to dept would go here */}
        <DeptProgenda progendas={progendas} />

        <DeptGallery gallery={gallery} />
      </main>
      <Footer />
    </>
  );
}
