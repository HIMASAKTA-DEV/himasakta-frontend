"use client";

import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

import HeaderSection from "@/components/commons/HeaderSection";
import api from "@/lib/axios";
import { GetManageCabinet } from "@/services/admin/GetManageCabinets";
import type { ManageCabinet } from "@/types/admin/ManageCabinetType";
import Link from "next/link";
import { useEffect, useState } from "react";
import RenderPagination from "../_news/RenderPagination";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

type CabinetRow = ManageCabinet; // type sebaiknya dipindah ke folder types/

// const cabinetData: CabinetRow[]; data sebaiknya diganti dengan useState untuk data fetching

// usahakan kasih komen biar jelas bagian2nya
const LIM_CABINETS = 5;
function ManageCabinet() {
  // handle fetch data
  const [cabinets, setCabinets] = useState<CabinetRow[]>([]);
  const [activeCabinets, setActiveCabinets] = useState<CabinetRow[]>([]);
  const [currPg, setCurrPg] = useState(1);
  const [totData, setTotData] = useState(0);
  const [_errData, setErrData] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [totPage, setTotPg] = useState(1);

  const fetchAllCabinets = async () => {
    setLoadData(true);
    setErrData(false);
    try {
      const json = await GetManageCabinet(currPg, LIM_CABINETS);
      const filteredInactive = json.data.filter(
        (c) => String(c.is_active) === "false",
      );
      const filteredActive = json.data.filter(
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
  }, [currPg]);

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

  // prevent scrolling when opening modal
  useEffect(() => {
    const isModalOpen = showDeleteModal;

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
        <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90  active:opacity-80 duration-300 transition-all max-lg:text-sm">
          <Link href={"/admin/cabinet/add"}>+ Add Cabinet</Link>
        </button>
      </div>

      {/* Table */}
      {loadData && (
        <div
          className={`w-full overflow-hidden rounded-2xl p-6 flex items-center justify-center`}
        >
          <SkeletonPleaseWait />
        </div>
      )}
      <div
        className={`${loadData ? "hidden" : "flex"} w-full overflow-x-auto rounded-2xl border border-gray-200`}
      >
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
            {activeCabinets.map((cabinet) => (
              <tr
                key={cabinet.id}
                className="border-t border-gray-100 transition-colors hover:bg-gray-50/60"
              >
                <td
                  className={`px-6 py-4 font-medium ${cabinet.is_active ? "text-green-500" : "text-red-600"} lg:text-gray-800`}
                  title="active"
                >
                  {cabinet.tagline}
                </td>
                <td className="px-6 py-4 flex justify-center items-center max-lg:hidden">
                  <span
                    className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      cabinet.is_active === true
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {cabinet.is_active === true ? "Aktif" : "Purnatugas"}
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        cabinet.is_active === true
                          ? "bg-green-500"
                          : "bg-red-500"
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
                    <Link
                      href={`/admin/cabinet/${cabinet.id}/edit`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                    >
                      <HiOutlinePencilAlt size={16} />
                    </Link>
                  </div>
                  {/* For development only, remind everyone to delete this in production */}
                  {/* <button
                    onClick={() => {
                      setSelectedCabinetId(cabinet.id);
                      setShowDeleteModal(true);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600"
                  >
                    <HiOutlineTrash size={16} />
                  </button> */}
                </td>
              </tr>
            ))}
            {cabinets.map((cabinet) => (
              <tr
                key={cabinet.id}
                className="border-t border-gray-100 transition-colors hover:bg-gray-50/60"
              >
                <td
                  className={`px-6 py-4 font-medium ${cabinet.is_active ? "text-green-500" : "text-red-600"} lg:text-gray-800`}
                  title="inactive"
                >
                  {cabinet.tagline}
                </td>
                <td className="px-6 py-4 flex justify-center items-center max-lg:hidden">
                  <span
                    className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      cabinet.is_active === true
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {cabinet.is_active === true ? "Aktif" : "Purnatugas"}
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        cabinet.is_active === true
                          ? "bg-green-500"
                          : "bg-red-500"
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
      </div>

      {/* Footer: Showing X of Y + Pagination + Publish */}
      <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
        <p className="font-libertine text-sm text-primaryPink">
          Showing {Math.min(currPg * LIM_CABINETS, totData)} of {totData} in
          current selection
        </p>

        {/* Pagination controls */}
        <div className="flex items-center gap-3">
          {/* Prev page */}
          <button
            disabled={currPg === 1 || loadData}
            onClick={() => setCurrPg((p) => p - 1)}
            className={`p-2 rounded-md border disabled:opacity-40 
                    hover:bg-gray-100 transition flex items-center gap-4
                    ${currPg === 1 || loadData ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {/* icon kiri */}
            &lt;
          </button>

          {/* Page numbers */}
          <RenderPagination
            currPage={currPg}
            totPage={totPage}
            onChange={setCurrPg}
          />

          {/* Next page */}
          <button
            disabled={currPg === totPage || loadData}
            onClick={() => setCurrPg((p) => p + 1)}
            className={`p-2 rounded-md border disabled:opacity-40 
                    hover:bg-gray-100 transition flex items-center gap-4
                    ${currPg === totPage || loadData ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {/* icon kanan */}
            &gt;
          </button>
        </div>
      </div>

      {/* Publish Button */}
      <div className="flex justify-end">
        <button className="rounded-[10px] bg-primaryPink px-8 py-3 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-opacity-90">
          Publish Changes
        </button>
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
    </div>
  );
}

export default ManageCabinet;
