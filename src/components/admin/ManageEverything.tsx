"use client";

import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { GetManageCabinet } from "@/services/admin/GetManageCabinets";
import { GetManageEvents } from "@/services/admin/GetManageEvent";
import { GetManageNews } from "@/services/admin/GetManageNews";
import { GetMemberByDeptIdPaginated } from "@/services/admin/GetMemberByIdPaginated";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import type { ManageCabinet } from "@/types/admin/ManageCabinetType";
import { ManageEventsType } from "@/types/admin/ManageEvents";
import { ManageGalleryType } from "@/types/admin/ManageGallery";
import { ManageNewsType } from "@/types/admin/ManageNewsType";
import { ApiResponse } from "@/types/commons/apiResponse";
import { DepartmentType } from "@/types/data/DepartmentType";
import { GlobalSettings } from "@/types/data/GlobalSettings";
import { MemberType } from "@/types/data/MemberType";
import { ProgendaType } from "@/types/data/ProgendaType";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaChevronUp } from "react-icons/fa";
import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import { IoIosHelpCircle } from "react-icons/io";
import Typography from "../Typography";
import RenderPagination from "../_news/RenderPagination";
import HeaderSection from "../commons/HeaderSection";
import ImageFallback from "../commons/ImageFallback";
import MarkdownRenderer from "../commons/MarkdownRenderer";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";
import CabinetPreviewDialog from "./CabinetPreviewDialog";
import {
  HelpModal,
  ManageCabinetHelp,
  ManageDepartmentHelp,
} from "./HelpModal";
import WebStats from "./WebStats";

// SEO: manage anggota, Manage Anggota, ManageAggota
export function ManageAnggota() {
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
  const [limitMembers, setLimitMembers] = useState(10);
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
  }, [currMemberPg, selectedDept, limitMembers]);

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
        <small className="mt-4 text-yellow-700 bg-yellow-200 px-2">
          ℹ️ NOTICE: Harap memastikan tiap departemen memiliki anggota sebagai
          kepala departemen lalu tambahkan informasinya di edit departemen.
        </small>
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
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 font-libertine">
              Show
            </label>
            <select
              value={limitMembers}
              onChange={(e) => {
                setLimitMembers(Number(e.target.value));
                setCurrMemberPg(1);
              }}
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
            href="/cp/anggota/add"
            className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm"
          >
            + Add Member
          </Link>
        </div>
      </div>
      <div className="lg:mt-6 mt-2 w-full flex flex-col gap-4">
        <h1 className="lg:text-lg mb-4 font-lora">
          Menampilkan Anggota Departemen {selectedDeptName}
        </h1>
        <div className=" flex flex-col gap-4 w-full rounded-3xl overflow-auto border border-gray-200">
          <table className="w-full min-w-[500px] border-collapse overflow-auto">
            <thead className="bg-[#F8E8EA] text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">
                  Role
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            {!loadingMain && !errMain && members.length > 0 && (
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
                          href={`/cp/anggota/${m.id}/edit`}
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
            )}
          </table>
          {loadingMain && (
            <div className="w-full py-6 flex items-center justify-center">
              <SkeletonPleaseWait />
            </div>
          )}
          {members.length === 0 && !loadingMain && (
            <div className="w-full py-6 flex items-center justify-center text-gray-300">
              👻 Daftar anggota kosong 👻
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full items-center lg:justify-between flex-col lg:flex-row gap-4">
        <p className="font-libertine text-sm text-primaryPink">
          Showing{" "}
          {Math.min((currMemberPg - 1) * limitMembers + 1, totalDataMembers)} to{" "}
          {Math.min(currMemberPg * limitMembers, totalDataMembers)} of{" "}
          {totalDataMembers} in current selection
        </p>

        <RenderPagination
          currPage={currMemberPg}
          totPage={totalMemberPage}
          onChange={setCurrMemberPg}
        />
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

// SEO: manage cabinet, Manage Cabinet, ManageCabine
type CabinetRow = ManageCabinet; // type sebaiknya dipindah ke folder types/

// const cabinetData: CabinetRow[]; data sebaiknya diganti dengan useState untuk data fetching

// usahakan kasih komen biar jelas bagian2nya
export function ManageCabinet() {
  // handle fetch data
  const [cabinets, setCabinets] = useState<CabinetRow[]>([]);
  const [activeCabinets, setActiveCabinets] = useState<CabinetRow[]>([]);
  const [currPg, setCurrPg] = useState(1);
  const [limCabinets, setLimCabinets] = useState(5);
  const [totData, setTotData] = useState(0);
  const [_errData, setErrData] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [totPage, setTotPg] = useState(1);
  const [openHelp, setOpenHelp] = useState(false);

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
    const isModalOpen = showDeleteModal || !!selectedPreviewId || openHelp;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeleteModal, openHelp]);

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
            <Link href={"/cp/cabinet/add"}>+ Add Cabinet</Link>
          </button>

          {/* Info */}
          <IoIosHelpCircle
            className="w-6 h-6 text-blue-400 hover:opacity-80 transition-all duration-300 hover:cursor-pointer"
            title="help"
            onClick={() => setOpenHelp(true)}
          />
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
                        href={`/cp/cabinet/${cabinet.id}/edit`}
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
                        href={`/cp/cabinet/${cabinet.id}/edit`}
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

        {activeCabinets.length === 0 && cabinets.length === 0 && !loadData && (
          <div className="w-full py-6 flex items-center justify-center text-gray-700">
            👻 Daftar kabinet Kosong 👻
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

      {openHelp && (
        <HelpModal onClose={setOpenHelp}>
          <ManageCabinetHelp
            setCurrPg={setCurrPg}
            setLimCabinets={setLimCabinets}
            currPg={currPg}
            totPage={totPage}
            limCabinets={limCabinets}
          />
        </HelpModal>
      )}
    </div>
  );
}

// SEO: manage departemen, Manage Dept, ManageDepartemen
// type CabinetsData = {
//   id: UUID | string;
//   tagline: string;
// };

export function ManageDepartment() {
  // FETCH DATA STATE
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [limitDept, setLimitDept] = useState(5);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [memberCounts, setMemberCounts] = useState<{ [key: string]: number }>(
    {},
  );
  // DELETE MODAL STATE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedDeptName, setSelectedDeptName] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [openHelp, setOpenHelp] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(false);
    try {
      const json = await GetAllDepts(currPage, limitDept);

      // Sorting: Newest first (created_at) then by name
      const sorted = [...json.data].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

        if (dateB !== dateA) return dateB - dateA;
        return (a.name || "").localeCompare(b.name || "");
      });

      setDepartments(sorted);
      setTotalPage(json.meta.total_page ?? 1);
      setTotalData(json.meta.total_data ?? 0);

      // Fetch member counts for each department
      const counts: { [key: string]: number } = {};
      await Promise.all(
        json.data.map(async (dept) => {
          if (dept.id) {
            try {
              const res = await api.get(
                `/member?filter_by=department_id&filter=${dept.id}`,
              );
              counts[dept.id] = res.data.meta.total_data ?? 0;
            } catch (err) {
              console.error(`Gagal ambil count member dept ${dept.id}`, err);
              counts[dept.id] = 0;
            }
          }
        }),
      );
      setMemberCounts(counts);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [currPage, limitDept]);

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

  useEffect(() => {
    const isModalOpen = openHelp;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openHelp]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-8 p-4 lg:p-10">
      {/* Header */}
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between justify-center items-center">
        <HeaderSection
          title="Manage Department"
          titleStyle="font-averia text-black"
          className="gap-0"
          sub={"Atur data departemen di website"}
          subStyle="text-black font-libertine"
        />
        <small className="mt-4 text-yellow-700 bg-yellow-200 px-2">
          ℹ️ NOTICE: Harap menambah anggota sebagai ketua departemen setelah
          membuat departemen baru dan edit informasi kepala departemen di edit
          departemen.
        </small>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 font-libertine">
              Show
            </label>
            <select
              value={limitDept}
              onChange={(e) => {
                setLimitDept(Number(e.target.value));
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
            <Link href={"/cp/department/add"}>+ Add Department</Link>
          </button>
          {/* Info */}
          <IoIosHelpCircle
            className="w-6 h-6 text-blue-400 hover:opacity-80 transition-all duration-300 hover:cursor-pointer"
            title="help"
            onClick={() => setOpenHelp(true)}
          />
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
                      {dept.leader?.name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {memberCounts[dept.id as string] ?? 0} Members
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/cp/department/${dept.name}/edit`}
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
          Showing {Math.min((currPage - 1) * limitDept + 1, totalData)} to{" "}
          {Math.min(limitDept * currPage, totalData)} of {totalData} in current
          selection
        </p>
        <RenderPagination
          currPage={currPage}
          totPage={totalPage}
          onChange={setCurrPage}
        />
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
      {openHelp && (
        <HelpModal onClose={setOpenHelp}>
          <ManageDepartmentHelp />
        </HelpModal>
      )}
    </div>
  );
}

// SEO: manage event, Manage Event, ManageEvent
export function ManageEvent() {
  // handle data fetching all data needed
  const [loadingData, setLoadingData] = useState(false);
  const [_errMainData, setErrMainData] = useState(false);
  const [eventsData, setEventsData] = useState<ManageEventsType[]>([]);
  const [currPg, setCurrPg] = useState(1);
  const [totData, setTotData] = useState(1);
  const [totPg, setTotPg] = useState(1);
  const [limData, setLimData] = useState(5);
  const fetchAllEvents = async () => {
    setLoadingData(true);
    setErrMainData(false);
    try {
      const json = await GetManageEvents(currPg, limData);
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
  }, [currPg, limData]);

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
      <div className="flex w-full items-center lg:justify-between max-lg:flex-col gap-4">
        <HeaderSection
          title={"Manage Kegiatan"}
          sub={"Atur daftar kegiatan bulanan (What's On HIMASAKTA)"}
          subStyle="text-black font-libertine"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 font-libertine">
              Show
            </label>
            <select
              value={limData}
              onChange={(e) => {
                setLimData(Number(e.target.value));
                setCurrPg(1);
              }}
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
            href="/cp/kegiatan/add"
            className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm"
          >
            + Add Event
          </Link>
        </div>
      </div>

      {_errMainData && !loadingData && (
        <div className="flex w-full items-center justify-center py-20">
          <p className="text-red-500">
            Gagal memuat data departemen. Silakan coba lagi.
          </p>
        </div>
      )}

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
                        href={`/cp/kegiatan/${e.id}/edit`}
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
          Showing {Math.min((currPg - 1) * limData + 1, totData)} to{" "}
          {Math.min(currPg * limData, totData)} of {totData} in current
          selection
        </p>

        <RenderPagination
          currPage={currPg}
          totPage={totPg}
          onChange={setCurrPg}
        />
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

// SEO: manage galeri
export function ManageGallery() {
  const [galleryData, setGalleryData] = useState<ManageGalleryType[]>([]);
  const [loadData, setLoadData] = useState(false);
  const [totData, setTotData] = useState(1);
  const [totPg, setTotPg] = useState(1);
  const [currPg, setCurrPg] = useState(1);
  const [limGallery, setLimGallery] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    caption: string;
  } | null>(null);

  const fetchGalleryData = async () => {
    setLoadData(true);
    try {
      const json = await api.get<ApiResponse<ManageGalleryType[]>>(
        `/gallery?page=${currPg}&limit=${limGallery}`,
      );
      const data = json.data;
      const sortedData = [...data.data].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
      setGalleryData(sortedData);
      setTotData(data.meta.total_data ?? 1);
      setTotPg(data.meta.total_page ?? 1);
    } catch (err) {
      console.error(err);
      alert(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
    } finally {
      setLoadData(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, [currPg, limGallery]);

  const handleDeleteGallery = async () => {
    if (!selectedGalleryId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete(`/gallery/${selectedGalleryId}`);
      setShowDeleteModal(false);
      setSelectedGalleryId(null);
      fetchGalleryData();
    } catch (err) {
      console.error(err);
      setDeleteError("Gagal menghapus gambar");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const isModalOpen = showDeleteModal || !!previewImage;
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeleteModal, previewImage]);

  const isDeleteable = (gallery: ManageGalleryType) => {
    return (
      (!gallery.department_id || gallery.department_id === "") &&
      (!gallery.cabinet_id || gallery.cabinet_id === "") &&
      (!gallery.progenda_id || gallery.progenda_id === "")
    );
  };

  if (loadData) {
    return (
      <div className="p-10 w-full min-h-screen flex items-center justify-center">
        <SkeletonPleaseWait />
      </div>
    );
  }

  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-10 max-w-7xl mx-auto max-lg:flex-col">
        <div>
          <HeaderSection
            title="Manage Gallery"
            titleStyle="font-averia text-black text-5xl"
            className="gap-0"
          />
          <Typography
            variant="p"
            className="text-gray-600 mt-2 font-averia italic"
          >
            Atur semua informasi media gambar dalam website
          </Typography>
          <small className="mt-4 text-red-600 bg-red-200 px-2">
            ⚠️ WARNING: Ada data yang tidak dapat dihapus karena tertaut dengan
            data lain.
          </small>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 font-libertine">
              Show
            </label>
            <select
              value={limGallery}
              onChange={(e) => {
                setLimGallery(Number(e.target.value));
                setCurrPg(1);
              }}
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
            href="/cp/gallery/add"
            className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm"
          >
            + Add Gallery
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-7xl mx-auto">
        {galleryData.map((gallery) => (
          <div
            key={gallery.id}
            className="flex flex-col rounded-[24px] overflow-hidden shadow-lg transition-transform hover:scale-[1.02] duration-300 border border-gray-200"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "53/40" }}
            >
              <ImageFallback
                src={gallery.image_url}
                alt={gallery.caption}
                isFill
                imgStyle="w-full h-full object-cover rounded-t-[24px]"
              />
            </div>
            <div className="p-6 flex flex-col flex-1 bg-[#EBEFF4]">
              <Typography
                variant="h6"
                className="font-bold text-[18px] leading-snug font-libertine text-black mb-4"
              >
                {gallery.caption}
              </Typography>
              <div className="flex justify-between items-center mt-auto">
                <Typography
                  variant="p"
                  className="text-gray-800 text-[13px] font-medium font-libertine"
                >
                  Updated at:
                  <br />
                  {new Date(gallery.updated_at).toLocaleString("id-ID")}
                </Typography>
                <div className="flex gap-[8px]">
                  {isDeleteable(gallery) ? (
                    <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                      Deleteable
                    </span>
                  ) : (
                    <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
                      Undeleteable
                    </span>
                  )}
                  <Link
                    href={`/cp/gallery/${gallery.id}/edit`}
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlinePencilAlt size={16} />
                  </Link>
                  <button
                    onClick={() =>
                      setPreviewImage({
                        url: gallery.image_url,
                        caption: gallery.caption,
                      })
                    }
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlineEye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedGalleryId(gallery.id as string);
                      setShowDeleteModal(true);
                    }}
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row mt-8">
        <p className="font-libertine text-sm text-primaryPink">
          Showing {Math.min((currPg - 1) * limGallery + 1, totData)} to{" "}
          {Math.min(currPg * limGallery, totData)} of {totData} in current
          selection
        </p>
        <RenderPagination
          currPage={currPg}
          totPage={totPg}
          onChange={setCurrPg}
        />
      </div>

      {/* Image preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.url}
              alt={previewImage.caption}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white text-center text-sm font-medium bg-black/40 px-4 py-2 rounded-lg">
              {previewImage.caption}
            </p>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all text-gray-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Hapus Gambar</h2>
            <p className="text-sm text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus gambar ini?{" "}
              <b>Tindakan ini tidak dapat dibatalkan.</b>
            </p>
            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedGalleryId(null);
                }}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteGallery}
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

// SEO: manage news/berita

export function ManageNews() {
  const [newsData, setNewsData] = useState<ManageNewsType[]>([]);
  const [currPg, setCurrPg] = useState(1);
  const [totPage, setTotPage] = useState(1);
  const [totData, setTotData] = useState(0);
  const [loadData, setLoadData] = useState(false);
  const [limNews, setLimNews] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Preview state
  const [previewData, setPreviewData] = useState<{
    title: string;
    content: string;
    thumbnail?: string;
    published_at: string;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    const fetchManageNews = async () => {
      setLoadData(true);
      try {
        const json = await GetManageNews(currPg, limNews);
        setNewsData(json.data);
        setTotData(json.meta.total_data ?? 1);
        setTotPage(json.meta.total_page ?? 1);
      } catch (err) {
        console.error(err);
        alert(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
      } finally {
        setLoadData(false);
      }
    };
    fetchManageNews();
  }, [currPg, limNews]);

  const handleDelete = async () => {
    if (!selectedNewsId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete(`/news/${selectedNewsId}`);
      setShowDeleteModal(false);
      setSelectedNewsId(null);
      const json = await GetManageNews(currPg, limNews);
      setNewsData(json.data);
      setTotData(json.meta.total_data ?? 1);
      setTotPage(json.meta.total_page ?? 1);
    } catch (err) {
      console.error(err);
      setDeleteError(`Gagal menghapus berita: ${getApiErrorMessage(err)}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePreview = async (slug: string) => {
    setPreviewLoading(true);
    setPreviewData(null);
    try {
      const resp = await api.get(`/news/s/${slug}`);
      const d = resp.data?.data ?? resp.data;
      setPreviewData({
        title: d.title ?? "",
        content: d.content ?? d.body ?? "",
        thumbnail: d.thumbnail?.image_url ?? "",
        published_at: d.published_at ?? "",
      });
    } catch (err) {
      console.error(err);
      alert("Gagal memuat preview berita");
      setPreviewLoading(false);
      return;
    }
    setPreviewLoading(false);
  };

  useEffect(() => {
    const isModalOpen = showDeleteModal || !!previewData || previewLoading;
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeleteModal, previewData, previewLoading]);

  if (loadData) {
    return (
      <div className="p-10 w-full min-h-screen flex items-center justify-center">
        <SkeletonPleaseWait />
      </div>
    );
  }

  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-10 max-w-7xl mx-auto">
        <div className="flex items-center lg:justify-between gap-4 max-lg:flex-col w-full">
          <div>
            <HeaderSection
              title="Manage Posts"
              titleStyle="font-averia text-black text-5xl max-lg:text-3xl"
              className="gap-0"
            />
            <Typography
              variant="p"
              className="text-gray-600 mt-2 font-averia italic"
            >
              Atur publikasi berita di website
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 font-libertine">
                Show
              </label>
              <select
                value={limNews}
                onChange={(e) => {
                  setLimNews(Number(e.target.value));
                  setCurrPg(1);
                }}
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
              href="/cp/news/add"
              className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm"
            >
              + Add Post
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-7xl mx-auto">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="flex flex-col rounded-[24px] overflow-hidden shadow-sm transition-transform hover:scale-[1.02] duration-300 border border-gray-200"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "53/40" }}
            >
              <ImageFallback
                src={news.thumbnail?.image_url}
                alt={news.title}
                isFill
                imgStyle="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-1 bg-[#EBEFF4]">
              <Typography
                variant="h6"
                className="font-bold text-[18px] leading-snug font-libertine text-black mb-4"
              >
                {news.title}
              </Typography>
              <div className="flex justify-between items-center mt-auto">
                <Typography
                  variant="p"
                  className="text-gray-800 font-medium font-libertine text-[10px]"
                >
                  Published at:
                  <br />
                  {new Date(news.published_at).toLocaleString("id-ID")}
                </Typography>
                <div className="flex gap-[8px]">
                  <Link
                    href={`/cp/news/${news.id}/edit`}
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlinePencilAlt size={16} />
                  </Link>
                  <button
                    onClick={() => handlePreview(news.slug)}
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlineEye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNewsId(news.id as string);
                      setShowDeleteModal(true);
                    }}
                    className="bg-white w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm text-black hover:text-primaryPink hover:bg-pink-50 transition-all"
                  >
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row mt-8">
        <p className="font-libertine text-sm text-primaryPink">
          Showing {Math.min((currPg - 1) * limNews + 1, totData)} to{" "}
          {Math.min(currPg * limNews, totData)} of {totData} in current
          selection
        </p>
        <RenderPagination
          currPage={currPg}
          totPage={totPage}
          onChange={setCurrPg}
        />
      </div>

      {/* News preview modal */}
      {(previewData || previewLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setPreviewData(null);
            setPreviewLoading(false);
          }}
        >
          <div
            className="bg-white rounded-2xl w-[90%] max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {previewLoading ? (
              <div className="py-16 flex items-center justify-center">
                <SkeletonPleaseWait />
              </div>
            ) : (
              previewData && (
                <>
                  {previewData.thumbnail && (
                    <div className="relative w-full h-56 overflow-hidden rounded-t-2xl">
                      <img
                        src={previewData.thumbnail}
                        alt={previewData.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <h2 className="text-2xl font-bold font-averia mb-2">
                      {previewData.title}
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">
                      {new Date(previewData.published_at).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                    <div className="prose prose-sm max-w-none">
                      <MarkdownRenderer>{previewData.content}</MarkdownRenderer>
                    </div>
                  </div>
                </>
              )
            )}
            <div className="px-8 pb-6 flex justify-end">
              <button
                onClick={() => setPreviewData(null)}
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
              Apakah Anda yakin ingin menghapus berita ini?{" "}
              <b>Tindakan ini tidak dapat dibatalkan.</b>
            </p>
            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedNewsId(null);
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

// SEO: manage nrp whitelist
type NrpEntry = {
  id: string;
  Nrp: string;
  Name: string;
  created_at: string;
  updated_at: string;
};

export function ManageNrpWhitelist() {
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
            href="/cp/nrp-whitelist/add"
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
                        href={`/cp/nrp-whitelist/${entry.id}/edit`}
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

// SEO: manage progenda
type ProgendasTable = {
  id: string;
  name: string;
  created_at: string;
};

export function ManageProgenda() {
  const [limitProgenda, setLimitProgenda] = useState(5);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progendas, setProgendas] = useState<ProgendasTable[]>([]);
  const [selectedProgenda, setSelectedProgenda] = useState<string | null>(null);
  const [_selectedProgendaName, setSelectedProgendaName] = useState<
    string | null
  >(null);
  const [_errorPreview, setErrorPreview] = useState(false);
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
            <Link href={"/cp/progenda/add"}>+ Add Progenda</Link>
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
                          href={`/cp/progenda/${progenda.id}/edit`}
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
                    <h2 className="text-2xl font-bold font-averia mb-4">
                      {viewProgenda.name}
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">
                      {new Date(viewProgenda.created_at).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                    <div className="prose prose-sm max-w-none mb-4">
                      <HeaderSection title={viewProgenda.name} />
                      <MarkdownRenderer>
                        {viewProgenda.description}
                      </MarkdownRenderer>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <HeaderSection title={"Tujuan"} />
                      <MarkdownRenderer>{viewProgenda.goal}</MarkdownRenderer>
                    </div>
                    {/* Gallery Section di dalam Modal Preview */}
                    <div className="mt-8">
                      <h3 className="text-xl font-bold font-averia mb-4 border-b pb-2">
                        Gallery
                      </h3>
                      {viewProgenda.feeds && viewProgenda.feeds.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {viewProgenda.feeds.map((feed) => (
                            <div
                              key={feed.id}
                              className="aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                            >
                              <img
                                src={feed.image_url}
                                alt="Gallery feed"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-sm">
                          Tidak ada foto dalam galeri.
                        </p>
                      )}
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

// SEO: Dashboard
type Props = {
  usr: string;
  onLogout: () => void;
};

export function DashboardAdmin({ usr, onLogout }: Props) {
  return (
    <section className="flex flex-col gap-10 lg:p-10">
      <div className="flex flex-col gap-4">
        <HeaderSection title="Dashboard" />

        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Hi {usr} 👋</h1>

          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Logout
          </button>
        </div>

        <p>How are you today?</p>
        <p>Here I give you our website statistic</p>
        <WebStats />
      </div>
      <main className="flex flex-col gap-4 w-full lg:p-4">
        <h1 className="font-inter font-bold text-3xl lg:text-4xl text-center">
          Getting Started
        </h1>
        <ul className="list-none flex flex-col gap-4 w-full">
          <li className="flex flex-col gap-4 items-start mb-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-black"></span>
              <h1 className="font-inter font-bold text-xl lg:text-3xl">
                What is Administrator Page?
              </h1>
            </div>
            <p>
              <span className="font-bold">
                An Administrator page or section
              </span>{" "}
              in software design is a dedicated interface used by authorized
              users—such as administrators or system maintainers—to manage,
              control, and configure the content, data, and behavior of a
              software application. This section typically provides tools for
              creating, reading, updating, and deleting (CRUD) data stored in
              the system’s database. Administrators can manage users, roles,
              permissions, content entries, media assets, and system settings
              through this interface. In many systems, the administrator page
              functions as a Content Management System (CMS), allowing
              non-technical users to update application content without
              modifying the source code. In other cases, it may also act as a
              Database Management System (DBMS) at the application level,
              offering structured access to underlying data while enforcing
              validation, security, and access control. Overall, the
              administrator section plays a crucial role in maintaining the
              integrity, security, and scalability of the software by
              centralizing management tasks and restricting access to sensitive
              operations.
            </p>
            <p>
              <span className="font-bold">
                Halaman atau bagian administrator
              </span>{" "}
              dalam perancangan perangkat lunak merupakan antarmuka khusus yang
              digunakan oleh pengguna dengan hak akses tertentu, seperti
              administrator atau pengelola sistem, untuk mengelola, mengontrol,
              dan mengonfigurasi konten, data, serta perilaku dari sebuah
              aplikasi. Bagian ini umumnya menyediakan fitur untuk melakukan
              operasi Create, Read, Update, dan Delete (CRUD) terhadap data yang
              tersimpan di dalam basis data. Melalui halaman administrator,
              pengelola sistem dapat mengatur data pengguna, peran dan hak
              akses, konten aplikasi, media, serta pengaturan sistem lainnya.
              Dalam banyak aplikasi, halaman administrator berfungsi sebagai
              Content Management System (CMS), yang memungkinkan pembaruan
              konten dilakukan tanpa perlu mengubah kode program secara
              langsung. Selain itu, pada tingkat tertentu, halaman ini juga
              dapat berperan sebagai sistem manajemen basis data (DBMS) di level
              aplikasi, dengan menyediakan akses terstruktur terhadap data
              sekaligus menerapkan validasi, keamanan, dan pembatasan akses.
              Secara keseluruhan, halaman administrator memiliki peran penting
              dalam menjaga keamanan, konsistensi, dan skalabilitas perangkat
              lunak dengan memusatkan proses pengelolaan dan membatasi akses
              terhadap operasi yang bersifat sensitif.
            </p>
          </li>
          <li className="flex flex-col gap-4 items-start">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-black"></span>
              <h1 className="font-inter font-bold text-3xl">How to logout?</h1>
            </div>
            <p>You can log out in many different ways</p>
          </li>
        </ul>
      </main>
    </section>
  );
}

// SEO Global Setting

type FormValues = Omit<GlobalSettings, "SocialMedia"> & {
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  linktree: string;
};

// Let AI do the repetitive work
const SOCIAL_KEYS = [
  "instagram",
  "tiktok",
  "youtube",
  "linkedin",
  "linktree",
] as const;

export function GlobalSetting() {
  const [_data, setData] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [descVal, setDescVal] = useState("");
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const [initVal, setInitVal] = useState<FormValues | null>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const {
    register,
    reset,
    formState: { isSubmitting },
    handleSubmit,
    control,
  } = useForm<FormValues>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const json =
          await api.get<ApiResponse<GlobalSettings>>("/settings/web");
        const data = json.data.data;
        setData(data);
        const format: FormValues = {
          ExternalSOPLink: data.ExternalSOPLink || "",
          InternalSOPLink: data.InternalSOPLink || "",
          DeskripsiHimpunan: data.DeskripsiHimpunan || "",
          FotoHimpunan: data.FotoHimpunan,
          InMaintenance: data.InMaintenance,
          ...Object.fromEntries(
            SOCIAL_KEYS.map((key) => [key, data.SocialMedia?.[key] || ""]),
          ),
        } as FormValues;

        setInitVal(format);
        reset(format);
        setIsMaintenance(data.InMaintenance);
        setDescVal(data.DeskripsiHimpunan);
      } catch (err) {
        alert(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleResetForm = () => {
    if (!initVal) return;
    reset({
      ExternalSOPLink: initVal.ExternalSOPLink || "",
      InternalSOPLink: initVal.InternalSOPLink || "",
      DeskripsiHimpunan: initVal.DeskripsiHimpunan || "",
      FotoHimpunan: initVal.FotoHimpunan,
      instagram: initVal.instagram || "",
      tiktok: initVal.tiktok || "",
      youtube: initVal.youtube || "",
      linkedin: initVal.linkedin || "",
      linktree: initVal.linktree || "",
      InMaintenance: initVal.InMaintenance,
    });
    setDescVal(initVal.DeskripsiHimpunan);
    setIsMaintenance(initVal.InMaintenance);
  };

  const handleEmptyReset = () => {
    const emptyValues: FormValues = {
      ExternalSOPLink: "",
      InternalSOPLink: "",
      DeskripsiHimpunan: "",
      FotoHimpunan: "",
      InMaintenance: true,
      ...Object.fromEntries(SOCIAL_KEYS.map((key) => [key, ""])),
    } as FormValues;

    reset(emptyValues);
    setDescVal("");
    setIsMaintenance(true);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: GlobalSettings = {
        ExternalSOPLink: values.ExternalSOPLink,
        InternalSOPLink: values.InternalSOPLink,
        DeskripsiHimpunan: values.DeskripsiHimpunan,
        FotoHimpunan: values.FotoHimpunan,
        InMaintenance: isMaintenance,

        SocialMedia: Object.fromEntries(
          SOCIAL_KEYS.map((key) => [key, values[key]]),
        ) as GlobalSettings["SocialMedia"],
      };

      await api.put("/settings/web", payload);

      alert("Berhasil menyimpan pengaturan");
    } catch (err) {
      alert(`Gagal menyimpan: ${getApiErrorMessage(err)}`);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full flex-col items-center justify-center min-h-screen">
        <SkeletonPleaseWait />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-8 p-4 lg:p-10">
      <div className="flex w-full items-center justify-between gap-4 max-lg:flex-col">
        {/* Header */}
        <HeaderSection
          title="Manage Kabinet"
          titleStyle="font-averia text-black max-lg:text-3xl"
          className="gap-0"
          sub="Atur informasi tiap kabinet"
          subStyle="font-libertine text-black"
        />
        <div className="flex items-center gap-4 max-lg:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEmptyReset}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-lg border bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
            >
              Empty
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primaryPink text-white  rounded-lg font-semibold shadow-lg shadow-pink-200 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              form="main-form"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
      <form id="main-form" onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex gap-4 flex-col">
          <div className="w-full">
            <label className="mb-2 block text-[15px] font-semibold">
              Deskripsi Himpuan
            </label>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#f8fafc]">
              <Controller
                name="DeskripsiHimpunan"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    ref={(el) => {
                      field.ref(el);
                      descRef.current = el;
                    }}
                    value={descVal}
                    onChange={(e) => {
                      setDescVal(e.target.value);
                      field.onChange(e.target.value);
                    }}
                    className="w-full min-h-[200px] bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 focus:outline-none"
                    placeholder="Tulis deskripsi himpunan di sini..."
                  />
                )}
              />
            </div>
          </div>
          <div className="w-full flex max-lg:flex-col">
            <div className="w-full">
              <label className="mb-2 block text-[15px] font-semibold">
                Internal SOP Link
              </label>
              <input
                {...register("InternalSOPLink")}
                className="w-[90%] max-lg:w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                placeholder="https://"
              />
            </div>
            <div className="w-full">
              <label className="mb-2 block text-[15px] font-semibold">
                External SOP Link
              </label>
              <input
                {...register("ExternalSOPLink")}
                className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                placeholder="https://"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="mb-2 block text-[15px] font-semibold">
              Foto Himpunan (dari web repositori)
            </label>
            <input
              {...register("FotoHimpunan")}
              className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
              placeholder="/images/..."
            />
          </div>
          <div className="w-full">
            <label className="mb-2 block text-[15px] font-semibold">
              Web Status
            </label>
            {/* Status Aktif */}
            <div className="flex gap-4 max-lg:flex-col">
              <button
                type="button"
                onClick={() => setIsMaintenance(true)}
                className={`flex-1 py-3 border rounded-xl ${isMaintenance ? "bg-red-50 border-red-500" : ""}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${isMaintenance ? "bg-red-500" : "bg-gray-300"}`}
                  />
                  Maintenance
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsMaintenance(false)}
                className={`flex-1 py-3 border rounded-xl ${!isMaintenance ? "bg-green-50 border-green-500" : ""}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${!isMaintenance ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  Not Maintenance
                </div>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOCIAL_KEYS.map((key) => (
              <div key={key}>
                <label className="mb-2 block text-[15px] font-semibold capitalize">
                  {key}
                </label>

                <input
                  {...register(key)}
                  className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  placeholder={`https://${key}.com/...`}
                />
              </div>
            ))}
          </div>
        </div>
      </form>
      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={handleEmptyReset}
          disabled={isSubmitting}
          className="px-4 py-3 rounded-lg border bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
        >
          Empty
        </button>
        <button
          type="button"
          onClick={handleResetForm}
          disabled={isSubmitting}
          className="px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-4 py-3 bg-primaryPink text-white  rounded-lg font-semibold shadow-lg shadow-pink-200 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          form="main-form"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
