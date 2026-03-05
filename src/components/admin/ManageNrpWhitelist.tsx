"use client";

import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import Typography from "../Typography";
import RenderPagination from "../_news/RenderPagination";
import HeaderSection from "../commons/HeaderSection";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

type NrpEntry = {
  id: string;
  Nrp: string;
  Name: string;
  created_at: string;
  updated_at: string;
};

function ManageNrpWhitelist() {
  const [allData, setAllData] = useState<NrpEntry[]>([]);
  const [currPg, setCurrPg] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNrp, setSelectedNrp] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resp = await api.get(`/nrp-whitelist`);
      const raw = resp.data?.data ?? resp.data ?? [];
      const arr = Array.isArray(raw) ? raw : [];
      setAllData(arr);
    } catch (err) {
      console.error("NRP fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totData = allData.length;
  const totPage = Math.max(1, Math.ceil(totData / limit));
  const paged = allData.slice((currPg - 1) * limit, currPg * limit);

  useEffect(() => {
    setCurrPg(1);
  }, [limit]);

  const handleDelete = async () => {
    if (!selectedNrp) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete(`/nrp-whitelist/${selectedNrp}`);
      setShowDeleteModal(false);
      setSelectedNrp(null);
      fetchData();
    } catch (err) {
      setDeleteError(`Gagal menghapus: ${getApiErrorMessage(err)}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (showDeleteModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeleteModal]);

  return (
    <main className="flex w-full min-h-screen gap-8 p-4 flex-col lg:p-10">
      <div className="flex w-full items-center lg:justify-between max-lg:flex-col gap-4">
        <div>
          <HeaderSection
            title="Manage Whitelist"
            titleStyle="font-averia text-black text-5xl max-lg:text-3xl"
            className="gap-0"
          />
          <Typography
            variant="p"
            className="text-gray-600 mt-2 font-averia italic"
          >
            Atur NRP yang dapat mengakses informasi khusus
          </Typography>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 font-libertine">
              Show
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all cursor-pointer"
            >
              {[5, 10, 15, 20].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <Link
            href="/admin/nrp-whitelist/add"
            className="px-5 py-2.5 bg-primaryPink text-white font-libertine rounded-xl hover:opacity-90 active:scale-95 duration-300 transition-all shadow-lg shadow-pink-200 flex items-center gap-2"
          >
            + Add NRP
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full rounded-3xl overflow-hidden border border-gray-200">
        <table className="w-full min-w-[400px] border-collapse">
          <thead className="bg-[#F8E8EA] text-gray-700">
            <tr>
              <th className="px-6 py-3.5 text-left font-semibold text-sm">
                NRP
              </th>
              <th className="px-6 py-3.5 text-left font-semibold text-sm">
                NAMA
              </th>
              <th className="px-6 py-3.5 text-center font-semibold text-sm">
                ACTIONS
              </th>
            </tr>
          </thead>
          {!loading && paged.length > 0 && (
            <tbody>
              {paged.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-sm">
                    {entry.Nrp ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">{entry.Name ?? "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/nrp-whitelist/${entry.id}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                      >
                        <HiOutlinePencilAlt size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedNrp(entry.Nrp);
                          setSelectedName(entry.Name);
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
          )}
        </table>
        {loading && (
          <div className="w-full py-10 flex items-center justify-center">
            <SkeletonPleaseWait />
          </div>
        )}
        {!loading && allData.length === 0 && (
          <div className="w-full py-10 flex items-center justify-center text-gray-500">
            Daftar NRP Whitelist Kosong
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
        <p className="font-libertine text-sm text-primaryPink">
          Showing {Math.min((currPg - 1) * limit + 1, totData)} to{" "}
          {Math.min(currPg * limit, totData)} of {totData} in current selection
        </p>
        <RenderPagination
          currPage={currPg}
          totPage={totPage}
          onChange={setCurrPg}
        />
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Hapus NRP</h2>
            <p className="text-sm text-gray-600 mb-4">
              Hapus NRP{" "}
              <span className="font-mono font-semibold">{selectedNrp}</span>
              {selectedName && <> ({selectedName})</>}?{" "}
              <b>Tindakan ini tidak dapat dibatalkan.</b>
            </p>
            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedNrp(null);
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
    </main>
  );
}

export default ManageNrpWhitelist;
