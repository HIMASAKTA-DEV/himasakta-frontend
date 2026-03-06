import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderSection from "../commons/HeaderSection";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/commons/apiResponse";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";
import { PreviewData } from "next";
import { ProgendaType } from "@/types/data/ProgendaType";
import RenderPagination from "../_news/RenderPagination";
import MarkdownRenderer from "../commons/MarkdownRenderer";

type ProgendasTable = {
  id: string;
  name: string;
  created_at: string;
};

function ManageProgenda() {
  const [limitProgenda, setLimitProgenda] = useState(5);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progendas, setProgendas] = useState<ProgendasTable[]>([]);
  const [selectedProgenda, setSelectedProgenda] = useState<string | null>(null);
  const [selectedProgendaName, setSelectedProgendaName] = useState<
    string | null
  >(null);
  const [errorPreview, setErrorPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [viewProgenda, setViewProgenda] = useState<ProgendaType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchProgendaTable = async () => {
    setLoading(true);
    setError(false);
    try {
      const json = await api.get<ApiResponse<ProgendasTable[]>>(
        `/progenda?page=${currPage}&limit=${limitProgenda}`,
      );
      setProgendas(json.data.data);
      setTotalPage(json.data.meta.total_page ?? 1);
      setTotalData(json.data.meta.total_data ?? 1);
    } catch (err) {
      setError(true);
      alert(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
      console.error("API ERROR: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgendaTable();
  }, [currPage, limitProgenda]);

  const handlePreview = async (id: string) => {
    setErrorPreview(false);
    setLoadingPreview(true);
    try {
      const json = await api.get<ApiResponse<ProgendaType>>(`/progenda/${id}`);
      setViewProgenda(json.data.data);
    } catch (err) {
      console.error(err);
      alert(`Gagal memuat data: ${getApiErrorMessage(err)}`);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProgenda) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete(`/progenda/${selectedProgenda}`);
      setShowDeleteModal(false);
      setSelectedProgenda(null);
      await fetchProgendaTable();
    } catch (err) {
      console.error(err);
      setDeleteError(`Gagal menghapus berita: ${getApiErrorMessage(err)}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (viewProgenda || loadingPreview || showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [viewProgenda, loadingPreview, showDeleteModal]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-8 p-4 lg:p-10">
      {/* Header */}
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between justify-center items-center">
        <HeaderSection
          title="Manage Progenda"
          titleStyle="font-averia text-black"
          className="gap-0"
          sub={"Atur data progenda tiap departemen"}
          subStyle="text-black font-libertine"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 font-libertine">
              Show
            </label>
            <select
              value={limitProgenda}
              onChange={(e) => {
                setLimitProgenda(Number(e.target.value));
                setCurrPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all cursor-pointer font-libertine"
            >
              {[5, 10, 15, 20].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm">
            <Link href={"/admin/progenda/add"}>+ Add Progenda</Link>
          </button>
        </div>
      </div>
      {error && !loading && (
        <div className="flex w-full items-center justify-center py-20">
          <p className="text-red-500">
            Gagal memuat data departemen. Silakan coba lagi.
          </p>
        </div>
      )}

      <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 flex-col">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="bg-[#F8E8EA]">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                NAMA PROGENDA
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                PUBLISHED
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-700">
                ACTION
              </th>
            </tr>
          </thead>
          {!loading && !error && (
            <tbody>
              {progendas.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Belum ada data Progenda.
                  </td>
                </tr>
              ) : (
                progendas.map((progenda, idx) => (
                  <tr
                    key={progenda.id ?? idx}
                    className="border-t border-gray-100 transition-colors hover:bg-gray-50/60"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {progenda.name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(progenda.created_at).toLocaleString("id-ID") ??
                        "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/progenda/${progenda.id}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                        >
                          <HiOutlinePencilAlt size={16} />
                        </Link>
                        <button
                          onClick={() => handlePreview(progenda.id as string)}
                          className="bg-white w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                        >
                          <HiOutlineEye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProgenda(progenda.id ?? null);
                            setSelectedProgendaName(progenda.name ?? null);
                            setShowDeleteModal(true);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600"
                        >
                          <HiOutlineTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
        {loading && (
          <div className="w-full py-6 flex items-center justify-center">
            <SkeletonPleaseWait />
          </div>
        )}
        {progendas.length === 0 && !loading && (
          <div className="w-full py-6 flex items-center justify-center text-gray-700">
            Daftar Progenda Kosong
          </div>
        )}
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row mt-8">
        <p className="font-libertine text-sm text-primaryPink">
          Showing {Math.min((currPage - 1) * limitProgenda + 1, totalData)} to{" "}
          {Math.min(currPage * limitProgenda, totalData)} of {totalData} in
          current selection
        </p>
        <RenderPagination
          currPage={currPage}
          totPage={totalPage}
          onChange={setCurrPage}
        />
      </div>
      {/* News preview modal */}
      {(viewProgenda || loadingPreview) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setViewProgenda(null);
            setLoadingPreview(false);
          }}
        >
          <div
            className="bg-white rounded-2xl w-[90%] max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {loadingPreview ? (
              <div className="py-16 flex items-center justify-center">
                <SkeletonPleaseWait />
              </div>
            ) : (
              viewProgenda && (
                <>
                  {viewProgenda.thumbnail && (
                    <div className="relative w-full h-56 overflow-hidden rounded-t-2xl">
                      <img
                        src={viewProgenda.thumbnail.image_url}
                        alt={viewProgenda.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <h2 className="text-2xl font-bold font-averia mb-2">
                      {viewProgenda.name}
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">
                      {new Date(viewProgenda.created_at).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                    <div className="prose prose-sm max-w-none">
                      <HeaderSection title={viewProgenda.name} />
                      <MarkdownRenderer>
                        {viewProgenda.description}
                      </MarkdownRenderer>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <HeaderSection title={"Tujuan"} />
                      <MarkdownRenderer>{viewProgenda.goal}</MarkdownRenderer>
                    </div>
                  </div>
                </>
              )
            )}
            <div className="px-8 pb-6 flex justify-end">
              <button
                onClick={() => setViewProgenda(null)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Hapus Berita</h2>
            <p className="text-sm text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus progenda ini?{" "}
              <b>Tindakan ini tidak dapat dibatalkan.</b>
            </p>
            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProgenda(null);
                  setDeleteError(null);
                }}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90 disabled:opacity-50"
              >
                {deleteLoading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProgenda;
