"use client";
import toast from "react-hot-toast";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUpload,
} from "react-icons/hi";

import Typography from "@/components/Typography";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import MediaSelector from "@/components/admin/MediaSelector";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";

type FormValues = {
  title: string;
  thumbnail_id: string;
  description: string;
  month: string;
  link: string;
};

type PhotoData = {
  id: string;
  image_url: string;
};

function page() {
  const router = useRouter();
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
  const [openMedia, setOpenMedia] = useState(false);
  const [logo, setLogo] = useState<PhotoData | null>(null);
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

  // empty

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

      toast.success("Berhasil menambahkan kegiatan baru!");
      router.push("/cp#manage-kegiatan");
    } catch (err) {
      toast.error(
        `Gagal menambahkan kegiatan baru karena ${getApiErrorMessage(err)}`,
      );
    }
  };

  /* ================= DELETE IMAGE ================= */
  const handleDeleteImage = () => {
    setLogo(null);
    setValue("thumbnail_id", "");
  };

  if (!isRestored) {
    return (
      <LoadingFullScreen
        isSubmitting={true}
        label="Loading Event Data"
        styling="bg-white text-black"
      />
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
                    required: "Tanggal wajib diisi",
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
              <div className="mt-8">
                <Link
                  href="/cp#manage-kegiatan"
                  className="flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
                >
                  <FaChevronLeft size={12} /> Back
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex-1 flex flex-col gap-8">
              <div>
                <label className="block font-semibold mb-3 text-[15px]">
                  Headline Image
                </label>
                <div
                  onClick={() => setOpenMedia(true)}
                  className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-primaryPink hover:bg-pink-50"
                >
                  {logo ? (
                    <img
                      src={logo.image_url}
                      alt="Headline"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
                      <div className="rounded-full bg-white p-4 shadow-sm transition-transform group-hover:scale-110">
                        <HiOutlineUpload
                          size={24}
                          className="text-primaryPink"
                        />
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
              </div>

              <div className="mt-8 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setDescVal("");
                    setLogo(null);
                    localStorage.removeItem("add_event_draft");
                  }}
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
                  {isSubmitting ? "Adding..." : "Add Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* MEDIA SELECTOR */}
      {openMedia && (
        <MediaSelector
          onSelect={(m) => {
            setLogo(m);
            setValue("thumbnail_id", m.id, { shouldValidate: true });
            setOpenMedia(false);
          }}
          onClose={() => setOpenMedia(false)}
        />
      )}
      <LoadingFullScreen
        isSubmitting={isSubmitting}
        label="Submitting Event Data"
      />
    </main>
  );
}

export default page;
