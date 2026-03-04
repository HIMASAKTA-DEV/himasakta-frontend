"use client";

import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

import RenderPagination from "@/components/_news/RenderPagination";
import HeaderSection from "@/components/commons/HeaderSection";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { DepartmentType } from "@/types/data/DepartmentType";
import Link from "next/link";

function ManageDepartment() {
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const limit = 7;

  const fetchDepartments = async () => {
    setLoading(true);
    setError(false);
    try {
      const json = await GetAllDepts(currPage, limit);
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

  const handleDelete = (id: string | undefined, name: string | undefined) => {
    if (!id) return;
    if (!confirm(`Apakah Anda yakin ingin menghapus departemen "${name}"?`))
      return;
    // TODO: Call delete API
    console.info("Delete department:", id);
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
      </div>

      {/* Table */}
      {loading && (
        <div className="flex w-full items-center justify-center py-20">
          <SkeletonPleaseWait />
        </div>
      )}

      {error && !loading && (
        <div className="flex w-full items-center justify-center py-20">
          <p className="text-red-500">
            Gagal memuat data departemen. Silakan coba lagi.
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="w-full overflow-hidden rounded-2xl border border-gray-200">
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
                            href={`/admin/department/${dept.id}/edit`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                          >
                            <HiOutlinePencilAlt size={16} />
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(dept.id as string, dept.name)
                            }
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
            </table>
          </div>

          {/* Footer: Showing X of Y + Pagination */}
          <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
            <p className="font-libertine text-sm text-primaryPink">
              Showing {Math.min(limit * currPage, totalData)} of {totalData} in
              current selection
            </p>

            {totalPage > 1 && (
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
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ManageDepartment;
