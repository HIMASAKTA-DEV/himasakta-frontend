"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
import MediaSelector from "@/components/admin/MediaSelector";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { MonthlyEvent } from "@/types/data/GetToKnow";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";

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
  const { id } = useParams<{ id: string }>();
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
  } = useForm<FormValues>();

  const [loading, setLoading] = useState(true);
  const [descMode, setDescMode] = useState<"edit" | "preview">("edit");
  const [descVal, setDescVal] = useState("");
  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [openMedia, setOpenMedia] = useState(false);
  const [initVal, setInitVal] = useState<MonthlyEvent | null>(null);

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

  /* ================= DELETE IMAGE ================= */
  const handleDeleteImage = () => {
    setLogo(null);
    setValue("thumbnail_id", "");
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
                <label className="mb-2 block text-[15px] font-semibold text-black">
                  Judul Kegiatan
                </label>
                <input
                  {...register("title", { required: "Judul wajib diisi" })}
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
                  placeholder="Enter event link"
                />
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
                  className="w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
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
              <div className="mt-8">
                <Link
                  href="/admin#manage-kegiatan"
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
                    if (!initVal) return;
                    reset({
                      title: initVal.title,
                      thumbnail_id: initVal.thumbnail?.id ?? "",
                      description: initVal.description,
                      month: initVal.month?.slice(0, 10),
                      link: initVal.link,
                    });
                    setDescVal(initVal.description ?? "");
                    setLogo(initVal.thumbnail ?? null);
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
                  {isSubmitting ? "Saving..." : "Save Changes"}
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
