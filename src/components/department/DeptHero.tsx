import { Department } from "@/types";
import { FaBuilding } from "react-icons/fa";

export function DeptHero({ department }: { department: Department }) {
  return (
    <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl shrink-0">
            {department.logo?.image_url ? (
              <img
                src={department.logo.image_url}
                alt={department.name}
                className="w-20 h-20 object-contain"
              />
            ) : (
              <FaBuilding className="text-4xl text-white/80" />
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {department.name}
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl">
              {department.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
