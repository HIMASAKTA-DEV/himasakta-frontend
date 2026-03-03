"use client";

import api from "@/lib/axios";
import { GetManageEvents } from "@/services/admin/GetManageEvent";
import { ManageEventsType } from "@/types/admin/ManageEvents";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import RenderPagination from "../_news/RenderPagination";
import HeaderSection from "../commons/HeaderSection";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

function ManageEvent() {
  // handle data fetching all data needed
  const [loadingData, setLoadingData] = useState(false);
  const [_errMainData, setErrMainData] = useState(false);
  const [eventsData, setEventsData] = useState<ManageEventsType[]>([]);
  const [currPg, setCurrPg] = useState(1);
  const [totData, setTotData] = useState(1);
  const [totPg, setTotPg] = useState(1);
  const LIM_MAIN_DATA = 5;
  const fetchAllEvents = async () => {
    setLoadingData(true);
    setErrMainData(false);
    try {
      const json = await GetManageEvents(currPg, LIM_MAIN_DATA);
      setTotData(json.meta.total_data ?? 1);
      setTotPg(json.meta.total_page ?? 1);
      setEventsData(json.data);
    } catch (err) {
      console.error(err);
      setErrMainData(true);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, [currPg]);

  // handle delete event
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!selectedEventId) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await api.delete(`/monthly-event/${selectedEventId}`);

      // close modal
      setShowDeleteModal(false);
      setSelectedEventId(null);

      // refetch member list
      fetchAllEvents();
    } catch (err) {
      console.error(err);
      setDeleteError("Gagal menghapus anggota");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <main className="flex w-full min-h-screen gap-8 p-4 flex-col lg:p-10">
      <div className="flex w-full items-center lg:justify-between max-lg:flex-col gap-2">
        <HeaderSection
          title={"Manage Kegiatan"}
          sub={"Atur daftar kegiatan bulanan (What's On HIMASAKTA)"}
          subStyle="text-black font-libertine"
        />
        <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90  active:opacity-80 duration-300 transition-all max-lg:text-sm">
          <Link href={"/admin/kegiatan/add"}>+ Add Event</Link>
        </button>
      </div>

      <div className="flex w-full flex-col gap-4 rounded-3xl overflow-auto border border-gray-200">
        <table className="w-full min-w-[500px] border-collapse overflow-auto">
          <thead className="bg-[#F8E8EA] text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">NAMA KEGIATAN</th>
              <th className="px-4 py-3 text-left">PUBLISHED</th>
              <th className="px-4 py-3 text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {!loadingData &&
              eventsData.length > 0 &&
              eventsData.map((e) => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{e.title}</td>
                  <td className="px-4 py-3">
                    {new Date(e.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-start gap-2 -translate-x-2">
                      <Link
                        href={`/admin/kegiatan/${e.id}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                      >
                        <HiOutlinePencilAlt size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedEventId(e.id);
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
        {loadingData && (
          <div className="w-full py-6 flex items-center justify-center">
            <SkeletonPleaseWait />
          </div>
        )}
        {eventsData.length === 0 && !loadingData && (
          <div className="w-full py-6 flex items-center justify-center text-gray-700">
            Daftar Kegiatan Kosong
          </div>
        )}
      </div>
      <div className="flex w-full items-center lg:justify-between flex-col lg:flex-row gap-4">
        <p className="font-libertine text-sm text-primaryPink">
          Showing {Math.min(currPg * LIM_MAIN_DATA, totData)} of {totData} in
          current selection
        </p>

        {/* Pagination controls */}
        <div className="flex items-center gap-3">
          {/* Prev page */}
          <button
            disabled={currPg === 1 || loadingData}
            onClick={() => setCurrPg((p) => p - 1)}
            className={`p-2 rounded-md border disabled:opacity-40 
                  hover:bg-gray-100 transition flex items-center gap-4
                  ${currPg === 1 || loadingData ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {/* icon kiri */}
            &lt;
          </button>

          {/* Page numbers */}
          <RenderPagination
            currPage={currPg}
            totPage={totPg}
            onChange={setCurrPg}
          />

          {/* Next page */}
          <button
            disabled={currPg === totPg || loadingData}
            onClick={() => setCurrPg((p) => p + 1)}
            className={`p-2 rounded-md border disabled:opacity-40 
                  hover:bg-gray-100 transition flex items-center gap-4
                  ${currPg === totPg || loadingData ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {/* icon kanan */}
            &gt;
          </button>
        </div>
      </div>
      {/* Show delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Hapus Anggota</h2>

            <p className="text-sm text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus kegiatan ini?{" "}
              <b>Tindakan ini tidak dapat dibatalkan.</b>
            </p>

            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEventId(null);
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
    </main>
  );
}

export default ManageEvent;
