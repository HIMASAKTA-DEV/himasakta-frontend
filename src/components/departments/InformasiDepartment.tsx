"use client";

import api from "@/lib/axios";
import { mediaToImages } from "@/lib/mediaToImages";
import { DepartmentType } from "@/types/data/DepartmentType";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import ReactMarkdown from "react-markdown";
import HeaderSection from "../commons/HeaderSection";
import SocmedCard from "./_socmedCard";
import ImagesSlideshow from "./slideShowImages.tsx/ImagesSlideshow";

function InformasiDepartment({ ...dept }: DepartmentType) {
  const logoImages = mediaToImages(dept?.logo);

  const [showNrpModal, setShowNrpModal] = useState(false);
  const [nrpInput, setNrpInput] = useState("");
  const [nrpLoading, setNrpLoading] = useState(false);
  const [nrpError, setNrpError] = useState("");

  const handleBankRefClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // If we already have the link (e.g. superadmin), just open it
    if (
      dept?.bank_ref_link &&
      dept.bank_ref_link !== "" &&
      dept.bank_ref_link !== "/"
    ) {
      window.open(dept.bank_ref_link, "_blank", "noopener,noreferrer");
      return;
    }
    // Otherwise, show modal to verify NRP
    setShowNrpModal(true);
    setNrpInput("");
    setNrpError("");
  };

  const handleVerifyNrp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nrpInput.trim()) return;
    setNrpLoading(true);
    setNrpError("");
    try {
      const resp = await api.post("/nrp-whitelist", {
        nrp: nrpInput,
        departmentid: dept.id,
      });
      if (resp.data.success) {
        const bankRef = resp.data.data.department?.bank_ref_link;
        if (bankRef && bankRef !== "" && bankRef !== "/") {
          setShowNrpModal(false);
          window.open(bankRef, "_blank", "noopener,noreferrer");
        } else {
          setNrpError("Bank Referensi belum tersedia untuk departemen ini.");
        }
      } else {
        setNrpError(resp.data.message || "NRP tidak memiliki akses.");
      }
    } catch (err) {
      console.error("NRP Validation error:", err);
      let message = "Validasi NRP gagal. Pastikan NRP Anda terdaftar.";
      if (isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      setNrpError(message);
    } finally {
      setNrpLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center lg:items-start lg:justify-between lg:flex-row flex-col gap-8">
        <div className="lg:w-[40%] w-full max-w-sm mx-auto lg:max-w-none">
          <div className="w-full aspect-[9/11] rounded-2xl relative shadow-lg overflow-hidden group">
            <ImagesSlideshow images={logoImages} />
          </div>
        </div>
        <div className="w-full lg:w-[55%] flex flex-col items-start justify-start lg:mt-4 gap-6">
          <HeaderSection
            title={`${dept?.name ?? ""}`}
            sub={"Informasi Department"}
            subStyle="font-libertine text-slate-500 text-lg font-medium"
            titleStyle="text-3xl lg:text-4xl font-averia"
            className="gap-2"
          />

          <div className="text-md font-libertine text-gray-700 leading-relaxed prose prose-p:my-2">
            <ReactMarkdown>{dept?.description ?? ""}</ReactMarkdown>
          </div>

          {(dept?.bank_soal_link ||
            dept?.silabus_link ||
            dept?.bank_ref_link) && (
            <div className="gap-4 flex flex-col w-full mt-2 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <h1 className="font-libertine font-bold text-xl text-gray-900 border-b pb-2">
                Links Akademik
              </h1>
              <ul className="flex flex-col gap-3">
                {dept?.bank_soal_link && (
                  <li className="flex items-center group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primaryPink mr-3 group-hover:scale-150 transition-all" />
                    <Link
                      href={dept.bank_soal_link}
                      className="text-md font-libertine text-gray-700 hover:text-primaryPink transition-all duration-300 font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Bank Soal Department
                    </Link>
                  </li>
                )}
                {dept?.silabus_link && (
                  <li className="flex items-center group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primaryPink mr-3 group-hover:scale-150 transition-all" />
                    <Link
                      href={dept.silabus_link}
                      className="text-md font-libertine text-gray-700 hover:text-primaryPink transition-all duration-300 font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Silabus
                    </Link>
                  </li>
                )}
                {dept?.bank_ref_link && (
                  <li className="flex items-center group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primaryPink mr-3 group-hover:scale-150 transition-all" />
                    <button
                      onClick={handleBankRefClick}
                      className="text-md font-libertine text-gray-700 hover:text-primaryPink transition-all duration-300 font-medium flex items-center gap-2"
                    >
                      Bank Referensi{" "}
                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
                        Restricted
                      </span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}

          <SocmedCard {...dept} />
        </div>
      </div>

      {showNrpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowNrpModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-averia text-gray-900 mr-8">
                Akses Bank Referensi
              </h2>
              <p className="text-sm font-libertine text-gray-500 mt-2">
                Masukkan NRP Anda untuk mengakses Bank Referensi. Hanya NRP yang
                terdaftar yang memiliki akses ke halaman ini.
              </p>
            </div>

            <form onSubmit={handleVerifyNrp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="nrp_input"
                  className="text-sm font-semibold text-gray-700 font-libertine"
                >
                  Nomor Registrasi Pokok (NRP)
                </label>
                <input
                  id="nrp_input"
                  type="text"
                  autoFocus
                  placeholder="e.g. 5025251104"
                  value={nrpInput}
                  onChange={(e) =>
                    setNrpInput(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primaryPink/40 focus:border-primaryPink transition-all text-lg font-mono"
                  disabled={nrpLoading}
                  autoComplete="off"
                />
              </div>

              {nrpError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                  <span className="text-base leading-none block pt-0.5">⚠️</span>
                  <p className="font-medium">{nrpError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={nrpLoading || !nrpInput.trim()}
                className="w-full mt-2 bg-slate-900 hover:bg-primaryPink text-white py-3.5 rounded-xl font-bold shadow-lg shadow-gray-200 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group overflow-hidden relative"
              >
                {nrpLoading ? (
                  <>
                    <ImSpinner2 className="animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <span>Verifikasi & Buka Referensi</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default InformasiDepartment;
