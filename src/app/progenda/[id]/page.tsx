import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getProgendaById } from "@/services/api";
import Link from "next/link";
import {
  FaArrowLeft,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

type Props = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

// ...

export default async function ProgendaDetailPage({ params }: Props) {
  let progenda;
  try {
    progenda = await getProgendaById(params.id);
  } catch (_e) {
    notFound();
  }

  if (!progenda) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl relative">
          {/* Back Button */}
          <Link
            href={`/department/${progenda.department_id}`}
            className="absolute -top-12 left-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <FaArrowLeft size={12} /> Back
          </Link>

          <div className="border-x border-b border-primary/20 bg-white shadow-sm p-8 md:p-12 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>

            {/* Header */}
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
              {progenda.name}
            </h1>
            <p className="font-playfair text-xl text-slate-500 mb-10 italic">
              {progenda.department?.name || "Program Kerja Unggulan"}
            </p>

            {/* Main Image */}
            <div className="aspect-video w-full rounded-3xl overflow-hidden mb-10 border border-slate-100 shadow-lg">
              {progenda.thumbnail?.image_url ? (
                <img
                  src={progenda.thumbnail.image_url}
                  alt={progenda.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-playfair italic">
                  No Thumbnail Available
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none font-playfair text-slate-700 mb-10 leading-relaxed">
              <p>{progenda.description}</p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mb-12 border-b-2 border-dotted border-primary/30 pb-8">
              {progenda.website_link && (
                <Link
                  href={progenda.website_link}
                  target="_blank"
                  className="p-3 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                >
                  <FaGlobe size={20} />
                </Link>
              )}
              {progenda.instagram_link && (
                <Link
                  href={progenda.instagram_link}
                  target="_blank"
                  className="p-3 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                >
                  <FaInstagram size={20} />
                </Link>
              )}
              {progenda.twitter_link && (
                <Link
                  href={progenda.twitter_link}
                  target="_blank"
                  className="p-3 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                >
                  <FaTwitter size={20} />
                </Link>
              )}
              {progenda.linkedin_link && (
                <Link
                  href={progenda.linkedin_link}
                  target="_blank"
                  className="p-3 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                >
                  <FaLinkedin size={20} />
                </Link>
              )}
              {progenda.youtube_link && (
                <Link
                  href={progenda.youtube_link}
                  target="_blank"
                  className="p-3 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                >
                  <FaYoutube size={20} />
                </Link>
              )}
            </div>

            {/* Tujuan */}
            <div className="mb-12">
              <h2 className="font-playfair text-4xl font-bold mb-6 text-slate-900 border-b-2 border-dotted border-primary/30 pb-2 inline-block">
                Tujuan
              </h2>
              <p className="font-playfair text-lg text-slate-700 leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2">
                "{progenda.goal}"
              </p>
            </div>

            {/* Gallery Grid */}
            {progenda.feeds && progenda.feeds.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {progenda.feeds.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-500 group"
                  >
                    <img
                      src={item.image_url}
                      alt={item.caption || "Gallery"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Timeline */}
            <div className="mb-8">
              <h2 className="font-playfair text-4xl font-bold mb-12 text-slate-900 border-b-2 border-dotted border-primary/30 pb-2 inline-block">
                Timeline
              </h2>
              <div className="relative pt-8 pb-12 px-4">
                {/* Horizontal Line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 rounded-full"></div>

                <div className="flex justify-between relative z-10 overflow-x-auto pb-4 gap-8 no-scrollbar">
                  {progenda.timelines?.length > 0 ? (
                    progenda.timelines.map((timeline) => (
                      <div
                        key={timeline.id}
                        className="flex flex-col items-center min-w-[120px] group"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-200 border-4 border-white shadow-sm mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 relative">
                          <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <span className="font-playfair text-sm font-bold text-slate-900 mb-1 text-center block w-full whitespace-nowrap">
                          {new Date(timeline.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                        <span className="font-playfair text-xs text-slate-500 uppercase tracking-widest text-center block w-full">
                          {timeline.info}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center text-slate-400 font-playfair italic">
                      Timeline belum tersedia
                    </div>
                  )}
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
