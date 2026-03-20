"use client";
import toast from "react-hot-toast";

import Link from "next/link";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

import { UUID } from "crypto";
import Typography from "@/components/Typography";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import MediaSelector from "@/components/admin/MediaSelector";
import TagInput from "@/components/admin/TagInput";
import VerifToken from "@/components/admin/VerifToken";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control,
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
      toast.success("Berhasil menambahkan berita!");
      reset();
      setDescVal("");
      setLogo(null);
      localStorage.removeItem("add_event_draft");
      router.push("/cp#manage-news");
    } catch (err) {
      console.error(err);
      toast.error(`Gagal menambahkan berita: ${getApiErrorMessage(err)}`);
    }
  };

  // handle delete image
  const handleDeleteImage = () => {
    setLogo(null);
    setValue("thumbnail_id", "");
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
      <LoadingFullScreen
        isSubmitting={true}
        label="Loading Post Data"
        styling="bg-white text-black"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-10 bg-white min-h-screen"
    >
      <VerifToken />
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
              <Controller
                name="hashtags"
                control={control}
                rules={{
                  required: "At least one tag is required",
                }}
                render={({ field, fieldState }) => (
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
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

            <button disabled={isSubmitting}>
              <Link
                href="/cp#manage-news"
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
              className="flex items-center justify-center rounded-2xl border border-gray-200 bg-[#f8fafc]"
              style={{ aspectRatio: "4/3" }}
            >
              <div
                className="group relative h-full w-full overflow-hidden rounded-2xl"
                onClick={() => setOpenUpload(true)}
              >
                {logo ? (
                  <img
                    src={logo.image_url}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center italic text-gray-400">
                    No image
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100">
                  <HiOutlinePencilAlt className="text-2xl text-white" />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-300"
                onClick={() => setOpenUpload(true)}
              >
                <HiOutlinePencilAlt size={16} /> Edit Image
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-100 hover:text-red-600 transition-all duration-300"
                onClick={handleDeleteImage}
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
                disabled={isSubmitting}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50 transition-all"
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

            <button disabled={isSubmitting}>
              <Link
                href="/cp#manage-news"
                className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white lg:hidden hover:opacity-80 transition-all duration-300"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </button>
          </div>
        </div>
      </div>
      {openUpload && (
        <MediaSelector
          onClose={() => setOpenUpload(false)}
          onSelect={(img) => {
            setLogo(img);
            setValue("thumbnail_id", img.id, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setOpenUpload(false);
          }}
          title="Select Headline Image"
        />
      )}
      <LoadingFullScreen
        isSubmitting={isSubmitting}
        label="Submitting News Data"
        loaderStyle="loader-full-scr-dark"
      />
    </form>
  );
}
