"use client";

import Typography from "@/components/Typography";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import api from "@/lib/axios";
import { CreateCabinetType } from "@/types/admin/CreateCabinet";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; // Gunakan next/navigation untuk App Router
import { useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft, FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

type FormValues = Omit<CreateCabinetType, "is_active"> & {
  is_active: string;
};

type PhotoData = {
  id: string;
  image_url: string;
};

export default function EditCabinetPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
  } = useForm<FormValues>();

  // 1. FETCH DATA KABINET LAMA
  useEffect(() => {
    const fetchCabinetDetail = async () => {
      try {
        const resp = await api.get(`/cabinet-info/${id}`);
        const data = resp.data.data;

        // Isi form dengan data yang didapat
        reset({
          tagline: data.tagline,
          visi: data.visi,
          misi: data.misi,
          description: data.description,
          period_start: data.period_start,
          period_end: data.period_end,
          logo_id: data.logo?.id,
          organigram_id: data.organigram?.id,
        });

        // Set state tambahan
        setDescVal(data.description);
        setIsActive(data.is_active);
        if (data.logo) setLogo(data.logo);
        if (data.organigram) setOrganigram(data.organigram);
      } catch (err) {
        console.error("Failed to fetch cabinet:", err);
        alert("Gagal mengambil data kabinet.");
      }
    };

    if (id) fetchCabinetDetail();
  }, [id, reset]);

  // 2. SUBMIT MENGGUNAKAN PUT
  const onSubmit = async (data: FormValues) => {
    try {
      const payload: CreateCabinetType = {
        ...data,
        is_active: isActive,
      };

      await api.put(`/cabinet-info/${id}`, payload);
      alert("Berhasil memperbarui kabinet!");

      // Redirect kembali ke admin management
      router.push("/admin#manage-cabinet");
    } catch (err) {
      console.error("API ERROR: ", err);
      alert("Gagal memperbarui kabinet.");
    }
  };

  // handle image upload
  const [openUpload, setOpenUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logo, setLogo] = useState<PhotoData | null>(null);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const resp = await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded: PhotoData = resp.data.data;

      setLogo(uploaded);
      setValue("logo_id", uploaded.id, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setOpenUpload(false);
      alert("Berhasil upload gambar");
    } catch (err) {
      console.error(err);
      alert("Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  };

  // handle delete image
  const [deletingLogo, setDeletingLogo] = useState(false);
  const handleDeleteImage = async () => {
    if (!logo?.id) return;

    setDeletingLogo(true);

    try {
      await api.delete(`/gallery/${logo.id}`);

      setLogo(null);
      setValue("logo_id", undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      alert("Gambar berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus gambar");
    } finally {
      setDeletingLogo(false);
    }
  };

  // handle upload organigram
  const [organigram, setOrganigram] = useState<PhotoData | null>(null);
  const [openUploadOrganigram, setOpenUploadOrganigram] = useState(false);
  const [uploadingOrganigram, setUploadingOrganigram] = useState(false);

  const handleUploadOrganigram = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingOrganigram(true);

      const resp = await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded: PhotoData = resp.data.data;

      setOrganigram(uploaded);
      setValue("organigram_id", uploaded.id, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setOpenUploadOrganigram(false);
      alert("Berhasil upload organigram");
    } catch (err) {
      console.error(err);
      alert("Gagal upload organigram");
    } finally {
      setUploadingOrganigram(false);
    }
  };

  // handle delete organigram
  const [deletingOrganigram, setDeletingOrganigram] = useState(false);
  const handleDeleteOrganigram = async () => {
    if (!organigram?.id) return;

    try {
      await api.delete(`/gallery/${organigram.id}`);

      setDeletingOrganigram(true);

      setOrganigram(null);
      setValue("organigram_id", undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      alert("Organigram berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus organigram");
    } finally {
      setDeletingOrganigram(false);
    }
  };

  // handle markdown desc edit
  const [descMode, setDescMode] = useState<"edit" | "preview">("edit");
  const [descVal, setDescVal] = useState("");
  const [_preview, setPreview] = useState(false);

  const applyFormat = (before: string, after = before) => {
    if (!descRef.current) return;
    const el = descRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = descVal.slice(start, end);
    const newValue =
      descVal.slice(0, start) + before + selected + after + descVal.slice(end);
    setDescVal(newValue);
    setValue("description", newValue);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    }, 0);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-white p-10"
    >
      <div className="mx-auto max-w-7xl">
        <Typography
          variant="h3"
          className="mb-10 font-averia text-4xl font-bold text-black lg:text-5xl"
        >
          Edit Cabinet
        </Typography>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* LEFT SIDE: Form Inputs */}
          <div className="flex flex-1 flex-col gap-6 lg:max-w-[55%]">
            {/* Nama Kabinet */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Nama Kabinet
              </label>
              <input
                {...register("tagline", {
                  required: "Nama kabinet wajib diisi",
                })}
                className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                placeholder="Enter cabinet name"
              />
            </div>

            {/* Visi & Misi */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Visi
              </label>
              <textarea
                {...register("visi", { required: "Visi wajib diisi" })}
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-gray-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Misi
              </label>
              <textarea
                {...register("misi", { required: "Misi wajib diisi" })}
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-gray-800"
              />
            </div>

            {/* Deskripsi Markdown */}
            <div>
              {/* Toolbar & Controller logic remains same as your original code */}
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Deskripsi
              </label>
              <div className="flex w-44 rounded-lg border overflow-hidden text-sm my-2">
                <button
                  type="button"
                  onClick={() => setDescMode("edit")}
                  className={`px-4 py-1.5 font-medium transition ${
                    descMode === "edit"
                      ? "bg-primaryPink text-white"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setDescMode("preview")}
                  className={`px-4 py-1.5 font-medium transition ${
                    descMode === "preview"
                      ? "bg-primaryPink text-white"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#f8fafc]">
                {/* TOOLBAR — cuma muncul di edit */}
                {descMode === "edit" && (
                  <div className="flex items-center gap-2 border-b px-3 py-2">
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        applyFormat("**");
                        e.preventDefault();
                      }}
                    >
                      <BiBold size={18} />
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        applyFormat("*");
                        e.preventDefault();
                      }}
                    >
                      <BiItalic size={18} />
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormat("<u>", "</u>");
                      }}
                    >
                      <BiUnderline size={18} />
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormat("\n  - ", "");
                      }}
                    >
                      <AiOutlineUnorderedList size={18} />
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        applyFormat("\n  1. ", "");
                        e.preventDefault();
                      }}
                    >
                      <AiOutlineOrderedList size={18} />
                    </button>

                    <button
                      type="button"
                      className="ml-auto text-sm text-primaryPink"
                      onMouseDown={(e) => {
                        setPreview((p) => !p);
                        e.preventDefault();
                      }}
                    ></button>
                  </div>
                )}
                {descMode === "edit" && (
                  <Controller
                    name="description"
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
                        className="w-full min-h-[200px] bg-[#f8fafc] p-4"
                      />
                    )}
                  />
                )}
              </div>

              {/* Period Dates */}
              <div className="grid grid-cols-2 gap-6">
                <input
                  type="date"
                  {...register("period_start")}
                  className="..."
                />
                <input
                  type="date"
                  {...register("period_end")}
                  className="..."
                />
              </div>

              {/* Status Aktif */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsActive(true)}
                  className={`flex-1 py-3 border rounded-xl ${isActive ? "bg-green-50 border-green-500" : ""}`}
                >
                  Aktif
                </button>
                <button
                  type="button"
                  onClick={() => setIsActive(false)}
                  className={`flex-1 py-3 border rounded-xl ${!isActive ? "bg-red-50 border-red-500" : ""}`}
                >
                  Tidak Aktif
                </button>
              </div>
            </div>
          </div>
          {/* RIGHT SIDE: Uploads & Actions */}
          <div className="flex flex-1 flex-col">
            <label className="mb-2 block text-[15px] font-semibold text-black">
              Headline Image
            </label>

            <div
              className="flex items-center justify-center rounded-2xl border border-gray-200 bg-[#f8fafc]"
              style={{ aspectRatio: "4/3" }}
            >
              <div
                onClick={() => setOpenUpload(true)}
                className="group relative flex items-center justify-center rounded-2xl border border-gray-200 bg-[#f8fafc] cursor-pointer overflow-hidden w-full"
                style={{ aspectRatio: "4/3" }}
              >
                {logo ? (
                  <img
                    src={logo.image_url}
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="italic text-[#9BA5B7]">No image uploaded</p>
                )}

                {/* overlay hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center duration-300">
                  <HiOutlinePencilAlt className="text-white text-2xl" />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all duration-300"
                onClick={() => {
                  handleDeleteImage();
                  setOpenUpload(true);
                }}
              >
                <HiOutlinePencilAlt size={16} /> Edit Image
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-100 transition-all duration-300"
                onClick={() => handleDeleteImage()}
                disabled={deletingLogo}
              >
                <HiOutlineTrash size={16} /> Delete Image
              </button>
            </div>

            <label className="mb-2 mt-6 block text-[15px] font-semibold text-black">
              Organigram
            </label>

            <div
              onClick={() => setOpenUploadOrganigram(true)}
              className="group relative flex items-center justify-center rounded-2xl border border-gray-200 bg-[#f8fafc] cursor-pointer overflow-hidden w-full"
              style={{ aspectRatio: "4/3" }}
            >
              {organigram ? (
                <img
                  src={organigram.image_url}
                  alt="organigram"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="italic text-[#9BA5B7]">No organigram uploaded</p>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center duration-300">
                <HiOutlinePencilAlt className="text-white text-2xl" />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
                onClick={() => {
                  handleDeleteOrganigram();
                  setOpenUploadOrganigram(true);
                }}
              >
                <HiOutlinePencilAlt size={16} /> Edit Organigram
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-100 transition"
                onClick={handleDeleteOrganigram}
                disabled={deletingOrganigram}
              >
                <HiOutlineTrash size={16} /> Delete Organigram
              </button>
            </div>

            <div className="mt-8 flex justify-end items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  handleDeleteImage();
                }}
                disabled={isSubmitting || deletingLogo || deletingOrganigram}
                className="px-4 border py-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                Reset
              </button>
              <button
                type="submit"
                className="rounded-[10px] bg-primaryPink px-8 py-3 text-[15px] font-medium text-white hover:opacity-80 active:opacity-70 transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <Link
              href="/admin#manage-cabinet"
              className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white lg:hidden"
            >
              <FaChevronLeft size={12} /> Back
            </Link>
          </div>
        </div>
      </div>
      {/* Upload image modal */}
      {openUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Upload Image</h2>

            <div
              onClick={() => {
                if (uploading) return;
                document.getElementById("upload-input")?.click();
              }}
              onDragOver={(e) => !uploading && e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (uploading) return;
                const file = e.dataTransfer.files?.[0];
                if (file) handleUpload(file);
              }}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 transition-all
          ${
            uploading
              ? "cursor-not-allowed opacity-60 bg-gray-100"
              : "cursor-pointer hover:border-primaryPink hover:bg-pink-50"
          }
        `}
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-primaryPink">
                <FaCloudUploadAlt />
              </div>

              <p className="text-sm font-medium">
                {uploading ? "Uploading..." : "Klik atau drag file ke sini"}
              </p>

              <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>

              <input
                id="upload-input"
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={(e) => {
                  if (uploading) return;
                  if (e.target.files?.[0]) {
                    handleUpload(e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="flex gap-2 pt-6">
              <button
                type="button"
                onClick={() => setOpenUpload(false)}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {openUploadOrganigram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Upload Organigram</h2>

            <div
              onClick={() => {
                if (uploadingOrganigram) return;
                document.getElementById("upload-organigram")?.click();
              }}
              onDragOver={(e) => !uploadingOrganigram && e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (uploadingOrganigram) return;
                const file = e.dataTransfer.files?.[0];
                if (file) handleUploadOrganigram(file);
              }}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 transition-all
          ${
            uploadingOrganigram
              ? "cursor-not-allowed opacity-60 bg-gray-100"
              : "cursor-pointer hover:border-primaryPink hover:bg-pink-50"
          }
        `}
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-primaryPink">
                <FaCloudUploadAlt />
              </div>

              <p className="text-sm font-medium">
                {uploadingOrganigram
                  ? "Uploading..."
                  : "Klik atau drag file ke sini"}
              </p>

              <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>

              <input
                id="upload-organigram"
                type="file"
                accept="image/*"
                hidden
                disabled={uploadingOrganigram}
                onChange={(e) => {
                  if (uploadingOrganigram) return;
                  if (e.target.files?.[0]) {
                    handleUploadOrganigram(e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="flex gap-2 pt-6">
              <button
                type="button"
                onClick={() => setOpenUploadOrganigram(false)}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
