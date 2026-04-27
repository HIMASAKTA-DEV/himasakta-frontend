/**
 * for edit mode, to delete image you have to set "" in logo_id then PUT it first
 * After that you can try deleting it
 */

"use client";
import toast from "react-hot-toast";

import Typography from "@/components/Typography";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import MediaSelector from "@/components/admin/MediaSelector";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { CreateCabinetType } from "@/types/admin/CreateCabinet";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; // Gunakan next/navigation untuk App Router
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import Lenis from "@studio-freight/lenis/types";

type FormValues = Omit<CreateCabinetType, "is_active"> & {
  is_active: string;
};

type PhotoData = {
  id: string;
  image_url: string;
};

type LenisWindow = typeof globalThis & {
  lenis?: Lenis;
};

export default function EditCabinetPage() {
  const [initVal, setInitVal] = useState<FormValues | null>(null);
  const [initValGallery, setInitValGallery] = useState<PhotoData[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
    control,
  } = useForm<FormValues>();

  // fetch cabinet by id
  useEffect(() => {
    const fetchCabinetDetail = async () => {
      try {
        const resp = await api.get(`/cabinet-info/${id}`);
        const data = resp.data.data;

        // Ensure dates are in YYYY-MM-DD format for HTML5 date inputs
        const formatDate = (dateStr: string) => {
          if (!dateStr) return "";
          return new Date(dateStr).toISOString().split("T")[0];
        };

        // Isi form dengan data yang didapat
        reset({
          tagline: data.tagline,
          visi: data.visi,
          misi: data.misi,
          description: data.description,
          period_start: formatDate(data.period_start),
          period_end: formatDate(data.period_end),
          logo_id: data.logo?.id,
          organigram_id: data.organigram?.id,
        });

        // Set state tambahan
        setDescVal(data.description);
        setIsActive(data.is_active);
        setInitValGallery(data.feeds);
        setGallery(data.feeds);
        setInitVal({
          ...data,
          period_start: formatDate(data.period_start),
          period_end: formatDate(data.period_end),
        });
        if (data.logo) setLogo(data.logo);
        if (data.organigram) setOrganigram(data.organigram);
      } catch (err) {
        console.error("Failed to fetch cabinet:", err);
        toast.error("Gagal mengambil data kabinet.");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchCabinetDetail();
    else setIsFetching(false);
  }, [id, reset]);

  // handle submit
  const onSubmit = async (data: FormValues) => {
    try {
      const payload: CreateCabinetType = {
        ...data,
        is_active: isActive,
      };

      await api.put(`/cabinet-info/${id}`, payload);
      toast.success("Step 1: Berhasil memperbarui data kabinet!");
      if (newGallery) {
        try {
          await Promise.all(
            newGallery.map((g) => {
              const payloadWithId = { ...g, cabinet_id: initVal?.id };
              return api.put(`gallery/${g.id}`, payloadWithId);
            }),
          );
          toast.success("Step 2: Berhasil menambah galeri kabinet!");
        } catch (err) {
          console.error(err);
          toast.error(
            `Gagal menambahkan semua galeri: ${getApiErrorMessage(err)}`,
          );
        }
      }

      if (delGallery) {
        try {
          await Promise.all(
            delGallery.map((g) => {
              const payloadWithId = { ...g, cabinet_id: null };
              return api.put(`gallery/${g.id}`, payloadWithId);
            }),
          );
          toast.success("Step 3: Berhasil menghapus beberapa galeri kabinet!");
        } catch (err) {
          console.error(err);
          toast.error(
            `Gagal menghapus semua galeri departemen: ${getApiErrorMessage(err)}`,
          );
        }
      }

      // Redirect kembali ke admin management
      router.push("/cp#manage-cabinet");
    } catch (err) {
      console.error("API ERROR: ", err);
      toast.error("Gagal memperbarui kabinet.");
    }
  };

  // handle image upload
  const [openUpload, setOpenUpload] = useState(false);
  const [logo, setLogo] = useState<PhotoData | null>(null);

  // handle delete image
  const [deletingLogo, setDeletingLogo] = useState(false);

  const handleDeleteImage = async (): Promise<boolean> => {
    if (!logo?.id) return false;

    const confirmDelete = confirm(
      "Yakin? Link akan dilepas dan gambar dihapus permanen.",
    );
    if (!confirmDelete) return false;

    setDeletingLogo(true);

    try {
      const currentValues = control._formValues;

      const unlinkPayload = {
        ...currentValues,
        logo_id: "",
        is_active: isActive,
      };

      await api.put(`/cabinet-info/${id}`, unlinkPayload);
      await api.delete(`/gallery/${logo.id}`);

      setLogo(null);
      setValue("logo_id", "");

      toast.success("Gambar berhasil dihapus dan diupdate!");
      return true;
    } catch (err) {
      console.error("Delete Flow Error:", err);
      toast.error("Gagal menghapus gambar :(");
      return false;
    } finally {
      setDeletingLogo(false);
    }
  };

  // handle upload organigram
  const [organigram, setOrganigram] = useState<PhotoData | null>(null);
  const [openUploadOrganigram, setOpenUploadOrganigram] = useState(false);

  // handle delete organigram
  const [deletingOrganigram, setDeletingOrganigram] = useState(false);

  const handleDeleteOrganigram = async (): Promise<boolean> => {
    if (!organigram?.id) return true;

    setDeletingOrganigram(true);

    try {
      // unlink via put
      const currentValues = control._formValues;
      const unlinkPayload = {
        ...currentValues,
        organigram_id: "",
        is_active: isActive,
      };

      await api.put(`/cabinet-info/${id}`, unlinkPayload);

      // then delete it
      await api.delete(`/gallery/${organigram.id}`);

      // sync the ui
      setOrganigram(null);
      setValue("organigram_id", "");

      toast.success("Gambar berhasil dihapus dan diupdate!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus organigram");
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
    setValue("description", newValue);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    }, 0);
  };

  const [gallery, setGallery] = useState<PhotoData[]>([]);
  const [editingGallery, setEditingGallery] = useState(false);
  const [previewImage, setPreviewImage] = useState<PhotoData | null>(null);
  const [newGallery, setNewGallery] = useState<PhotoData[]>([]);
  const [delGallery, setDelGallery] = useState<PhotoData[]>([]);
  const addGallery = (photo: PhotoData) => {
    if (gallery.length >= 20) {
      toast("Maksimal 20 gambar!");
      return;
    }
    const isDuplicate = gallery.some((f) => f.id === photo.id);

    if (isDuplicate) {
      toast("Gambar ini sudah ada dalam progenda ini!");
      return;
    }

    setGallery((p) => [...p, photo]);
    setNewGallery((p) => [...p, photo]);
  };

  const removeGallery = (photo: PhotoData) => {
    setGallery((p) => p.filter((prev) => prev.id !== photo.id));
    setDelGallery((d) => [...d, photo]);
  };

  // prevent scrolling when modal opened
  useEffect(() => {
    const lenis = (globalThis as LenisWindow).lenis;
    if (!lenis) return;

    const isAnyModalOpen =
      previewImage || openUpload || openUploadOrganigram || editingGallery;

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
  }, [previewImage, openUpload, openUploadOrganigram, editingGallery]);

  if (isFetching) {
    return (
      <LoadingFullScreen
        label="Fetching Cabinet Data"
        isSubmitting={true}
        styling="bg-white text-black"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-white p-10"
      data-lenis-prevent
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
                className="w-full min-h-[100px] rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                data-lenis-prevent
              />
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Misi
              </label>
              <textarea
                {...register("misi", { required: "Misi wajib diisi" })}
                className="w-full min-h-[100px] rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                data-lenis-prevent
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
                        data-lenis-prevent
                      />
                    )}
                  />
                )}
                {descMode === "preview" && (
                  <div
                    className="w-full min-h-[200px] bg-[#f8fafc] p-4"
                    data-lenis-prevent
                  >
                    <MarkdownRenderer>{descVal}</MarkdownRenderer>
                  </div>
                )}
              </div>

              {/* Period Dates */}
              <div className="grid grid-cols-2 gap-6 py-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-semibold text-black">
                    Start period
                  </label>
                  <input
                    type="date"
                    {...register("period_start")}
                    className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-semibold text-black">
                    End period
                  </label>
                  <input
                    type="date"
                    {...register("period_end")}
                    className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  />
                </div>
              </div>

              {/* Status Aktif */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsActive(true)}
                  className={`flex-1 py-3 border rounded-xl ${isActive ? "bg-green-50 border-green-500" : ""}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    Aktif
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsActive(false)}
                  className={`flex-1 py-3 border rounded-xl ${!isActive ? "bg-red-50 border-red-500" : ""}`}
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
                className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white max-lg:hidden"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </button>
          </div>
          {/* RIGHT SIDE: Uploads & Actions */}
          <div className="flex flex-1 flex-col">
            <label className="mb-2 block text-[15px] font-semibold text-black">
              Headline Image
            </label>

            <div
              className="flex items-center justify-center rounded-2xl border border-gray-200 bg-[#f8fafc] max-w-full"
              style={{ aspectRatio: "3/2" }}
            >
              <div
                onClick={() => setOpenUpload(true)}
                className="group relative flex items-center justify-center rounded-2xl border border-gray-200 bg-[#f8fafc] cursor-pointer overflow-hidden w-full"
                style={{ aspectRatio: "3/2" }}
              >
                {logo ? (
                  <img
                    src={logo.image_url}
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="italic text-[#9BA5B7] text-center">
                    No image uploaded (Recommended 1:1)
                  </p>
                )}

                {/* overlay hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center duration-300">
                  <HiOutlinePencilAlt className="text-white text-2xl" />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 max-w-full">
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
              className="group relative flex items-center justify-center rounded-2xl border border-gray-200 bg-[#f8fafc] cursor-pointer overflow-hidden w-full max-w-full"
              style={{ aspectRatio: "3/2" }}
            >
              {organigram ? (
                <img
                  src={organigram.image_url}
                  alt="organigram"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="italic text-[#9BA5B7] text-center">
                  No organigram uploaded (Recommended 16:9 &gt;4000px
                </p>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center duration-300">
                <HiOutlinePencilAlt className="text-white text-2xl" />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 max-w-full">
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
                onClick={async () => {
                  handleDeleteOrganigram();
                }}
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
              <div
                className="max-h-[320px] overflow-y-auto pr-2 space-y-2 rounded-xl p-3 bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-md border border-white/40 shadow-inner"
                data-lenis-prevent
              >
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
                        onClick={() => removeGallery(img)}
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
                  if (!initVal) return;
                  reset(initVal);
                  setDescVal(initVal?.description ?? "");
                  setGallery(initValGallery);
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

            <button type="button" disabled={isSubmitting}>
              <Link
                href="/cp#manage-cabinet"
                className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white lg:hidden"
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
              toast("Maksimal 20 gambar!");
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm "
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-[90vw] landscape:max-w-xl max-h-[90vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.image_url}
              alt={previewImage.id}
              className="max-w-full landscape:max-h-[60vh] max-h-[80vh] object-contain rounded-2xl shadow-2xl"
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
        loaderStyle="loader-full-scr-dark"
      />
    </form>
  );
}
