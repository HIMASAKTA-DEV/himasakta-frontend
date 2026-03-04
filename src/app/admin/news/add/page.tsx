"use client";

import Link from "next/link";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft, FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

import { UUID } from "crypto";
import Typography from "@/components/Typography";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  title: string;
  tagline: string;
  hashtags: string;
  content: string;
  thumbnail_id: string;
  published_at: string;
};

type PhotoData = {
  id: UUID | string;
  image_url: string;
};

export default function AddNewsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      tagline: "",
      hashtags: "",
      content: "",
      thumbnail_id: "",
      published_at: "",
    },
  });

  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const [descMode, setDescMode] = useState<"edit" | "preview">("edit");
  const [descVal, setDescVal] = useState("");
  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const watchedValues = watch();
  const [isRestored, setIsRestored] = useState(false);

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
        published_at: data.published_at
          ? new Date(data.published_at).toISOString()
          : null,
      };
      await api.post("/news", payload);
      alert("Berhasil menambahkan berita!");
      reset();
      setDescVal("");
      setLogo(null);
      localStorage.removeItem("add_event_draft");
    } catch (err) {
      console.error(err);
      alert(`Gagal menambahkan berita: ${getApiErrorMessage(err)}`);
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
      setValue("thumbnail_id", uploaded.id as string, {
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

  // handle delete image
  const handleDeleteImage = async () => {
    if (!logo?.id) return;

    try {
      setDeletingLogo(true);

      await api.delete(`/gallery/${logo.id}`);

      setLogo(null);
      setValue("thumbnail_id", "");
      alert("Gambar berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert(`Gagal menghapus gambar: ${getApiErrorMessage(err)}`);
    } finally {
      setDeletingLogo(false);
    }
  };

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

  if (!isRestored) {
    return (
      <div className=" flex items-center justify-center p-10 min-h-screen w-full">
        <SkeletonPleaseWait />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-10 bg-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <Typography
          variant="h1"
          className="font-averia text-black text-5xl font-bold mb-10"
        >
          Add Post
        </Typography>

        <div className="flex flex-col lg:flex-row gap-12 md:gap-16">
          {/* LEFT */}
          <div className="flex-1 lg:max-w-[55%] flex flex-col gap-6">
            {/* TITLE */}
            <div>
              <label className="block font-semibold mb-2">Title</label>
              <input
                {...register("title", { required: "Judul wajib diisi" })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
                placeholder="Insert news title..."
              />
              {errors.title?.message && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* DATE */}
            <div>
              <label className="block font-semibold mb-2">Publish Date</label>
              <input
                type="date"
                {...register("published_at", {
                  required: "Tanggal wajib diisi",
                })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
              />
              {errors.published_at && (
                <p className="text-sm text-red-500">
                  {errors.published_at.message}
                </p>
              )}
            </div>

            {/* TAGLINE */}
            <div>
              <label className="block font-semibold mb-2">
                Short Description
              </label>
              <input
                {...register("tagline")}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
                placeholder="Insert tagline..."
              />
              {errors.tagline && (
                <p className="text-sm text-red-500">
                  {errors.hashtags?.message}
                </p>
              )}
            </div>

            {/* TAGS */}
            <div>
              <label className="block font-semibold mb-2">Tags</label>
              <input
                {...register("hashtags", {
                  validate: (value) =>
                    value.split(/\s+/).every((tag) => tag.startsWith("#")) ||
                    "Setiap hashtag harus diawali dengan #",
                })}
                placeholder="E.g. #its,#himasakta,..."
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
              />
              {errors.hashtags && (
                <p className="text-sm text-red-500">
                  {errors.hashtags.message}
                </p>
              )}
            </div>

            {/* CONTENT */}
            <div>
              <label className="block font-semibold mb-2">Content</label>

              {/* TOGGLE */}
              <div className="flex w-44 rounded-lg border overflow-hidden text-sm mb-2">
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
                    {/* TOOLBAR */}
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

                    <textarea
                      ref={descRef}
                      value={descVal}
                      onChange={(e) => {
                        setDescVal(e.target.value);
                        setValue("content", e.target.value, {
                          shouldDirty: true,
                        });
                      }}
                      rows={6}
                      placeholder="Cotent goes here..."
                      className="w-full bg-[#f8fafc] rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
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

              {/* hidden field for RHF */}
              <input
                type="hidden"
                {...register("content", {
                  required: "Content tidak boleh kosong",
                })}
              />
            </div>

            <Link
              href="/admin#manage-news"
              className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white max-lg:hidden hover:opacity-80 transition-all duration-300"
            >
              <FaChevronLeft size={12} /> Back
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex flex-1 flex-col">
            <label className="mb-2 font-semibold">Headline Image</label>

            <div
              onClick={() => setOpenUpload(true)}
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
                onClick={handleDeleteImage}
                disabled={deletingLogo}
              >
                <HiOutlineTrash size={16} /> Delete Image
              </button>
            </div>

            <div className="mt-12 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  reset({
                    title: "",
                    tagline: "",
                    hashtags: "",
                    content: "",
                    thumbnail_id: "",
                    published_at: "",
                  });
                  setDescVal("");
                  setLogo(null);
                  localStorage.removeItem("add_event_draft");
                }}
                disabled={isSubmitting || deletingLogo}
                className="px-4 border py-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[10px] bg-primaryPink px-8 py-3 text-[15px] font-medium text-white hover:opacity-80 active:opacity-70 transition-all duration-300"
              >
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </button>
            </div>
            <Link
              href="/admin#manage-news"
              className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white lg:hidden hover:opacity-80 transition-all duration-300"
            >
              <FaChevronLeft size={12} /> Back
            </Link>
          </div>
        </div>
      </div>
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
