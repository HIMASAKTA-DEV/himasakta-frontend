"use client";

import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";

import HeaderSection from "@/components/commons/HeaderSection";
import api from "@/lib/axios";
import { GetManageCabinet } from "@/services/admin/GetManageCabinets";
import type { ManageCabinet } from "@/types/admin/ManageCabinetType";
import Link from "next/link";
import { useEffect, useState } from "react";
import RenderPagination from "../_news/RenderPagination";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";
import CabinetPreviewDialog from "./CabinetPreviewDialog";

type CabinetRow = ManageCabinet; // type sebaiknya dipindah ke folder types/

// const cabinetData: CabinetRow[]; data sebaiknya diganti dengan useState untuk data fetching

// usahakan kasih komen biar jelas bagian2nya
function ManageCabinet() {
  // handle fetch data
  const [cabinets, setCabinets] = useState<CabinetRow[]>([]);
  const [activeCabinets, setActiveCabinets] = useState<CabinetRow[]>([]);
  const [currPg, setCurrPg] = useState(1);
  const [limCabinets, setLimCabinets] = useState(5);
  const [totData, setTotData] = useState(0);
  const [_errData, setErrData] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [totPage, setTotPg] = useState(1);

  // handle preview
  const [selectedPreviewId, setSelectedPreviewId] = useState<string | null>(
    null,
  );

  const fetchAllCabinets = async () => {
    setLoadData(true);
    setErrData(false);
    try {
      const json = await GetManageCabinet(currPg, limCabinets);

      // Custom Sorting Logic:
      // 1. is_active (true first)
      // 2. newest period_start
      // 3. newest period_end
      const sortedData = [...json.data].sort((a, b) => {
        // Active first
        if (a.is_active !== b.is_active) {
          return a.is_active ? -1 : 1;
        }

        // Same active status, compare period_start (newest first)
        const startA = new Date(a.period_start).getTime();
        const startB = new Date(b.period_start).getTime();
        if (startA !== startB) {
          return startB - startA;
        }

        // Same period_start, compare period_end (newest first)
        const endA = new Date(a.period_end).getTime();
        const endB = new Date(b.period_end).getTime();
        return endB - endA;
      });

      const filteredInactive = sortedData.filter(
        (c) => String(c.is_active) === "false",
      );
      const filteredActive = sortedData.filter(
        (c) => String(c.is_active) === "true",
      );
      setCabinets(filteredInactive);
      setActiveCabinets(filteredActive);
      setTotData(json.meta.total_data ?? 1);
      setTotPg(json.meta.total_page ?? 1);
    } catch (err) {
      console.error(err);
      setErrData(true);
    } finally {
      setLoadData(false);
    }
  };

  useEffect(() => {
    fetchAllCabinets();
  }, [currPg, limCabinets]);

  // TODO: handle delete
  // handle delete anggota
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCabinetId, setSelectedCabinetId] = useState<string | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!selectedCabinetId) return; // user tidak jadi del

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await api.delete(`/cabinet-info/${selectedCabinetId}`);

      // close modal
      setShowDeleteModal(false);
      setSelectedCabinetId(null);

      // refetch member list
      fetchAllCabinets();
    } catch (err) {
      console.error(err);
      setDeleteError("Gagal menghapus anggota");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const isModalOpen = showDeleteModal || !!selectedPreviewId;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeleteModal]);

  return (
    <div className="flex min-h-screen w-full flex-col gap-8 p-4 lg:p-10">
      <div className="flex w-full items-center justify-between gap-4 max-lg:flex-col">
        {/* Header */}
        <HeaderSection
          title="Manage Kabinet"
          titleStyle="font-averia text-black max-lg:text-3xl"
          className="gap-0"
          sub="Atur informasi tiap kabinet"
          subStyle="font-libertine text-black"
        />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 font-libertine">
              Show
            </label>
            <select
              value={limCabinets}
              onChange={(e) => {
                setLimCabinets(Number(e.target.value));
                setCurrPg(1); // reset to first page
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all cursor-pointer"
            >
              {[5, 10, 15, 20].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm">
            <Link href={"/admin/cabinet/add"}>+ Add Cabinet</Link>
          </button>
        </div>
      </div>
      {_errData && !loadData && (
        <div className="flex w-full items-center justify-center py-20">
          <p className="text-red-500">
            Gagal memuat data departemen. Silakan coba lagi.
          </p>
        </div>
      )}
      <div className="flex w-full overflow-x-auto rounded-2xl border border-gray-200 flex-col">
        <table className="w-full min-w-[500px] border-collapse">
          <thead>
            <tr className="bg-[#F8E8EA]">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                Kabinet
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 text-center max-lg:hidden">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-700 max-lg:hidden">
                Periode
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!loadData &&
              activeCabinets.map((cabinet) => (
                <tr
                  key={cabinet.id}
                  className="border-t border-gray-100 transition-colors hover:bg-gray-50/60"
                >
                  <td
                    className={`px-6 py-4 font-medium ${
                      cabinet.is_active ? "text-green-500" : "text-red-600"
                    } lg:text-gray-800`}
                    title="active"
                  >
                    {cabinet.tagline}
                  </td>

                  <td className="px-6 py-4 flex justify-center items-center max-lg:hidden">
                    <span
                      className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        cabinet.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {cabinet.is_active ? "Aktif" : "Purnatugas"}
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          cabinet.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600 text-center max-lg:hidden">
                    {new Date(cabinet.period_start).getFullYear()} -{" "}
                    {new Date(cabinet.period_end).getFullYear()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedPreviewId(cabinet.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-pink-50 hover:text-primaryPink"
                      >
                        <HiOutlineEye size={18} />
                      </button>
                      <Link
                        href={`/admin/cabinet/${cabinet.id}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                      >
                        <HiOutlinePencilAlt size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

            {!loadData &&
              cabinets.map((cabinet) => (
                <tr
                  key={cabinet.id}
                  className="border-t border-gray-100 transition-colors hover:bg-gray-50/60"
                >
                  <td
                    className={`px-6 py-4 font-medium ${
                      cabinet.is_active ? "text-green-500" : "text-red-600"
                    } lg:text-gray-800`}
                    title="inactive"
                  >
                    {cabinet.tagline}
                  </td>

                  <td className="px-6 py-4 flex justify-center items-center max-lg:hidden">
                    <span
                      className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        cabinet.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {cabinet.is_active ? "Aktif" : "Purnatugas"}
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          cabinet.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600 text-center max-lg:hidden">
                    {new Date(cabinet.period_start).getFullYear()} -{" "}
                    {new Date(cabinet.period_end).getFullYear()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedPreviewId(cabinet.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-pink-50 hover:text-primaryPink"
                      >
                        <HiOutlineEye size={18} />
                      </button>
                      <Link
                        href={`/admin/cabinet/${cabinet.id}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                      >
                        <HiOutlinePencilAlt size={16} />
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedCabinetId(cabinet.id);
                          setShowDeleteModal(true);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loadData && (
          <div className="w-full py-6 flex items-center justify-center">
            <SkeletonPleaseWait />
          </div>
        )}
        {cabinets.length === 0 && !loadData && (
          <div className="w-full py-6 flex items-center justify-center text-gray-700">
            Daftar Kegiatan Kosong
          </div>
        )}
      </div>

      {/* Footer: Showing X of Y + Pagination + Publish */}
      <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
        <p className="font-libertine text-sm text-primaryPink">
          Showing {Math.min((currPg - 1) * limCabinets + 1, totData)} to{" "}
          {Math.min(currPg * limCabinets, totData)} of {totData} in current
          selection
        </p>

        <RenderPagination
          currPage={currPg}
          totPage={totPage}
          onChange={setCurrPg}
        />
      </div>

      {/* Show delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Hapus Anggota</h2>

            <p className="text-sm text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus kabinet ini?{" "}
              <b>Tindakan ini tidak dapat dibatalkan.</b>
            </p>

            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCabinetId(null);
                }}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 duration-200 transition-all"
              >
                Batal
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90 disabled:opacity-50 duration-200 transition-all"
              >
                {deleteLoading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      {selectedPreviewId && (
        <CabinetPreviewDialog
          cabinetId={selectedPreviewId}
          onClose={() => setSelectedPreviewId(null)}
        />
      )}
    </div>
  );
}

export default ManageCabinet;
