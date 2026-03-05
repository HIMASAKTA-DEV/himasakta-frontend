"use client";

import { UUID } from "crypto";
import Typography from "@/components/Typography";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft, FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

type FormValues = {
  title: string; // required
  thumbnail_id: UUID | string;
  description: string;
  month: string; // required
  link: string;
};

type PhotoData = {
  id: string;
  image_url: string;
};

function page() {
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      thumbnail_id: "",
      description: "",
      month: "",
      link: "",
    },
  });

  const [descMode, setDescMode] = useState<"edit" | "preview">("edit");
  const [descVal, setDescVal] = useState("");
  const [_preview, setPreview] = useState(false);

  const [openUpload, setOpenUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const watchedValues = watch();
  const [isRestored, setIsRestored] = useState(false);

  // temp storage
  // add temp storage
  useEffect(() => {
    // Prevent overwriting local storage with default values on initial mount
    if (!isRestored) return;

    const draft = {
      ...watchedValues,
      description: descVal,
      logo,
    };

    localStorage.setItem("add_event_draft", JSON.stringify(draft));
  }, [watchedValues, descVal, logo, isRestored]);

  // restore localStorage
  useEffect(() => {
    const saved = localStorage.getItem("add_event_draft");
    if (saved) {
      const data = JSON.parse(saved);

      // 1. Sync React Hook Form
      reset(data);

      // 2. Sync local states
      setDescVal(data.description ?? "");
      setLogo(data.logo ?? null);
    }
    // 3. Mark as restored ONLY after states are set
    setIsRestored(true);
  }, [reset]);

  // prevent scrolling when modal opened
  useEffect(() => {
    const isModalOpen = openUpload;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openUpload]);

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

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        month: data.month ? new Date(data.month).toISOString() : null,
      };
      await api.post("/monthly-event", payload);

      localStorage.removeItem("add_event_draft");
      reset();
      setDescVal("");
      setLogo(null);

      alert("Berhasil menambahkan kegiatan baru!");
    } catch (err) {
      alert(
        `Gagal menambahkan kegiatan baru karena ${getApiErrorMessage(err)}`,
      );
    }
  };

  // handle image upload
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
      alert("Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  };

  // handle delete image
  const handleDeleteImage = async (): Promise<boolean> => {
    if (!logo?.id) return true;

    const confirmDelete = confirm(
      "Yakin? Thumbnail akan dilepas dan gambar dihapus permanen.",
    );
    if (!confirmDelete) return false;

    setDeletingLogo(true);
    try {
      await api.delete(`/gallery/${logo.id}`);

      setLogo(null);
      setValue("thumbnail_id", "", {
        shouldDirty: true,
        shouldValidate: true,
      });

      alert("Gambar berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus gambar");
      return false;
    } finally {
      setDeletingLogo(false);
    }

    return true;
  };

  if (!isRestored) {
    return (
      <div className=" flex items-center justify-center p-10 min-h-screen w-full">
        <SkeletonPleaseWait />
      </div>
    );
  }

  return (
    <main>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen bg-white p-10"
      >
        <div className="mx-auto max-w-7xl">
          <Typography
            variant="h3"
            className="mb-10 font-averia text-4xl font-bold text-black lg:text-5xl"
          >
            Add Event
          </Typography>

          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            {/* LEFT */}
            <div className="flex flex-1 flex-col gap-6 lg:max-w-[55%]">
              {/* Title */}
              <div>
                <label className="mb-2 block text-[15px] font-semibold text-black">
                  Judul Kegiatan
                </label>
                <input
                  {...register("title", {
                    required: "Judul wajib diisi",
                  })}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  placeholder="Enter event name"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>
              {/* LINK */}
              <div>
                <label className="mb-2 block text-[15px] font-semibold text-black">
                  Link
                </label>
                <input
                  {...register("link")}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  placeholder="Enter event name"
                />
                {errors.link && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.link.message}
                  </p>
                )}
              </div>

              {/* DATE */}
              <div>
                <label className="mb-2 block text-[15px] font-semibold text-black">
                  Tanggal Kegiatan
                </label>
                <input
                  type="date"
                  {...register("month", {
                    required: "Tanggal mulai wajib diisi",
                  })}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                />
                {errors.month && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.month.message}
                  </p>
                )}
              </div>

              <div>
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
                        className="p-1 rounded-md hover:bg-gray-300 transition-all duration-300"
                      >
                        <BiBold size={18} />
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => {
                          applyFormat("*");
                          e.preventDefault();
                        }}
                        className="p-1 rounded-md hover:bg-gray-300 transition-all duration-300"
                      >
                        <BiItalic size={18} />
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyFormat("<u>", "</u>");
                        }}
                        className="p-1 rounded-md hover:bg-gray-300 transition-all duration-300"
                      >
                        <BiUnderline size={18} />
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyFormat("\n  - ", "");
                        }}
                        className="p-1 rounded-md hover:bg-gray-300 transition-all duration-300"
                      >
                        <AiOutlineUnorderedList size={18} />
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => {
                          applyFormat("\n  1. ", "");
                          e.preventDefault();
                        }}
                        className="p-1 rounded-md hover:bg-gray-300 transition-all duration-300"
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
                      rules={{ required: "Content wajib diisi" }}
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
                          className="w-full resize-none bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 focus:outline-none"
                          placeholder="Tulis markdown di sini..."
                        />
                      )}
                    />
                  )}
                  {/* PREVIEW MODE */}
                  {descMode === "preview" && (
                    <div className="prose max-w-none px-4 py-3">
                      {descVal ? (
                        <MarkdownRenderer>{descVal}</MarkdownRenderer>
                      ) : (
                        <p className="italic text-gray-400">Tidak ada konten</p>
                      )}
                    </div>
                  )}
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
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
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Headline Image
              </label>

              <div
                className="flex items-center justify-center rounded-2xl border border-gray-200 bg-[#f8fafc]"
                style={{ aspectRatio: "4/3" }}
              >
                <div
                  onClick={async () => {
                    const ok = await handleDeleteImage();
                    if (ok) setOpenUpload(true);
                  }}
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
                    reset();
                    handleDeleteImage();
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
                  {isSubmitting ? "Adding..." : "Add Cabinet"}
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
