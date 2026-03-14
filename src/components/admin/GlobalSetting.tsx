"use client";

import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { ApiResponse } from "@/types/commons/apiResponse";
import { GlobalSettings } from "@/types/data/GlobalSettings";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import HeaderSection from "../commons/HeaderSection";
import SkeletonPleaseWait from "../commons/skeletons/SkeletonPleaseWait";

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

function GlobalSetting() {
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

export default GlobalSetting;
