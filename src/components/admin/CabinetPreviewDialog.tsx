"use client";

import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";

interface CabinetPreviewDialogProps {
  cabinetId: string;
  onClose: () => void;
}

export default function CabinetPreviewDialog({
  cabinetId,
  onClose,
}: CabinetPreviewDialogProps) {
  const [cabinet, setCabinet] = useState<CabinetInfo | null>(null);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cabinetResp, memberResp] = await Promise.all([
          api.get(`/cabinet-info/${cabinetId}`),
          api.get(`/member?filter_by=cabinet_id&filter=${cabinetId}`),
        ]);

        setCabinet(cabinetResp.data.data);
        setMemberCount(memberResp.data.meta.total_data ?? 0);
      } catch (err) {
        console.error("Failed to fetch cabinet preview data:", err);
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    if (cabinetId) fetchData();
  }, [cabinetId]);

  // Handle body scroll locking
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-black">
        <div className="bg-white rounded-2xl p-8 w-full max-w-lg flex flex-col items-center">
          <SkeletonPleaseWait />
          <p className="mt-4 font-libertine text-gray-500 italic">
            Memuat detail kabinet...
          </p>
        </div>
      </div>
    );
  }

  if (error || !cabinet) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-black">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiOutlineX size={24} />
          </button>
          <div className="text-center py-4">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p className="text-gray-600 mb-6">
              {error || "Gagal memuat data."}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 lg:p-10 text-black">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold font-averia text-primaryPink">
              {cabinet.tagline}
            </h2>
            <p className="text-gray-500 font-libertine">
              Periode: {new Date(cabinet.period_start ?? "").getFullYear()} -{" "}
              {new Date(cabinet.period_end ?? "").getFullYear()} • {memberCount}{" "}
              Anggota
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-300"
          >
            <HiOutlineX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-10 custom-scrollbar">
          {/* Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400 font-libertine">
                Logo Kabinet
              </label>
              <div className="aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                {cabinet.logo ? (
                  <img
                    src={cabinet.logo.image_url}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="italic text-gray-300">No logo</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400 font-libertine">
                Organigram
              </label>
              <div className="aspect-[3/2] rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                {cabinet.organigram ? (
                  <img
                    src={cabinet.organigram.image_url}
                    alt="Organigram"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="italic text-gray-300">No organigram</span>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Text Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Visi */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold border-l-4 border-primaryPink pl-3">
                Visi
              </h3>
              <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50/50 p-4 rounded-xl border border-gray-100 italic">
                <MarkdownRenderer className="text-justify">
                  {cabinet.visi}
                </MarkdownRenderer>
              </div>
            </div>

            {/* Misi */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold border-l-4 border-primaryPink pl-3">
                Misi
              </h3>
              <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <MarkdownRenderer className="text-justify">
                  {cabinet.misi}
                </MarkdownRenderer>
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold border-l-4 border-primaryPink pl-3">
              Deskripsi
            </h3>
            <div className="prose max-w-none text-gray-700 bg-gray-50/30 p-6 rounded-2xl border border-gray-100">
              <MarkdownRenderer className="text-justify">
                {cabinet.description || "Tidak ada deskripsi."}
              </MarkdownRenderer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl bg-[#12182B] text-white font-medium hover:opacity-90 transition-all duration-300 shadow-md"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
