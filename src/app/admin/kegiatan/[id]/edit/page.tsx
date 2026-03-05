"use client";

import { UUID } from "crypto";
import Typography from "@/components/Typography";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { MonthlyEvent } from "@/types/data/GetToKnow";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft, FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

type FormValues = {
  title: string;
  thumbnail_id: UUID | string;
  description: string;
  month: string;
  link: string;
};

type PhotoData = {
  id: string;
  image_url: string;
};

function page() {
  const { id } = useParams<{ id: string }>();
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
    getValues,
  } = useForm<FormValues>();

  const [loading, setLoading] = useState(true);
  const [descMode, setDescMode] = useState<"edit" | "preview">("edit");
  const [descVal, setDescVal] = useState("");
  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [initVal, setInitVal] = useState<FormValues | null>(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const resp = await api.get(`/monthly-event/${id}`);
        const data: MonthlyEvent = resp.data.data;

        reset({
          title: data.title,
          thumbnail_id: data.thumbnail?.id ?? "",
          description: data.description,
          month: data.month?.slice(0, 10),
          link: data.link,
        });

        setDescVal(data.description ?? "");
        setLogo(data.thumbnail ?? null);
        setInitVal(data);
      } catch (err) {
        console.error(err);
        alert(`Gagal mengambil data${getApiErrorMessage(err)}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id, reset]);

  /* ================= MARKDOWN FORMAT ================= */
  const applyFormat = (before: string, after = before) => {
    if (!descRef.current) return;

    const el = descRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    const selected = descVal.slice(start, end);
    const newValue =
      descVal.slice(0, start) + before + selected + after + descVal.slice(end);

    setDescVal(newValue);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    }, 0);
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        month: data.month ? new Date(data.month).toISOString() : null,
      };

      await api.put(`/monthly-event/${id}`, payload);
      alert("Berhasil memperbarui kegiatan!");
    } catch (err) {
      alert(`Gagal update kegiatan: ${getApiErrorMessage(err)}`);
    }
  };

  /* ================= UPLOAD IMAGE ================= */
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
      setValue("thumbnail_id", uploaded.id, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setOpenUpload(false);
      alert("Berhasil upload gambar");
    } catch (err) {
      console.error(err);
      alert(`Gagal upload gambar: ${getApiErrorMessage(err)}`);
    } finally {
      setUploading(false);
    }
  };
  const handleDeleteImage = async (): Promise<boolean> => {
    if (!logo?.id) return true;

    const confirmDelete = confirm(
      "Yakin? Thumbnail akan dilepas dan gambar dihapus permanen.",
    );
    if (!confirmDelete) return false;

    setDeletingLogo(true);
    const values = getValues();
    try {
      // unlink thumbnail
      await api.put(`/monthly-event/${id}`, {
        ...values,
        month: values.month ? new Date(values.month).toISOString() : null,
        thumbnail_id: "",
      });

      // delete gallery image
      await api.delete(`/gallery/${logo.id}`);

      setLogo(null);
      setValue("thumbnail_id", "");

      alert("Gambar berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert(`Gagal menghapus gambar: ${getApiErrorMessage(err)}`);
      return false;
    } finally {
      setDeletingLogo(false);
    }
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SkeletonPleaseWait />
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <main>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen bg-white p-10"
      >
        <div className="mx-auto max-w-7xl">
          <Typography
            variant="h3"
            className="mb-10 font-averia text-4xl font-bold lg:text-5xl"
          >
            Edit Event
          </Typography>

          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            {/* LEFT */}
            <div className="flex flex-1 flex-col gap-6 lg:max-w-[55%]">
              {/* TITLE */}
              <div>
                <label className="mb-2 block font-semibold">Judul</label>
                <input
                  {...register("title", { required: "Judul wajib diisi" })}
                  className="w-full rounded-xl border px-4 py-3"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* LINK */}
              <div>
                <label className="mb-2 block font-semibold">Link</label>
                <input
                  {...register("link")}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              {/* DATE */}
              <div>
                <label className="mb-2 block font-semibold">
                  Tanggal Kegiatan
                </label>
                <input
                  type="date"
                  {...register("month", {
                    required: "Tanggal wajib diisi",
                  })}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block font-semibold">Deskripsi</label>

                <div className="flex w-44 rounded-lg border overflow-hidden text-sm my-2">
                  <button
                    type="button"
                    onClick={() => setDescMode("edit")}
                    className={`flex-1 py-1 ${
                      descMode === "edit" ? "bg-primaryPink text-white" : ""
                    }`}
                  >
                    Markdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescMode("preview")}
                    className={`flex-1 py-1 ${
                      descMode === "preview" ? "bg-primaryPink text-white" : ""
                    }`}
                  >
                    Preview
                  </button>
                </div>

                <div className="rounded-xl border bg-[#f8fafc]">
                  {descMode === "edit" && (
                    <>
                      <div className="flex gap-2 border-b p-2">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFormat("**");
                          }}
                        >
                          <BiBold />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFormat("*");
                          }}
                        >
                          <BiItalic />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFormat("<u>", "</u>");
                          }}
                        >
                          <BiUnderline />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFormat("\n- ", "");
                          }}
                        >
                          <AiOutlineUnorderedList />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFormat("\n1. ", "");
                          }}
                        >
                          <AiOutlineOrderedList />
                        </button>
                      </div>

                      <Controller
                        name="description"
                        control={control}
                        rules={{ required: "Deskripsi wajib diisi" }}
                        render={({ field }) => (
                          <textarea
                            ref={(el) => {
                              field.ref(el);
                              descRef.current = el;
                            }}
                            value={descVal}
                            onChange={(e) => {
                              setDescVal(e.target.value);
                              field.onChange(e.target.value);
                            }}
                            rows={6}
                            className="w-full px-4 py-3 bg-transparent"
                          />
                        )}
                      />
                    </>
                  )}

                  {descMode === "preview" && (
                    <div className="prose px-4 py-3">
                      <MarkdownRenderer>
                        {descVal || "_Tidak ada konten_"}
                      </MarkdownRenderer>
                    </div>
                  )}
                </div>
              </div>
              <button disabled={isSubmitting}>
                <Link
                  href="/admin#manage-kegiatan"
                  className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-white hover:opacity-80 transition-all duration-300 max-lg:hidden"
                >
                  <FaChevronLeft size={12} /> Back
                </Link>
              </button>
            </div>

            {/* RIGHT */}
            <div className="flex flex-1 flex-col">
              <label className="mb-2 font-semibold">Headline Image</label>

              <div
                onClick={async () => {
                  const ok = await handleDeleteImage();
                  if (ok) setOpenUpload(true);
                }}
                className="relative cursor-pointer overflow-hidden rounded-xl border"
                style={{ aspectRatio: "4/3" }}
              >
                {logo ? (
                  <img
                    src={logo.image_url}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center italic text-gray-400">
                    No image
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition">
                  <HiOutlinePencilAlt className="text-white text-2xl" />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all duration-300"
                  onClick={async () => {
                    const ok = await handleDeleteImage();
                    if (ok) setOpenUpload(true);
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

              <div className="mt-8 flex justify-end items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!initVal) return;

                    reset(initVal);
                    setDescVal(initVal.description);
                  }}
                  disabled={isSubmitting || deletingLogo}
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
              <button disabled={isSubmitting}>
                <Link
                  href="/admin#manage-kegiatan"
                  className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white lg:hidden hover:opacity-80 transition-all duration-300"
                >
                  <FaChevronLeft size={12} /> Back
                </Link>
              </button>
            </div>
          </div>
        </div>
        {/* IMAGE UPLOAD MODAL */}
        {openUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
              <h2 className="text-lg font-semibold mb-4">
                Upload Headline Image
              </h2>

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
                    uploading || deletingLogo
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
                  disabled={uploading}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </main>
  );
}

export default page;
