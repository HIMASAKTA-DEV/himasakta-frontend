"use client";
import toast from "react-hot-toast";

import MarkdownEditor from "@/components/admin/MarkdownEditor";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

import { UUID } from "crypto";
import Typography from "@/components/Typography";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import MediaSelector from "@/components/admin/MediaSelector";
import TagInput from "@/components/admin/TagInput";
import VerifToken from "@/components/admin/VerifToken";
import { formatOrderedList, formatUnorderedList } from "@/lib/TextEditorHelper";
import api from "@/lib/axios";
import { normalizeHashtags } from "@/lib/normalizeHashTags";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import Lenis from "@studio-freight/lenis/types";
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

type LenisWindow = typeof globalThis & {
  lenis?: Lenis;
};

export default function EditNewsPage() {
  const route = useRouter();
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
  const [_descMode, _setDescMode] = useState<"edit" | "preview">("edit");
  const [descVal, setDescVal] = useState("");
  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [openUpload, setOpenUpload] = useState(false);
  const watchedValues = watch();
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isStorageRestored, setIsStorageRestored] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [currentId, setCurrentId] = useState<string | null>(null);

  // fetch data
  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const resp = await api.get(`/news/s/${id}`);
        const data = resp.data.data;

        setCurrentId(data.id);

        const tagsArray = normalizeHashtags(data.tags || data.hashtags);
        const hashtagsString = tagsArray.join(",");

        reset({
          title: data.title ?? "",
          tagline: data.tagline ?? "",
          hashtags: hashtagsString,
          content: data.content ?? "",
          thumbnail_id: data.thumbnail_id ?? "",
          published_at: data.published_at ? data.published_at.slice(0, 10) : "",
        });

        setDescVal(data.content ?? "");

        if (data.thumbnail) {
          setLogo({
            id: data.thumbnail.id,
            image_url: data.thumbnail.image_url,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengambil data berita");
      } finally {
        setIsApiLoaded(true);
      }
    };

    fetchDetail();
  }, [id, reset]);

  /* ================= MARKDOWN FORMAT ================= */
  const _applyFormat = (before: string, after = before) => {
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
      // Use currentId for updates as it's guaranteed to be the UUID
      await api.put(`/news/${currentId}`, payload);
      toast.success("Berhasil memperbarui berita!");
      reset();
      setDescVal("");
      localStorage.removeItem(`edit_news_${id}`);
      setLogo(null);
    } catch (err) {
      console.error(err);
      toast.error(`Gagal menambahkan berita: ${getApiErrorMessage(err)}`);
    } finally {
      route.push("/cp#manage-news");
    }
  };

  // handle delete image
  const handleDeleteImage = () => {
    setLogo(null);
    setValue("thumbnail_id", "");
  };

  // temp storage
  const STORAGE_KEY = `edit_news_${id}`;
  // add temp storage
  useEffect(() => {
    // Prevent overwriting local storage with default values on initial mount
    if (!isApiLoaded || !isStorageRestored) return;

    const draft = {
      ...watchedValues,
      description: descVal,
      logo,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [watchedValues, descVal, logo, isApiLoaded, isStorageRestored]);

  // restore localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);

      // 1. Sync React Hook Form
      reset(data);

      // 2. Sync local states
      setDescVal(data.description ?? "");
      setLogo(data.logo ?? null);
    }
    // 3. Mark as restored ONLY after states are set
    setIsStorageRestored(true);
  }, [reset]);

  const isReady = isApiLoaded && isStorageRestored;

  // prevent scrolling when modal opened
  useEffect(() => {
    const lenis = (globalThis as LenisWindow).lenis;
    if (!lenis) return;

    const isAnyModalOpen = openUpload;

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      lenis.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis.start();
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis.start();
    };
  }, [openUpload]);

  const _handleOrderedList = () => {
    const textarea = descRef.current;
    if (!textarea) return;

    const newText = formatOrderedList(
      descVal,
      textarea.selectionStart,
      textarea.selectionEnd,
    );

    setDescVal(newText);
  };

  const _handleUnorderedList = () => {
    const textarea = descRef.current;
    if (!textarea) return;

    const newText = formatUnorderedList(
      descVal,
      textarea.selectionStart,
      textarea.selectionEnd,
    );

    setDescVal(newText);
  };

  if (!isReady) {
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
      data-lenis-prevent
    >
      <VerifToken />
      <div className="max-w-7xl mx-auto">
        <Typography
          variant="h1"
          className="font-averia text-black text-5xl font-bold mb-10"
        >
          Edit Post
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

            <div>
              <label className="block font-semibold mb-2">Content</label>
              <Controller
                name="content"
                control={control}
                rules={{ required: "Content tidak boleh kosong" }}
                render={({ field, fieldState }) => (
                  <>
                    <MarkdownEditor
                      value={descVal}
                      onChange={(val) => {
                        setDescVal(val);
                        field.onChange(val);
                      }}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
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
              className="group relative overflow-hidden rounded-xl border"
              style={{ aspectRatio: "16/9" }}
              onClick={() => setOpenUpload(true)}
            >
              {logo ? (
                <img
                  src={logo.image_url}
                  className="h-full w-full object-cover object-center"
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

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 transition-all duration-300 hover:bg-blue-100 hover:text-blue-700"
                onClick={() => setOpenUpload(true)}
              >
                <HiOutlinePencilAlt size={16} /> Edit Image
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 transition-all duration-300 hover:bg-red-100 hover:text-red-600"
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
                  localStorage.removeItem(STORAGE_KEY);
                }}
                disabled={isSubmitting}
                className="rounded-lg border px-4 py-2 transition-all hover:bg-gray-50"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[10px] bg-primaryPink px-8 py-3 text-[15px] font-medium text-white transition-all duration-300 hover:opacity-80 active:opacity-70"
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
