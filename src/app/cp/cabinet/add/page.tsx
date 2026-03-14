"use client";

import Typography from "@/components/Typography";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import api from "@/lib/axios";
import { CreateCabinetType } from "@/types/admin/CreateCabinet";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import MediaSelector from "@/components/admin/MediaSelector";
import VerifToken from "@/components/admin/VerifToken";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { ApiResponse } from "@/types/commons/apiResponse";
import { DepartmentType } from "@/types/data/DepartmentType";

type FormValues = Omit<CreateCabinetType, "is_active"> & {
  is_active: string;
};
type PhotoData = {
  id: string;
  image_url: string;
};

export default function AddCabinetPage() {
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
      visi: "",
      misi: "",
      description: "",
      tagline: "",
      period_start: "",
      period_end: "",
      logo_id: "",
      organigram_id: "",
      is_active: "false",
    },
  });

  const handleResetForms = () => {
    setGallery([]);
    setLogo(null);
    setOrganigram(null);
    setDescVal("");
  };

  // Inside your component
  const [isActive, setIsActive] = useState<boolean>(false);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload: CreateCabinetType = {
        ...data,
        is_active: isActive, // Use the state directly
      };

      const resp = await api.post<ApiResponse<DepartmentType>>(
        "/cabinet-info",
        payload,
      );

      const newId = resp.data.data.id;

      alert("Step 1: Berhasil menambahkan kabinet baru!");

      if (gallery) {
        try {
          await Promise.all(
            gallery.map((f) => {
              const payloadWithId = { ...f, cabinet_id: newId };
              return api.put(`gallery/${f.id}`, payloadWithId);
            }),
          );
          alert("Step 2: Berhasil menambahkan gallery!");
        } catch (err) {
          alert(`Gagal menambahkan semua gallery: ${getApiErrorMessage(err)}`);
        }
      }

      // Reset everything
      localStorage.removeItem("cabinet_form_draft"); // Clear the draft
      reset();
      setDescVal("");
      setIsActive(false);
      setLogo(null);
      setOrganigram(null);
      setGallery([]);
    } catch (err) {
      console.error("API ERROR: ", err);
      alert(`Gagal menambahkan kabinet baru: ${getApiErrorMessage(err)}`);
    }
  };

  // handle image upload
  const [openUpload, setOpenUpload] = useState(false);
  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [deletingLogo, setDeletingLogo] = useState(false);

  // handle delete image
  const handleDeleteImage = async (): Promise<boolean> => {
    if (!logo?.id) return true;
    const confirmDelete = confirm(
      "Yakin? Thumbnail akan dilepas. Gambar masih ada di galeri",
    );
    if (!confirmDelete) return false;

    setDeletingLogo(true);

    try {
      // await api.delete(`/gallery/${logo.id}`);

      setLogo(null);
      setValue("logo_id", "", {
        shouldDirty: true,
        shouldValidate: true,
      });

      // alert("Gambar berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus gambar");
      return false;
    } finally {
      setDeletingLogo(false);
    }
    return true;
  };

  // handle upload organigram
  const [organigram, setOrganigram] = useState<PhotoData | null>(null);
  const [openUploadOrganigram, setOpenUploadOrganigram] = useState(false);
  const [deletingOrganigram, setDeletingOrganigram] = useState(false);

  // handle delete organigram
  const handleDeleteOrganigram = async (): Promise<boolean> => {
    if (!organigram?.id) return true;

    const confirmDelete = confirm(
      "Yakin? Thumbnail akan dilepas. Gambar masih ada di galeri",
    );
    if (!confirmDelete) return false;

    try {
      // await api.delete(`/gallery/${organigram.id}`);

      setDeletingOrganigram(true);

      setOrganigram(null);
      setValue("organigram_id", "", {
        shouldDirty: true,
        shouldValidate: true,
      });

      // alert("Organigram berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus organigram");
      return false;
    } finally {
      setDeletingOrganigram(false);
    }
    return true;
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

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    }, 0);
  };

  // temp storage
  // add temp storage
  const watchedValues = watch();
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    // Prevent overwriting local storage with default values on initial mount
    if (!isRestored) return;

    const draft = {
      ...watchedValues,
      description: descVal,
      is_active: isActive,
      logo,
      organigram,
    };

    localStorage.setItem("cabinet_form_draft", JSON.stringify(draft));
  }, [watchedValues, descVal, isActive, logo, organigram, isRestored]);

  // restore localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cabinet_form_draft");
    if (saved) {
      const data = JSON.parse(saved);

      // 1. Sync React Hook Form
      reset(data);

      // 2. Sync local states
      setDescVal(data.description ?? "");
      setIsActive(data.is_active ?? false);
      setLogo(data.logo ?? null);
      setOrganigram(data.organigram ?? null);
    }
    // 3. Mark as restored ONLY after states are set
    setIsRestored(true);
  }, [reset]);

  // prevent scrolling when modal opened
  useEffect(() => {
    const isModalOpen = openUpload || openUploadOrganigram;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openUpload, openUploadOrganigram]);

  const [gallery, setGallery] = useState<PhotoData[]>([]);
  const [editingGallery, setEditingGallery] = useState(false);
  const [previewImage, setPreviewImage] = useState<PhotoData | null>(null);
  const addGallery = (photo: PhotoData) => {
    if (gallery.length >= 20) {
      alert("Maksimal 20 gambar!");
      return;
    }
    const isDuplicate = gallery.some((f) => f.id === photo.id);

    if (isDuplicate) {
      alert("Gambar ini sudah ada dalam progenda ini!");
      return;
    }

    setGallery((p) => [...p, photo]);
  };

  const removeGallery = (id: string) => {
    setGallery((p) => p.filter((photo) => photo.id !== id));
  };

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
      className="min-h-screen bg-white p-10"
    >
      <div className="mx-auto max-w-7xl">
        <Typography
          variant="h3"
          className="mb-10 font-averia text-4xl font-bold text-black lg:text-5xl"
        >
          Add Cabinet
        </Typography>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* LEFT */}
          <div className="flex flex-1 flex-col gap-6 lg:max-w-[55%]">
            {/* TITLE */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Nama Kabinet
              </label>
              <input
                {...register("tagline", {
                  required: "Title wajib diisi",
                })}
                className="w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                placeholder="Enter cabinet name"
              />
              {errors.tagline && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.tagline.message}
                </p>
              )}
            </div>

            {/* VISI */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Visi
              </label>
              <textarea
                {...register("visi", {
                  required: "Visi wajib diisi",
                })}
                className="w-full min-h-[100px] rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                placeholder="Enter some text"
              />
              {errors.visi && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.visi.message}
                </p>
              )}
            </div>

            {/* MISI */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Misi
              </label>
              <textarea
                {...register("misi", {
                  required: "Misi wajib diisi",
                })}
                className="w-full min-h-[100px] rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                placeholder="Enter some text"
              />
              {errors.misi && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.misi.message}
                </p>
              )}
            </div>

            {/* CONTENT */}
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
                        className="w-full min-h-[200px] bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 focus:outline-none"
                        placeholder="Tulis markdown di sini..."
                      />
                    )}
                  />
                )}
                {/* PREVIEW MODE */}
                {descMode === "preview" && (
                  <div className="w-full min-h-[200px] bg-[#f8fafc] p-4">
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

            {/* PERIOD */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-[15px] font-semibold text-black">
                  Period Start Date
                </label>
                <input
                  type="date"
                  {...register("period_start", {
                    required: "Tanggal mulai wajib diisi",
                  })}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                />
                {errors.period_start && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.period_start.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[15px] font-semibold text-black">
                  Period End Date
                </label>
                <input
                  type="date"
                  {...register("period_end", {
                    required: "Tanggal selesai wajib diisi",
                  })}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                />
                {errors.period_end && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.period_end.message}
                  </p>
                )}
              </div>
            </div>

            {/* STATUS KABINET */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Status Kabinet
              </label>

              <div className="flex gap-4">
                {/* ACTIVE BUTTON */}
                <button
                  type="button" // Critical: prevents form submission
                  onClick={() => setIsActive(true)}
                  className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all duration-200 border ${
                    isActive
                      ? "bg-green-50 border-green-500 text-green-700 shadow-sm"
                      : "bg-[#f8fafc] border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    Aktif
                  </div>
                </button>

                {/* INACTIVE BUTTON */}
                <button
                  type="button" // Critical: prevents form submission
                  onClick={() => setIsActive(false)}
                  className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all duration-200 border ${
                    !isActive
                      ? "bg-red-50 border-red-500 text-red-700 shadow-sm"
                      : "bg-[#f8fafc] border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${!isActive ? "bg-red-500" : "bg-gray-300"}`}
                    />
                    Tidak Aktif
                  </div>
                </button>
              </div>
            </div>

            <button type="button" disabled={isSubmitting}>
              <Link
                href="/cp#manage-cabinet"
                className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white max-lg:hidden hover:opacity-80 transition-all duration-300"
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
              className="flex items-center justify-center rounded-2xl border border-gray-200 bg-[#f8fafc] max-w-[250px]"
              style={{ aspectRatio: "1/1" }}
            >
              <div
                onClick={() => setOpenUpload(true)}
                className="group relative flex items-center justify-center rounded-2xl border border-gray-200 bg-[#f8fafc] cursor-pointer overflow-hidden w-full"
                style={{ aspectRatio: "1/1" }}
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

            <div className="mt-4 flex flex-col gap-2 max-w-[250px]">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all duration-300"
                onClick={() => setOpenUpload(true)}
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
              className="group relative flex items-center justify-center rounded-2xl border border-gray-200 bg-[#f8fafc] cursor-pointer overflow-hidden w-full max-w-[600px]"
              style={{ aspectRatio: "3/2" }}
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

            <div className="mt-4 flex flex-col gap-2 max-w-[600px]">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
                onClick={() => setOpenUploadOrganigram(true)}
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

            <div className="flex flex-col gap-4 mt-8 w-full">
              {/* MANAGE gallery */}
              <div className="w-full flex flex-row lg:justify-between lg:items-center mb-0 max-lg:flex-col">
                <label className="font-semibold text-black">Feeds/Galeri</label>
                <div className="text-sm italic text-gray-500">
                  Upload maksimum 20 gambar. Tidak disimpan sementara
                </div>
              </div>
              <div className="max-h-[320px] overflow-y-auto pr-2 space-y-2 rounded-xl p-3 bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-md border border-white/40 shadow-inner">
                {gallery.length < 20 && (
                  <button
                    type="button"
                    onClick={() => setEditingGallery(true)}
                    className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 bg-[#f8fafc] px-4 py-3 text-sm font-medium italic text-[#9BA5B7] hover:border-primaryPink hover:text-primaryPink w-full"
                  >
                    Add Image
                    <span className="text-lg">＋</span>
                  </button>
                )}
                {gallery.map((img) => (
                  <div
                    key={img.id}
                    className="flex items-center gap-3 border rounded-lg p-2 w-full justify-between bg-gradient-to-r from-slate-100 to-white"
                  >
                    <div className="flex items-center w-full gap-2">
                      <img
                        src={img.image_url}
                        className="w-16 h-16 object-cover rounded-md hover:cursor-pointer"
                        onClick={() => setPreviewImage(img)}
                      />
                      <p className="font-bold font-averia line-clamp-1">
                        {img.id}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(img)}
                        className="text-blue-600 text-sm hover:opacity-60"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => removeGallery(img.id)}
                        className="text-red-500 text-sm hover:opacity-60"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  handleDeleteImage();
                  handleResetForms();
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
                {isSubmitting ? "Adding..." : "Add Cabinet"}
              </button>
            </div>

            <button type="button" disabled={isSubmitting}>
              <Link
                href="/cp#manage-cabinet"
                className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white lg:hidden hover:opacity-80 transition-all duration-300"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </button>
          </div>
        </div>
      </div>
      {/* Media Selector Modals */}
      {openUpload && (
        <MediaSelector
          title="Select Headline Image"
          onClose={() => setOpenUpload(false)}
          onSelect={(img) => {
            setLogo(img);
            setValue("logo_id", img.id, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setOpenUpload(false);
          }}
        />
      )}
      {openUploadOrganigram && (
        <MediaSelector
          title="Select Organigram"
          onClose={() => setOpenUploadOrganigram(false)}
          onSelect={(img) => {
            setOrganigram(img);
            setValue("organigram_id", img.id, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setOpenUploadOrganigram(false);
          }}
        />
      )}
      {editingGallery && (
        <MediaSelector
          title="Upload gallery (Beberapa gambar)"
          onClose={() => setEditingGallery(false)}
          onSelect={(p) => {
            if (gallery.length >= 20) {
              alert("Maksimal 20 gambar!");
              return;
            }
            addGallery(p);
          }}
          onFilter="cabinet_id"
        />
      )}
      {/* Image preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.image_url}
              alt={previewImage.id}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white text-center text-sm font-medium bg-black/40 px-4 py-2 rounded-lg">
              {previewImage.id}
            </p>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all text-gray-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <LoadingFullScreen
        isSubmitting={isSubmitting}
        label="Submitting Cabinet Data"
      />
    </form>
  );
}
