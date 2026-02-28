"use client";

import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

import HeaderSection from "@/components/commons/HeaderSection";
import Link from "next/link";

type CabinetRow = {
  id: number;
  name: string;
  status: "Aktif" | "Purnatugas";
  period: string;
  ketuaUmum: string;
  members: number;
};

const cabinetData: CabinetRow[] = Array.from({ length: 7 }).map((_, i) => ({
  id: i + 1,
  name: "Lorem Ipsum",
  status: i === 0 ? "Aktif" : "Purnatugas",
  period: "2025-2026",
  ketuaUmum: "Lorem Ipsum",
  members: 105,
}));

function ManageCabinet() {
  const handleDelete = (_id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kabinet "${name}"?`))
      return;
    // TODO: Call delete API
    console.info("Delete cabinet:", _id);
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-8 p-4 lg:p-10">
      {/* Header */}
      <HeaderSection
        title="Manage Kabinet"
        titleStyle="font-averia text-black"
        className="gap-0"
      />

      {/* Table */}
      <div className="w-full overflow-hidden rounded-2xl border border-gray-200">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="bg-[#F8E8EA]">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                Kabinet
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                Periode
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                Ketua Umum
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
            {cabinetData.map((cabinet) => (
              <tr
                key={cabinet.id}
                className="border-t border-gray-100 transition-colors hover:bg-gray-50/60"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {cabinet.name}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      cabinet.status === "Aktif"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {cabinet.status}
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        cabinet.status === "Aktif"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{cabinet.period}</td>
                <td className="px-6 py-4 text-gray-600">{cabinet.ketuaUmum}</td>
                <td className="px-6 py-4 text-gray-600">{cabinet.members}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/admin/cabinet/${cabinet.id}/edit`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                    >
                      <HiOutlinePencilAlt size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(cabinet.id, cabinet.name)}
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
          Showing {cabinetData.length} of 12 in current selection
        </p>

        <div className="flex items-center gap-2">
          <button className="rounded-md border-2 border-gray-300 bg-white px-2 py-1 text-sm transition hover:bg-gray-100 disabled:opacity-40">
            &lt;
          </button>
          <button className="rounded-md border-2 border-gray-300 bg-primaryPink px-2 py-1 text-sm text-white">
            1
          </button>
          <button className="rounded-md border-2 border-gray-300 bg-white px-2 py-1 text-sm transition hover:bg-gray-100">
            2
          </button>
          <button className="rounded-md border-2 border-gray-300 bg-white px-2 py-1 text-sm transition hover:bg-gray-100">
            3
          </button>
          <button className="rounded-md border-2 border-gray-300 bg-white px-2 py-1 text-sm transition hover:bg-gray-100">
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
    </div>
  );
}

export default ManageCabinet;
