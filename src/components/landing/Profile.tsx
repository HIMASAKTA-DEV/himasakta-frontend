import { CabinetInfo } from "@/types";

export function Profile({ cabinet }: { cabinet: CabinetInfo | null }) {
  if (!cabinet) return null;

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold text-sm mb-6">
              Tentang Kami
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Himpunan Mahasiswa <br />
              <span className="text-primary">Aktuaria</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {cabinet.tagline
                ? `Bersama Kabinet "${cabinet.tagline}", kami berkomitmen untuk memajukan potensi mahasiswa Aktuaria ITS.`
                : "Wadah pengembangan diri dan profesi bagi seluruh mahasiswa Aktuaria ITS."}
            </p>

            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-8 bg-primary rounded-full"></span> Visi
                </h3>
                <p className="text-slate-600 pl-4">{cabinet.visi}</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-8 bg-accent rounded-full"></span> Misi
                </h3>
                <p className="text-slate-600 pl-4 whitespace-pre-line">
                  {cabinet.misi}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500">
              {/* Placeholder Image */}
              <div className="w-full h-full bg-slate-200 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
