"use client";

import { useEffect, useState } from "react";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

import RenderPagination from "@/components/_news/RenderPagination";
import HeaderSection from "@/components/commons/HeaderSection";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import api from "@/lib/axios";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { DepartmentType } from "@/types/data/DepartmentType";
import Link from "next/link";

// type CabinetsData = {
//   id: UUID | string;
//   tagline: string;
// };

function ManageDepartment() {
  // FETCH DATA STATE
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const LIMIT_DEPT = 7;
  // DELETE MODAL STATE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedDeptName, setSelectedDeptName] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(false);
    try {
      const json = await GetAllDepts(currPage, LIMIT_DEPT);
      setDepartments(json.data);
      setTotalPage(json.meta.total_page ?? 1);
      setTotalData(json.meta.total_data ?? 0);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [currPage]);

  // HANDLE DELETE MODAL
  const handleDelete = async () => {
    if (!selectedDeptId) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await api.delete(`/department/${selectedDeptId}`);

      setShowDeleteModal(false);
      setSelectedDeptId(null);
      setSelectedDeptName(null);

      fetchDepartments(); // refetch data
    } catch (err) {
      console.error(err);
      setDeleteError("Gagal menghapus departemen");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-8 p-4 lg:p-10">
      {/* Header */}
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <HeaderSection
          title="Manage Department"
          titleStyle="font-averia text-black"
          className="gap-0"
          sub={"Atur data departemen di website"}
          subStyle="text-black font-libertine"
        />
        <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90  active:opacity-80 duration-300 transition-all max-lg:text-sm">
          <Link href={"/admin/department/add"}>+ Add Department</Link>
        </button>
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
                Departemen
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                Kepala Departemen
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                Members
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          {!loading && !error && (
            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Belum ada data departemen.
                  </td>
                </tr>
              ) : (
                departments.map((dept, idx) => (
                  <tr
                    key={dept.id ?? idx}
                    className="border-t border-gray-100 transition-colors hover:bg-gray-50/60"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {dept.name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {/* Kepala departemen — not available in current type, show placeholder */}
                      Fitur belum tersedia
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {/* Members count — not in current type */}—
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/department/${dept.name}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                        >
                          <HiOutlinePencilAlt size={16} />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedDeptId(dept.id ?? null);
                            setSelectedDeptName(dept.name ?? null);
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
        {departments.length === 0 && !loading && (
          <div className="w-full py-6 flex items-center justify-center text-gray-700">
            Daftar Kegiatan Kosong
          </div>
        )}
      </div>

      {/* Footer: Showing X of Y + Pagination */}
      <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
        <p className="font-libertine text-sm text-primaryPink">
          Showing {Math.min(LIMIT_DEPT * currPage, totalData)} of {totalData} in
          current selection
        </p>
        <div className="flex items-center gap-3">
          <button
            disabled={currPage === 1 || loading}
            onClick={() => setCurrPage((p) => p - 1)}
            className={`rounded-md border border-gray-300 p-2 text-sm transition hover:bg-gray-100 disabled:opacity-40 ${
              currPage === 1 || loading
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            &lt;
          </button>

          <RenderPagination
            currPage={currPage}
            totPage={totalPage}
            onChange={setCurrPage}
          />

          <button
            disabled={currPage === totalPage || loading}
            onClick={() => setCurrPage((p) => p + 1)}
            className={`rounded-md border border-gray-300 p-2 text-sm transition hover:bg-gray-100 disabled:opacity-40 ${
              currPage === totalPage || loading
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Hapus Departemen</h2>

            <p className="text-sm text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus departemen
              <span className="font-semibold"> "{selectedDeptName}"</span>?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDeptId(null);
                  setSelectedDeptName(null);
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

export default ManageDepartment;
