import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getProgendaById } from "@/services/api";
import Link from "next/link";
import {
  FaArrowLeft,
  FaBullseye,
  FaCalendarAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

type Props = {
  params: { id: string };
};

export default async function ProgendaDetailPage({ params }: Props) {
  const progenda = await getProgendaById(params.id);

  if (!progenda) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Program Kerja tidak ditemukan
            </h1>
            <Link href="/" className="text-primary hover:underline">
              Kembali ke Beranda
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href={`/department/${progenda.department_id}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors"
          >
            <FaArrowLeft /> Kembali ke Departemen
          </Link>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            {/* Banner/Header */}
            <div className="bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
                  <FaCalendarAlt className="text-accent" /> {progenda.timeline}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {progenda.name}
                </h1>
                <p className="text-slate-300 text-lg max-w-2xl">
                  {progenda.description}
                </p>
              </div>
            </div>

            <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>{" "}
                    Tujuan
                  </h2>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 italic flex gap-4">
                    <FaBullseye className="text-primary text-xl shrink-0 mt-1" />
                    <p>"{progenda.goal}"</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-accent rounded-full"></span>{" "}
                    Detail Program
                  </h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {progenda.description}
                  </p>
                </div>
              </div>

              <div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sticky top-24">
                  <h3 className="font-bold text-slate-900 mb-4">
                    Informasi Tambahan
                  </h3>

                  {progenda.website_link && (
                    <Link
                      href={progenda.website_link}
                      target="_blank"
                      className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 mb-4"
                    >
                      Kunjungi Website <FaExternalLinkAlt size={14} />
                    </Link>
                  )}

                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span>Waktu Pelaksanaan</span>
                      <span className="font-medium text-slate-900">
                        {progenda.timeline}
                      </span>
                    </div>
                    {/* Add more metadata if available */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
