import api from "@/lib/axios";
import { GetMemberByDeptIdPaginated } from "@/services/admin/GetMemberByIdPaginated";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { DepartmentType } from "@/types/data/DepartmentType";
import { MemberType } from "@/types/data/MemberType";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import RenderPagination from "../_news/RenderPagination";
import HeaderSection from "../commons/HeaderSection";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

function ManageAnggota() {
  // handle dept drop down
  const [depts, setDepts] = useState<DepartmentType[]>([]);
  const [loadingDd, setLoadingDd] = useState(true);
  const [errDd, setErrDd] = useState(false);
  const [currPg, setCurrPg] = useState(1);
  const [totalPg, setTotalPg] = useState(1);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDeptName, setSelectedDeptName] = useState(
    "dari semua departemen",
  );
  const limitDd = 5;

  const fetchAllDeptName = async () => {
    setLoadingDd(true);
    setErrDd(false);

    try {
      const json = await GetAllDepts(currPg, limitDd);
      setDepts(json.data);
      setTotalPg(json.meta.total_page ?? 1);
    } catch (err) {
      console.error(err);
      setErrDd(true);
    } finally {
      setLoadingDd(false);
    }
  };

  useEffect(() => {
    fetchAllDeptName();
  }, [currPg]);

  // handle fetching members data
  const [loadingMain, setLoadingMain] = useState(true);
  const [errMain, setErrMain] = useState(false);
  const [currMemberPg, setCurrMemberPg] = useState(1);
  const [totalMemberPage, setTotalMemberPage] = useState(0);
  const [totalDataMembers, setTotalDataMembers] = useState(0);
  const limitMembers = 10;
  const [members, setMembers] = useState<MemberType[]>([]);
  const [showDd, setShowDd] = useState(false);
  const fetchAnggotaByDept = async () => {
    setLoadingMain(true);
    setErrMain(false);
    try {
      const json = await GetMemberByDeptIdPaginated(
        currMemberPg,
        limitMembers,
        selectedDept,
      );
      setMembers(json.data);
      setTotalMemberPage(json.meta.total_page ?? 1);
      setTotalDataMembers(json.meta.total_data ?? 1);
    } catch (err) {
      console.error(err);
      setErrMain(true);
    } finally {
      setLoadingMain(false);
    }
  };

  useEffect(() => {
    fetchAnggotaByDept();
  }, [currMemberPg, selectedDept]);

  // handle delete anggota
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!selectedMemberId) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await api.delete(`/member/${selectedMemberId}`);

      // close modal
      setShowDeleteModal(false);
      setSelectedMemberId(null);

      // refetch member list
      fetchAnggotaByDept();
    } catch (err) {
      console.error(err);
      setDeleteError("Gagal menghapus anggota");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full lg:p-10 p-4 gap-8 ">
      <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <HeaderSection
            title={"Manage Anggota"}
            sub={"Atur struktur anggota pada tiap departemen"}
            subStyle="text-black font-libertine"
          />
        </div>
        <div className="flex items-center justify-center gap-6">
          <div className="relative w-36 font-libertine">
            <button
              onClick={() => setShowDd((p) => !p)}
              className="flex w-full px-3 py-2 border rounded-lg bg-slate-100 text-left items-center justify-between text-sm"
            >
              {selectedDept
                ? depts.find((d) => d.id === selectedDept)?.name ??
                  "Pilih Departemen"
                : "Pilih Departemen"}
              <FaChevronUp
                className={`
                  ${showDd ? "rotate-0" : "rotate-180"}
                  duration-300 transition-all ease-in-out
                `}
              />
            </button>

            {/* Dropdown */}
            {showDd && (
              <div className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg overflow-hidden max-lg:text-sm">
                {/* List */}
                <div className="max-h-56 overflow-y-auto">
                  {loadingDd && (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      Loading...
                    </p>
                  )}

                  {errDd && (
                    <p className="px-3 py-2 text-sm text-red-500">
                      Error loading data
                    </p>
                  )}

                  {!loadingDd &&
                    !errDd &&
                    depts.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setSelectedDept(d.id ?? "");
                          setSelectedDeptName(d.name ?? "");
                          setShowDd(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
                      >
                        {d.name}
                      </button>
                    ))}

                  {!loadingDd && !errDd && depts.length === 0 && (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      Tidak ditemukan
                    </p>
                  )}
                </div>

                {/* Pagination of Dd */}
                {totalPg > 1 && (
                  <div className="flex justify-between items-center px-3 py-2 border-t text-sm">
                    <button
                      disabled={currPg === 1}
                      onClick={() => setCurrPg((p) => p - 1)}
                      className="disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span>
                      {currPg} / {totalPg}
                    </span>
                    <button
                      disabled={currPg === totalPg}
                      onClick={() => setCurrPg((p) => p + 1)}
                      className="disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90  active:opacity-80 duration-300 transition-all max-lg:text-sm">
            <Link href={"/admin/anggota/add"}>+ Add Member</Link>
          </button>
        </div>
      </div>
      <div className="lg:mt-6 mt-2 w-full flex flex-col gap-4">
        <h1 className="lg:text-lg mb-4 font-lora">
          Menampilkan Anggota Departemen {selectedDeptName}
        </h1>

        {loadingMain && (
          <div className="w-full flex items-center justify-center">
            <SkeletonPleaseWait />
          </div>
        )}
        {!loadingMain && !errMain && members.length > 0 && (
          <div className=" flex flex-col gap-4 w-full rounded-3xl overflow-auto border border-gray-200">
            <table className="w-full min-w-[500px] border-collapse overflow-auto">
              <thead className="bg-[#F8E8EA] text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{m.name}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {m.role?.name}
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/anggota/${m.id}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                        >
                          <HiOutlinePencilAlt size={16} />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedMemberId(m.id);
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
        )}
      </div>
      <div className="flex w-full items-center lg:justify-between flex-col lg:flex-row gap-4">
        <p className="font-libertine text-sm text-primaryPink">
          Showing {Math.min(currPg * limitMembers, totalDataMembers)} of{" "}
          {totalDataMembers} in current selection
        </p>

        {/* Pagination controls */}
        <div className="flex items-center gap-3">
          {/* Prev page */}
          <button
            disabled={currMemberPg === 1 || loadingMain}
            onClick={() => setCurrMemberPg((p) => p - 1)}
            className={`p-2 rounded-md border disabled:opacity-40 
            hover:bg-gray-100 transition flex items-center gap-4
            ${currMemberPg === 1 || loadingMain ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {/* icon kiri */}
            &lt;
          </button>

          {/* Page numbers */}
          <RenderPagination
            currPage={currMemberPg}
            totPage={totalMemberPage}
            onChange={setCurrMemberPg}
          />

          {/* Next page */}
          <button
            disabled={currMemberPg === totalMemberPage || loadingMain}
            onClick={() => setCurrMemberPg((p) => p + 1)}
            className={`p-2 rounded-md border disabled:opacity-40 
            hover:bg-gray-100 transition flex items-center gap-4
            ${currMemberPg === totalMemberPage || loadingMain ? "cursor-not-allowed" : "cursor-pointer"}`}
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
              Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>

            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedMemberId(null);
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

export default ManageAnggota;
