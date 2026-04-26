"use client";

import api from "@/lib/axios";
import clsxm from "@/lib/clsxm";
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
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaChevronUp } from "react-icons/fa";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePencilAlt,
  HiOutlinePlus,
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
  ManageAnggotaHelp,
  ManageCabinetHelp,
  ManageDepartmentHelp,
  ManageEventHelp,
  ManageGalleryHelp,
  ManageGlobalSettingHelp,
  ManageNRPWhitelistHelp,
  ManageNewsHelp,
  ManageProgendaHelp,
} from "./HelpModal";
import MediaSelector from "./MediaSelector";
import WebStats from "./WebStats";

/* ================= REUSABLE DELETE MODAL ================= */
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  loading: boolean;
  error?: string | null;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  loading,
  error,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-2 font-averia text-gray-800">
          {title} <span className="text-primaryPink">"{itemName}"</span>
        </h2>

        <p className="text-sm text-gray-600 mb-4 font-libertine leading-relaxed">
          Apakah Anda yakin ingin menghapus data ini?{" "}
          <b className="text-red-500">Tindakan ini tidak dapat dibatalkan.</b>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
            <p className="text-xs text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 font-libertine mt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all duration-200 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [openHelp, setOpenHelp] = useState(false);
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
  const [selectedMemberName, setSelectedMemberName] = useState("");
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
      setDeleteError(`Gagal menghapus anggota: ${getApiErrorMessage(err)}`);
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
            subStyle="text-gray-600 mt-2 font-averia italic text-lg"
          />
        </div>
        <div className="flex items-center justify-center gap-6 portrait:flex-col">
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
                      👻Belum ada departemen👻
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
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center max-lg:flex-col gap-2">
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
              className="px-4 py-4 lg:py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm"
            >
              + Add Member
            </Link>
            <IoIosHelpCircle
              className="w-6 h-6 text-blue-400 hover:opacity-80 transition-all duration-300 hover:cursor-pointer"
              title="help"
              onClick={() => setOpenHelp(true)}
            />
          </div>
        </div>
      </div>
      <small className="mt-4 text-yellow-700 bg-yellow-200 px-2">
        ℹ️ NOTICE: Harap memastikan tiap departemen memiliki anggota sebagai
        kepala departemen lalu tambahkan informasinya di edit departemen.
      </small>
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
                        <button
                          type="button"
                          onClick={() => {
                            if (m.department?.slug) {
                              window.open(
                                `/departments/${m.department.slug}`,
                                "_blank",
                              );
                            } else {
                              toast.error(
                                "Anggota ini belum tertaut dengan departemen apapun",
                              );
                            }
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-pink-50 hover:text-primaryPink"
                        >
                          <HiOutlineEye size={18} />
                        </button>
                        <Link
                          href={`/cp/anggota/${m.id}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                        >
                          <HiOutlinePencilAlt size={16} />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedMemberId(m.id);
                            setSelectedMemberName(m.name);
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
              👻Daftar anggota kosong👻
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
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMemberId(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Anggota"
        itemName={selectedMemberName}
        loading={deleteLoading}
        error={deleteError}
      />
      {openHelp && (
        <HelpModal onClose={setOpenHelp}>
          <ManageAnggotaHelp />
        </HelpModal>
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
  const [selectedCabinetName, setSelectedCabinetName] = useState("");
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
      setDeleteError(`Gagal menghapus kabinet: ${getApiErrorMessage(err)}`);
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
      <div className="flex w-full items-center justify-between gap-4 portrait:flex-col">
        {/* Header */}
        <HeaderSection
          title="Manage Kabinet"
          titleStyle="font-averia text-black max-lg:text-3xl"
          className="gap-0"
          sub="Atur informasi tiap kabinet"
          subStyle="text-gray-600 mt-2 font-averia italic text-lg"
        />

        <div className="flex items-center gap-4">
          <div className="flex items-center max-lg:flex-col gap-2">
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
                          setSelectedCabinetName(cabinet.tagline);
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
            👻Daftar kabinet Kosong👻
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
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCabinetId(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Kabinet"
        itemName={selectedCabinetName}
        loading={deleteLoading}
        error={deleteError}
      />

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
      setDeleteError(`Gagal menghapus departemen: ${getApiErrorMessage(err)}`);
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
          subStyle="text-gray-600 mt-2 font-averia italic text-lg"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center max-lg:flex-col gap-2">
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
      <small className="mt-4 text-yellow-700 bg-yellow-200 px-2">
        ℹ️ NOTICE: Harap menambah anggota sebagai ketua departemen setelah
        membuat departemen baru dan edit informasi kepala departemen di edit
        departemen.
      </small>

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
                    👻Belum ada data departemen.👻
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
                        <button
                          type="button"
                          onClick={() => {
                            if (dept.slug) {
                              window.open(
                                `/departments/${dept.slug}`,
                                "_blank",
                              );
                            } else {
                              toast.error("Slug departemen tidak ditemukan");
                            }
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-pink-50 hover:text-primaryPink"
                        >
                          <HiOutlineEye size={18} />
                        </button>
                        <Link
                          href={`/cp/department/${dept.slug}/edit`}
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
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDeptId(null);
          setSelectedDeptName(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Departemen"
        itemName={selectedDeptName ?? ""}
        loading={deleteLoading}
        error={deleteError}
      />
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
  const [openHelp, setOpenHelp] = useState(false);
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
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
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
      setDeleteError(`Gagal menghapus kegiatan: ${getApiErrorMessage(err)}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <main className="flex w-full min-h-screen gap-8 p-4 flex-col lg:p-10">
      <div className="flex w-full items-center lg:justify-between portrait:flex-col gap-4">
        <HeaderSection
          title={"Manage Kegiatan"}
          sub={"Atur daftar kegiatan bulanan (What's On HIMASAKTA)"}
          subStyle="text-gray-600 mt-2 font-averia italic text-lg"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center max-lg:flex-col gap-2">
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
            className="px-4 py-4 lg:py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm"
          >
            + Add Event
          </Link>
          <IoIosHelpCircle
            className="w-6 h-6 text-blue-400 hover:opacity-80 transition-all duration-300 hover:cursor-pointer"
            title="help"
            onClick={() => setOpenHelp(true)}
          />
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
                      <button
                        type="button"
                        onClick={() => {
                          if (e.link) {
                            window.open(e.link, "_blank");
                          } else {
                            toast.error(
                              "Pratinjau link tidak tersedia untuk kegiatan ini",
                            );
                          }
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-pink-50 hover:text-primaryPink"
                      >
                        <HiOutlineEye size={18} />
                      </button>
                      <Link
                        href={`/cp/kegiatan/${e.id}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                      >
                        <HiOutlinePencilAlt size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedEventId(e.id);
                          setSelectedEventTitle(e.title);
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
            👻Daftar Kegiatan Kosong👻
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
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEventId(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Kegiatan"
        itemName={selectedEventTitle}
        loading={deleteLoading}
        error={deleteError}
      />

      {openHelp && (
        <HelpModal onClose={setOpenHelp}>
          <ManageEventHelp />
        </HelpModal>
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
  const [selectedGalleryCaption, setSelectedGalleryCaption] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [openHelp, setOpenHelp] = useState(false);
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
      toast.error(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
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
      setDeleteError(`Gagal menghapus gambar: ${getApiErrorMessage(err)}`);
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
    <div className="p-4 lg:p-10 bg-white min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-10 max-w-7xl mx-auto portrait:flex-col">
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
            data lain. Menghapus paksa membuat image di beberapa konten
            menghilang.
          </small>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center max-lg:flex-col gap-2">
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
          <IoIosHelpCircle
            className="w-6 h-6 text-blue-400 hover:opacity-80 transition-all duration-300 hover:cursor-pointer"
            title="help"
            onClick={() => setOpenHelp(true)}
          />
        </div>
      </div>

      <div
        className={clsxm(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-7xl mx-auto",
          galleryData.length === 0
            ? "flex flex-col items-center justify-center"
            : "",
        )}
      >
        {galleryData.length === 0 && <p>👻Belum ada data berita👻</p>}
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
              <div className="flex justify-between max-lg:flex-col lg:items-center mt-auto">
                <Typography
                  variant="p"
                  className="text-gray-800 mb-4 font-medium font-libertine"
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
                      setSelectedGalleryCaption(gallery.caption);
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
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4 landscape:max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.url}
              alt={previewImage.caption}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl landscape:max-h-[60vh]"
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
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedGalleryId(null);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteGallery}
        title="Hapus Gambar"
        itemName={selectedGalleryCaption}
        loading={deleteLoading}
        error={deleteError}
      />
      {openHelp && (
        <HelpModal onClose={setOpenHelp}>
          <ManageGalleryHelp />
        </HelpModal>
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
  const [selectedNewsTitle, setSelectedNewsTitle] = useState("");
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
  const [openHelp, setOpenHelp] = useState(false);

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
        toast.error(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
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
      toast.error("Gagal memuat preview berita");
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
    <div className="p-4 lg:p-10 bg-white min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-10 max-w-7xl mx-auto">
        <div className="flex items-center lg:justify-between gap-4 portrait:flex-col w-full">
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
            <div className="flex items-center max-lg:flex-col gap-2">
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
              className="px-4 py-2 max-lg:py-4 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm"
            >
              + Add Post
            </Link>
            <IoIosHelpCircle
              className="w-6 h-6 text-blue-400 hover:opacity-80 transition-all duration-300 hover:cursor-pointer"
              title="help"
              onClick={() => setOpenHelp(true)}
            />
          </div>
        </div>
      </div>

      <div
        className={clsxm(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-7xl mx-auto",
          newsData.length === 0
            ? "flex flex-col items-center justify-center"
            : "",
        )}
      >
        {newsData.length === 0 && <p>👻Belum ada data berita👻</p>}
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
              <div className="flex justify-between max-lg:flex-col items-start mt-auto">
                <Typography
                  variant="p"
                  className="text-gray-800 font-medium font-libertine"
                >
                  Published at:
                  <br />
                  {new Date(news.published_at).toLocaleString("id-ID")}
                </Typography>
                <div className="flex gap-[8px] max-lg:mt-4">
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
                      setSelectedNewsTitle(news.title);
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
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedNewsId(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Berita"
        itemName={selectedNewsTitle}
        loading={deleteLoading}
        error={deleteError}
      />
      {openHelp && (
        <HelpModal onClose={setOpenHelp}>
          <ManageNewsHelp />
        </HelpModal>
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
  const [openHelp, setOpenHelp] = useState(false);

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
      <div className="flex w-full items-center lg:justify-between portrait:flex-col gap-4">
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
          <div className="flex items-center max-lg:flex-col gap-2">
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
          <IoIosHelpCircle
            className="w-6 h-6 text-blue-400 hover:opacity-80 transition-all duration-300 hover:cursor-pointer"
            title="help"
            onClick={() => setOpenHelp(true)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full rounded-3xl overflow-x-auto border border-gray-200">
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
            👻 Daftar NRP Whitelist Kosong 👻
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

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedNrp(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
        title="Hapus NRP"
        itemName={
          selectedName ? `${selectedNrp} (${selectedName})` : selectedNrp ?? ""
        }
        loading={deleteLoading}
        error={deleteError}
      />

      {openHelp && (
        <HelpModal onClose={setOpenHelp}>
          <ManageNRPWhitelistHelp />
        </HelpModal>
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
  const [selectedProgendaName, setSelectedProgendaName] = useState<
    string | null
  >(null);
  const [_errorPreview, setErrorPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [viewProgenda, setViewProgenda] = useState<ProgendaType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [openHelp, setOpenHelp] = useState(false);

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
      toast.error(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
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
      toast.error(`Gagal memuat data: ${getApiErrorMessage(err)}`);
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
      setDeleteError(`Gagal menghapus progenda: ${getApiErrorMessage(err)}`);
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
          subStyle="text-gray-600 mt-2 font-averia italic text-lg"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center max-lg:flex-col gap-2">
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
                    👻Belum ada data Progenda.👻
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
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProgenda(null);
          setSelectedProgendaName(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Progenda"
        itemName={selectedProgendaName ?? ""}
        loading={deleteLoading}
        error={deleteError}
      />
      {openHelp && (
        <HelpModal onClose={setOpenHelp}>
          <ManageProgendaHelp />
        </HelpModal>
      )}
    </div>
  );
}

// SEO: Dashboard
type Props = {
  usr: string;
  onLogout: () => void;
};

export function DashboardAdmin({ usr }: Props) {
  return (
    <section className="flex flex-col gap-10 lg:p-10">
      <div className="flex flex-col gap-4">
        <HeaderSection title="Dashboard" />

        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Hi {usr} 👋</h1>
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

type FormValues = GlobalSettings;

export function GlobalSetting() {
  const [_data, setData] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [descVal, setDescVal] = useState("");
  const [initVal, setInitVal] = useState<FormValues | null>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);
  const {
    register,
    reset,
    formState: { isSubmitting },
    handleSubmit,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      ExternalSOPLink: "",
      InternalSOPLink: "",
      DeskripsiHimpunan: "",
      FotoHimpunan: "",
      SocialMedia: [],
      InMaintenance: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "SocialMedia",
  });

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
          FotoHimpunan: data.FotoHimpunan || "",
          InMaintenance: data.InMaintenance,
          SocialMedia: data.SocialMedia || [],
        };

        setInitVal(format);
        reset(format);
        setIsMaintenance(data.InMaintenance);
        setDescVal(data.DeskripsiHimpunan);
      } catch (err) {
        toast.error(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reset]);

  const handleResetForm = () => {
    if (!initVal) return;
    reset(initVal);
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
      SocialMedia: [],
    };

    reset(emptyValues);
    setDescVal("");
    setIsMaintenance(true);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: GlobalSettings = {
        ...values,
        InMaintenance: isMaintenance,
      };

      await api.put("/settings/web", payload);
      toast.success("Berhasil menyimpan pengaturan");
    } catch (err) {
      toast.error(`Gagal menyimpan: ${getApiErrorMessage(err)}`);
    }
  };

  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUsername || !authPassword) {
      toast.error("Username dan password wajib diisi");
      return;
    }

    setAuthLoading(true);
    try {
      await api.post("/auth/update", {
        username: authUsername,
        password: authPassword,
      });
      toast.success("Superadmin credentials updated!");
      setAuthPassword(""); // clear password after success
    } catch (err) {
      toast.error(`Gagal update auth: ${getApiErrorMessage(err)}`);
    } finally {
      setAuthLoading(false);
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
    <div className="flex min-h-screen w-full flex-col items-center gap-12 p-0 lg:p-10 pb-20">
      {/* Web Settings Section */}
      <section className="w-full flex flex-col gap-8 bg-white/50 backdrop-blur-sm p-4 lg:p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex w-full items-center justify-between gap-4 max-lg:flex-col border-b border-gray-100 pb-6">
          <div className="flex justify-between items-center w-full">
            <HeaderSection
              title="Web Settings"
              titleStyle="font-averia text-black max-lg:text-2xl"
              className="gap-0"
              sub="Konfigurasi informasi umum website"
              subStyle="text-gray-600 mt-2 font-averia italic text-lg"
            />
            <IoIosHelpCircle
              className="w-7 h-7 text-blue-400 hover:text-blue-500 transition-all duration-300 hover:cursor-pointer"
              title="Bantuan"
              onClick={() => setOpenHelp(true)}
            />
          </div>
        </div>

        <form
          id="main-form"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full"
        >
          <div className="flex gap-6 flex-col">
            {/* Himpunan Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Deskripsi Himpunan
                </label>
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/30 transition-all focus-within:ring-2 focus-within:ring-primaryPink/20 focus-within:border-primaryPink/40">
                  <Controller
                    name="DeskripsiHimpunan"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        value={descVal}
                        onChange={(e) => {
                          setDescVal(e.target.value);
                          field.onChange(e.target.value);
                        }}
                        className="w-full min-h-[160px] bg-transparent px-4 py-3 font-medium text-gray-800 focus:outline-none resize-y"
                        placeholder="Tulis deskripsi himpunan di sini..."
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Internal SOP Link
                </label>
                <input
                  {...register("InternalSOPLink")}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/20 focus:border-primaryPink/40"
                  placeholder="https://"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                  External SOP Link
                </label>
                <input
                  {...register("ExternalSOPLink")}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/20 focus:border-primaryPink/40"
                  placeholder="https://"
                />
              </div>

              <div className="lg:col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Foto Himpunan{" "}
                  <span className="text-xs font-normal lowercase opacity-60">
                    (URL path dari repositori)
                  </span>
                </label>
                <div className="flex items-center gap-3 w-full">
                  <input
                    {...register("FotoHimpunan")}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/20 focus:border-primaryPink/40"
                    placeholder="/images/(...).png"
                  />
                  <span className="text-gray-500 font-medium italic text-sm whitespace-nowrap">
                    atau
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenMedia(true)}
                    className="whitespace-nowrap px-4 py-3 bg-primaryPink text-white font-bold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all"
                  >
                    Upload File
                  </button>
                </div>
              </div>
            </div>

            {/* Web Status */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Maintenance Mode
              </label>
              <div className="flex gap-4 max-lg:flex-col">
                <button
                  type="button"
                  onClick={() => setIsMaintenance(true)}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 border rounded-2xl transition-all duration-300 ${
                    isMaintenance
                      ? "bg-red-50 border-red-500 text-red-700 shadow-inner"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${isMaintenance ? "bg-red-500 animate-pulse" : "bg-gray-300"}`}
                  />
                  Maintenance Aktif
                </button>
                <button
                  type="button"
                  onClick={() => setIsMaintenance(false)}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 border rounded-2xl transition-all duration-300 ${
                    !isMaintenance
                      ? "bg-green-50 border-green-500 text-green-700 shadow-inner"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${!isMaintenance ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  Situs Publik
                </button>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Social Media{" "}
                  <span className="text-xs font-normal lowercase opacity-60">
                    ({fields.length}/20)
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    fields.length < 20 && append({ name: "", link: "" })
                  }
                  disabled={fields.length >= 20}
                  className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-full bg-primaryPink/10 text-primaryPink border border-primaryPink/20 hover:bg-primaryPink hover:text-white transition-all disabled:opacity-30"
                >
                  <HiOutlinePlus /> Tambah
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative flex gap-2 items-start bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-primaryPink/30 transition-all"
                  >
                    <div className="flex-1 space-y-3">
                      <input
                        {...register(`SocialMedia.${index}.name` as const, {
                          required: true,
                        })}
                        className="w-full bg-transparent font-bold text-gray-800 placeholder:text-gray-400 focus:outline-none border-b border-transparent focus:border-primaryPink/40 transition-all"
                        placeholder="Nama Platform (e.g. Instagram)"
                      />
                      <input
                        {...register(`SocialMedia.${index}.link` as const, {
                          required: true,
                        })}
                        className="w-full bg-transparent text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none"
                        placeholder="URL Link (e.g. https://...)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-gray-300 hover:text-red-500 transition-all p-1"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <div className="col-span-full py-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                    <p className="text-sm italic">
                      Belum ada akun sosial media ditambahkan
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 max-lg:flex-col">
              <button
                type="button"
                onClick={handleResetForm}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-50 max-lg:w-full"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleEmptyReset}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl border border-red-100 bg-red-50/50 text-red-600 font-bold text-sm hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 max-lg:w-full"
              >
                Empty
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-2.5 bg-primaryPink text-white rounded-xl font-bold text-sm shadow-xl shadow-pink-100 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 max-lg:w-full"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Auth Settings Section: DANGER ZONE */}
      <section className="w-full flex flex-col gap-8 bg-red-50/20 backdrop-blur-sm p-6 rounded-3xl border border-red-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-red-200">
        <div className="flex w-full items-center justify-between border-b border-red-100/50 pb-6">
          <div className="flex flex-col gap-3">
            <span className="w-fit px-3 py-1 text-[11px] font-black uppercase tracking-widest bg-red-500 text-white rounded-lg animate-pulse shadow-sm">
              Danger Zone
            </span>
            <div className="flex flex-col gap-1">
              <HeaderSection
                title="Superadmin Access"
                titleStyle="font-averia text-red-900 max-lg:text-3xl"
                className="gap-0"
              />
              <p className="font-libertine text-red-600/60 text-sm">
                Ubah kredensial login akun tingkat tinggi. Tindakan ini bersifat
                sensitif.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleAuthUpdate} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                New Username
              </label>
              <input
                type="text"
                value={authUsername}
                onChange={(e) => setAuthUsername(e.target.value)}
                autoComplete="off"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 font-medium text-gray-800 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/20 focus:border-primaryPink/40"
                placeholder="Masukkan username baru"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  autoComplete="off"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 font-medium text-gray-800 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/20 focus:border-primaryPink/40"
                  placeholder="Masukkan password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all"
                >
                  {showPwd ? (
                    <HiOutlineEyeOff size={20} />
                  ) : (
                    <HiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4">
            <button
              type="submit"
              disabled={authLoading}
              className="px-10 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-100 transition-all hover:bg-slate-900 active:scale-95 disabled:opacity-50"
            >
              {authLoading ? "Memperbarui..." : "Simpan"}
            </button>
          </div>
        </form>
      </section>

      {openHelp && (
        <HelpModal onClose={setOpenHelp}>
          <ManageGlobalSettingHelp />
        </HelpModal>
      )}

      {openMedia && (
        <MediaSelector
          onClose={() => setOpenMedia(false)}
          onSelect={(photo) => {
            reset({ ...control._formValues, FotoHimpunan: photo.image_url });
            setOpenMedia(false);
          }}
        />
      )}
    </div>
  );
}
