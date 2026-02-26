import Link from "next/link";
import HeaderSection from "../commons/HeaderSection";
import { useEffect, useState } from "react";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { DepartmentType } from "@/types/data/DepartmentType";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";
import { GetMemberByDeptId } from "@/services/departments/GetMemberByDeptId";
import { GetMemberByDeptIdPaginated } from "@/services/admin/GetMemberByIdPaginated";
import { MemberType } from "@/types/data/MemberType";
import RenderPagination from "../_news/RenderPagination";
import { FaChevronUp } from "react-icons/fa";

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
  const [search, setSearch] = useState("");
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
  }, [currPg, search]);

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
              <div className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
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
          <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90  active:opacity-80 duration-300 transition-all">
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
          <div className=" flex flex-col gap-4 w-full rounded-3xl overflow-hidden border border-gray-200">
            <table className="w-full min-w-max border-collapse">
              <thead className="bg-gray-100">
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
                      {m.role.name}
                    </td>
                    <td className="px-4 py-3">{m.role?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="flex w-full items-center lg:justify-between flex-col lg:flex-row gap-4">
        <p className="text-md font-libertine">
          Shwoing {Math.min(limitMembers * currMemberPg, totalDataMembers)} of{" "}
          {totalDataMembers} data.
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
    </div>
  );
}

export default ManageAnggota;
