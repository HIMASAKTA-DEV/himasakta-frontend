import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function InfoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Informasi Terpadu{" "}
              <span className="text-primary italic">HIMASAKTA</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Segala tautan penting, prosedur, dan informasi mengenai Himpunan
              Mahasiswa Aktuaria ITS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* About Section */}
            <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <span className="font-bold">01</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Tentang Kabinet
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="font-bold text-primary mb-2 italic">
                  AVANTURIER (Adventurer)
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  HIMASAKTA ITS periode 2024 mengusung nama AVANTURIER. Sebagai
                  kabinet ke-6, Avanturier diharapkan melanjutkan tonggak
                  kepemimpinan dan melayani aspirasi mahasiswa Aktuaria ITS.
                </p>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wider">
                      Visi
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Mengoptimalkan fungsi HIMASAKTA ITS sebagai rumah yang
                      mewadahi kebutuhan dan potensi anggotanya, serta
                      meningkatkan eksistensi di dalam maupun luar Departemen
                      Aktuaria ITS.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wider">
                      Misi
                    </h3>
                    <ul className="text-slate-600 text-xs leading-relaxed list-disc pl-4 space-y-2 text-justify">
                      <li>
                        Menumbuhkan rasa kepemilikan anggota terhadap organisasi
                        dengan menciptakan budaya kerja yang sehat.
                      </li>
                      <li>
                        Memposisikan HIMASAKTA sebagai fasilitator pemenuhan
                        kebutuhan dan potensi mahasiswa Aktuaria ITS.
                      </li>
                      <li>
                        Meningkatkan eksistensi melalui branding yang optimal,
                        kolaborasi, dan sistem informasi yang terintegrasi.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-700">
              {/* Media Partner SOP Section */}
              <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                  <span className="font-bold">02</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Media Partner
                </h2>
                <p className="text-slate-500 text-sm mb-8">
                  Prosedur dan panduan untuk menjalin kerjasama publikasi media
                  partner dengan HIMASAKTA ITS.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="https://its.id/m/PostEksternalHimasakta"
                    target="_blank"
                    className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-primary transition-all rounded-3xl border border-slate-100 group"
                  >
                    <FaExternalLinkAlt
                      className="text-primary mb-3 group-hover:text-white transition-colors"
                      size={20}
                    />
                    <span className="font-bold text-slate-800 text-xs group-hover:text-white transition-colors">
                      SOP Eksternal
                    </span>
                  </a>
                  <a
                    href="https://its.id/m/PostInternalHimasakta"
                    target="_blank"
                    className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-primary transition-all rounded-3xl border border-slate-100 group"
                  >
                    <FaExternalLinkAlt
                      className="text-primary mb-3 group-hover:text-white transition-colors"
                      size={20}
                    />
                    <span className="font-bold text-slate-800 text-xs group-hover:text-white transition-colors">
                      SOP Internal
                    </span>
                  </a>
                </div>
              </section>

              {/* Contact Section */}
              <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-900/10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <span className="font-bold text-white/50">03</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
                <p className="text-slate-400 text-sm mb-8">
                  Kami terbuka untuk diskusi dan pertanyaan lebih lanjut melalui
                  platform media sosial kami.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://www.instagram.com/himasakta.its/?hl=id"
                    target="_blank"
                    className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group"
                  >
                    <FaInstagram size={20} className="text-pink-500" />
                    <span className="text-xs font-bold">Instagram</span>
                  </a>
                  <a
                    href="https://www.tiktok.com/@himasakta.its"
                    target="_blank"
                    className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                  >
                    <FaTiktok size={20} className="text-white" />
                    <span className="text-xs font-bold">TikTok</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/himasaktaits/"
                    target="_blank"
                    className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                  >
                    <FaLinkedin size={20} className="text-blue-500" />
                    <span className="text-xs font-bold">LinkedIn</span>
                  </a>
                  <a
                    href="https://www.youtube.com/@himasaktaits4262"
                    target="_blank"
                    className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                  >
                    <FaYoutube size={20} className="text-red-500" />
                    <span className="text-xs font-bold">YouTube</span>
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
