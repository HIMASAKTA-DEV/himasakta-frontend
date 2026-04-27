"use client";
import toast from "react-hot-toast";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUpload,
} from "react-icons/hi";
import Select, { StylesConfig } from "react-select";

import Typography from "@/components/Typography";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { ManageGalleryType } from "@/types/admin/ManageGallery";
import { ApiResponse } from "@/types/commons/apiResponse";

type PhotoData = {
  id: string;
  image_url: string;
};

type DeptName = {
  id: string;
  name: string;
};

type ProgendaDD = {
  id: string;
  name: string;
};

type CabinetDD = {
  id: string;
  tagline: string;
};

type OptionType = { label?: string; value?: string };

const selectStyles: StylesConfig<OptionType, false> = {
  control: (base, state) => ({
    ...base,
    borderRadius: "0.5rem",
    minHeight: "42px",
    outline: "none",
    borderColor: state.isFocused ? "#D58A94" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 1px #D58A94" : "none",
    "&:hover": { borderColor: "#D58A94" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#D58A94"
      : state.isFocused
        ? "#fce7f3"
        : "white",
    color: state.isSelected ? "white" : "#111827",
    cursor: "pointer",
  }),
};

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function EditGalleryPage() {
  const { id } = useParams<{ id: string }>();
  const route = useRouter();
  const [initVal, setInitVal] = useState<ManageGalleryType | null>(null);
  const [deptData, setDeptData] = useState<DeptName[]>([]);
  const [progendaDD, setProgendaDD] = useState<ProgendaDD[]>([]);
  const [cabinetDD, setCabinetDD] = useState<CabinetDD[]>([]);
  const [loadDept, setLoadDept] = useState(false);
  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [openMedia, setOpenMedia] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const LOCAL_KEY = `edit_gallery_${id}`;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ManageGalleryType>({
    defaultValues: {},
  });

  const watchedValues = watch();

  /* ================= FETCH INIT DATA ================= */
  useEffect(() => {
    const fetchInit = async () => {
      setLoadDept(true);
      try {
        // fetch gallery detail
        const resp = await api.get<ApiResponse<ManageGalleryType>>(
          `/gallery/${id}`,
        );
        const data: ManageGalleryType = resp.data.data;
        setInitVal(data);
        reset(data);

        // set logo if available
        if (data.image_url) {
          setLogo({ id: data.id, image_url: data.image_url });
        }

        // fetch department, cabinet, and progenda
        const [{ data: deptRes }, { data: cabinetRes }, { data: progendaRes }] =
          await Promise.all([
            api.get<ApiResponse<DeptName[]>>("/department"),
            api.get<ApiResponse<CabinetDD[]>>("/cabinet-info"),
            api.get<ApiResponse<ProgendaDD[]>>("/progenda"),
          ]);

        setDeptData(deptRes.data);
        setCabinetDD(cabinetRes.data);
        setProgendaDD(progendaRes.data);
      } catch (err) {
        console.error(err);
        toast.error(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
      } finally {
        setLoadDept(false);
        setIsRestored(true);
      }
    };

    fetchInit();
  }, [id, reset]);

  /* ================= LOCAL STORAGE ================= */
  useEffect(() => {
    if (!isRestored) return;

    const draft = {
      ...watchedValues,
      logo,
    };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(draft));
  }, [watchedValues, logo, isRestored]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      reset(data);
      setLogo(data.logo ?? null);
    }
    setIsRestored(true);
  }, [reset]);

  /* ================= DELETE IMAGE ================= */
  const handleDeleteImage = () => {
    setLogo(null);
    setValue("image_url", "");
  };

  /* ================= SUBMIT FORM ================= */
  const onSubmit = async (data: ManageGalleryType) => {
    try {
      await api.put(`/gallery/${id}`, data);
      toast.success("Berhasil memperbarui gallery!");
      reset();
      setLogo(null);
      localStorage.removeItem(LOCAL_KEY);
      route.push("/cp#manage-gallery");
    } catch (err) {
      console.error(err);
      toast.error(`Gagal memperbarui gallery: ${getApiErrorMessage(err)}`);
    }
  };

  const handleResetForm = () => {
    reset({
      ...initVal,
    });

    setLogo(initVal);
    setOpenMedia(false);
    localStorage.removeItem(LOCAL_KEY);
  };

  if (!isRestored) {
    return (
      <LoadingFullScreen
        isSubmitting={true}
        label="Submitting Gallery Data"
        styling="bg-white text-black"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-10 bg-white min-h-screen"
      data-lenis-prevent
    >
      <div className="max-w-7xl mx-auto">
        <Typography
          variant="h1"
          className="font-averia text-black text-5xl font-bold mb-10 mx-auto"
        >
          Edit Gallery
        </Typography>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT FORM */}
          <div className="flex-1 flex flex-col gap-6">
            {/* TITLE */}
            <div>
              <label className="block font-semibold mb-2">Title</label>
              <input
                {...register("caption", { required: "Judul wajib diisi" })}
                placeholder="Insert photo title..."
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primaryPink transition-all"
              />
              {errors.caption && (
                <p className="text-sm text-red-500">{errors.caption.message}</p>
              )}
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block font-semibold mb-2">Category</label>
              <input
                {...register("category")}
                placeholder="Insert category..."
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primaryPink transition-all"
              />
            </div>

            {/* DEPARTMENT */}
            <Field label="Departemen" error={errors.department_id?.message}>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name="department_id"
                      render={({ field }) => (
                        <Select
                          placeholder="Pilih Jabatan"
                          styles={selectStyles}
                          isLoading={loadDept}
                          options={deptData.map((d) => ({
                            value: d.id,
                            label: d.name,
                          }))}
                          value={
                            deptData
                              .map((d) => ({ value: d.id, label: d.name }))
                              .find((o) => o.value === field.value) || null
                          }
                          onChange={(opt) => field.onChange(opt?.value ?? "")}
                          isClearable
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Field>

            {/* PROGENDA */}
            <Field label="Progenda" error={errors.progenda_id?.message}>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name="progenda_id"
                      render={({ field }) => (
                        <Select
                          placeholder="Pilih Progenda"
                          styles={selectStyles}
                          isLoading={loadDept}
                          options={progendaDD.map((p) => ({
                            value: p.id,
                            label: p.name,
                          }))}
                          value={
                            progendaDD
                              .map((p) => ({ value: p.id, label: p.name }))
                              .find((o) => o.value === field.value) || null
                          }
                          onChange={(opt) => field.onChange(opt?.value ?? "")}
                          isClearable
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Field>

            {/* CABINET */}
            <Field label="Kabinet" error={errors.cabinet_id?.message}>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name="cabinet_id"
                      render={({ field }) => (
                        <Select
                          placeholder="Pilih Kabinet"
                          styles={selectStyles}
                          isLoading={loadDept}
                          options={cabinetDD.map((c) => ({
                            value: c.id,
                            label: c.tagline,
                          }))}
                          value={
                            cabinetDD
                              .map((c) => ({ value: c.id, label: c.tagline }))
                              .find((o) => o.value === field.value) || null
                          }
                          onChange={(opt) => field.onChange(opt?.value ?? "")}
                          isClearable
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Field>

            <div className="mt-8">
              <Link
                href="/cp#manage-gallery"
                className="flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <label className="block font-semibold mb-3">Photo Gallery</label>
            <div
              onClick={() => setOpenMedia(true)}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-primaryPink hover:bg-pink-50"
            >
              {logo ? (
                <img
                  src={logo.image_url}
                  alt="Gallery"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
                  <div className="rounded-full bg-white p-4 shadow-sm transition-transform group-hover:scale-110">
                    <HiOutlineUpload size={24} className="text-primaryPink" />
                  </div>
                  <span className="text-sm font-medium">
                    Click to select image
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <HiOutlinePencilAlt className="text-3xl text-white" />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setOpenMedia(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-100 hover:text-blue-700 active:scale-[0.98]"
              >
                <HiOutlineUpload size={18} />
                {logo ? "Change Image" : "Select Image"}
              </button>

              {logo && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500 transition-all hover:bg-red-100 hover:text-red-600 active:scale-[0.98]"
                >
                  <HiOutlineTrash size={18} />
                  Delete Image
                </button>
              )}
            </div>

            <div className="mt-12 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={handleResetForm}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primaryPink px-10 py-3 text-white rounded-xl font-semibold shadow-lg shadow-pink-200 transition-all hover:opacity-90 hover:shadow-pink-300 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Gallery"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* UPLOAD MODAL */}
      {openMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Upload Gallery Image</h2>
            <div
              onClick={() =>
                document.getElementById("gallery-edit-upload")?.click()
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const formData = new FormData();
                  formData.append("image", file);
                  api
                    .post("/gallery", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then((resp) => {
                      const uploaded = resp.data.data;
                      setLogo(uploaded);
                      setValue("image_url", uploaded.image_url, {
                        shouldValidate: true,
                      });
                      setOpenMedia(false);
                    })
                    .catch(() => toast.error("Gagal upload gambar"));
                }
              }}
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer hover:border-primaryPink hover:bg-pink-50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-primaryPink">
                <HiOutlineUpload size={20} />
              </div>
              <p className="text-sm font-medium">Klik atau drag file ke sini</p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
              <input
                id="gallery-edit-upload"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("image", file);
                  api
                    .post("/gallery", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then((resp) => {
                      const uploaded = resp.data.data;
                      setLogo(uploaded);
                      setValue("image_url", uploaded.image_url, {
                        shouldValidate: true,
                      });
                      setOpenMedia(false);
                    })
                    .catch(() => toast.error("Gagal upload gambar"));
                }}
              />
            </div>
            <div className="flex gap-2 pt-6">
              <button
                type="button"
                onClick={() => setOpenMedia(false)}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-200 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      <LoadingFullScreen
        isSubmitting={isSubmitting}
        label="Submitting Gallery Data"
        loaderStyle="loader-full-scr-dark"
      />
    </form>
  );
}
