"use client";
import toast from "react-hot-toast";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUpload,
} from "react-icons/hi";

import Typography from "@/components/Typography";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import MediaSelector from "@/components/admin/MediaSelector";
import { formatOrderedList, formatUnorderedList } from "@/lib/TextEditorHelper";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { ApiResponse } from "@/types/commons/apiResponse";
import { DepartmentType } from "@/types/data/DepartmentType";
import Lenis from "@studio-freight/lenis/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

type DepartmentLinkType =
  | "social_media_link"
  | "silabus_link"
  | "bank_soal_link"
  | "bank_ref_link";

type LinkProps = {
  id: string;
  type: DepartmentLinkType;
  label: string;
  url: string;
};

type FormValues = {
  name: string;
  description: string;
  logo_id: string;
  social_media_link: string;
  bank_soal_link: string;
  silabus_link: string;
  bank_ref_link: string;
};

type PhotoData = {
  id: string;
  image_url: string;
};

type LenisWindow = typeof globalThis & {
  lenis?: Lenis;
};

export default function AddDepartmentPage() {
  const _route = useRouter();
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [descVal, setDescVal] = useState("");
  const [_descMode, _setDescMode] = useState<"edit" | "preview">("edit");

  const [deletingLogo, setDeletingLogo] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);
  const [gallery, setGallery] = useState<PhotoData[]>([]);
  const [editingGallery, setEditingGallery] = useState(false);
  const [previewImage, setPreviewImage] = useState<PhotoData | null>(null);

  const {
    register,
    formState: { isSubmitting },
    control,
    reset,
    setValue,
    handleSubmit,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      logo_id: "",
      social_media_link: "",
      silabus_link: "",
      bank_soal_link: "",
      bank_ref_link: "",
    },
  });

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
  };

  const removeGallery = (id: string) => {
    setGallery((p) => p.filter((photo) => photo.id !== id));
  };

  const watchedValues = watch();

  const handleDeleteLogo = async (): Promise<boolean> => {
    if (!logo?.id) return true;

    const confirmDelete = confirm("Yakin hapus gambar?");
    if (!confirmDelete) return false;

    setDeletingLogo(true);

    try {
      await api.delete(`/gallery/${logo.id}`);

      setLogo(null);
      setValue("logo_id", "");

      toast.success("Logo berhasil dihapus");
    } catch (err) {
      toast.error(`Gagal menghapus logo: ${getApiErrorMessage(err)}`);
      return false;
    } finally {
      setDeletingLogo(false);
    }
    return true;
  };

  const _applyFormat = (before: string, after = before) => {
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

  const [links, setLinks] = useState<LinkProps[]>([]);

  const linkOpts = [
    { type: "social_media_link", label: "Social Media" },
    { type: "silabus_link", label: "Silabus" },
    { type: "bank_soal_link", label: "Bank Soal" },
    { type: "bank_ref_link", label: "Bank Referensi" },
  ] as const;

  const addLink = () => {
    const used = links.map((l) => l.type);
    const available = linkOpts.find((l) => !used.includes(l.type));

    if (!available) return;

    setLinks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: available.type,
        label: available.label,
        url: "",
      },
    ]);
  };

  const updateLink = (id: string, value: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, url: value } : l)),
    );
  };

  const removeLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        social_media_link:
          links.find((l) => l.type === "social_media_link")?.url || "",
        silabus_link: links.find((l) => l.type === "silabus_link")?.url || "",
        bank_soal_link:
          links.find((l) => l.type === "bank_soal_link")?.url || "",
        bank_ref_link: links.find((l) => l.type === "bank_ref_link")?.url || "",
      };

      const resp = await api.post<ApiResponse<DepartmentType>>(
        "/department",
        payload,
      );

      const newId = resp.data.data.id;

      toast.success("Step 1: Departemen berhasil ditambahkan!");

      if (gallery) {
        try {
          await Promise.all(
            gallery.map((f) => {
              const payloadWithId = { ...f, department_id: newId };
              return api.put(`gallery/${f.id}`, payloadWithId);
            }),
          );
          toast.success("Step 2: Berhasil menambahkan gallery!");
        } catch (err) {
          toast.error(
            `Gagal menambahkan semua gallery: ${getApiErrorMessage(err)}`,
          );
        }
      }

      localStorage.removeItem("department_form_draft");
    } catch (err) {
      toast.error(`Gagal menambahkan departemen: ${getApiErrorMessage(err)}`);
    } finally {
      handleResetForm();
    }
  };

  const handleResetForm = () => {
    reset({
      name: "",
      description: "",
      logo_id: "",
      social_media_link: "",
      silabus_link: "",
      bank_soal_link: "",
      bank_ref_link: "",
    });
    setDescVal("");
    setLogo(null);
    setGallery([]);
    setLinks([]);
    localStorage.removeItem("department_form_draft");
  };

  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    if (!isRestored) return;

    const draft = {
      ...watchedValues,
      description: descVal,
      logo,
      links,
    };

    localStorage.setItem("department_form_draft", JSON.stringify(draft));
  }, [watchedValues, descVal, logo, links, isRestored]);

  useEffect(() => {
    const saved = localStorage.getItem("department_form_draft");

    if (saved) {
      try {
        const data = JSON.parse(saved);
        reset(data);
        setDescVal(data.description ?? "");
        setLogo(data.logo ?? null);
        setLinks(data.links ?? []);
      } catch (e) {
        console.error("Failed to restore draft", e);
      }
    }

    setIsRestored(true);
  }, [reset]);

  // prevent scrolling when modal opened
  useEffect(() => {
    const lenis = (globalThis as LenisWindow).lenis;
    if (!lenis) return;

    const isAnyModalOpen = previewImage || openMedia || editingGallery;

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
  }, [previewImage, openMedia, editingGallery]);

  // text editor helper
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

  if (!isRestored) {
    return (
      <LoadingFullScreen
        isSubmitting={true}
        label="Loading Department Data"
        styling="bg-white text-black"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 lg:p-10" data-lenis-prevent>
      <form className="mx-auto max-w-7xl" onSubmit={handleSubmit(onSubmit)}>
        <Typography
          variant="h1"
          className="mb-10 font-averia text-4xl font-bold lg:text-5xl"
        >
          Add Department
        </Typography>
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col gap-6 lg:max-w-[55%]">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold">
                Nama Departemen
              </label>

              <input
                {...register("name")}
                className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                placeholder="Enter department name"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Deskripsi
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MarkdownEditor
                    value={descVal}
                    onChange={(val) => {
                      setDescVal(val);
                      field.onChange(val);
                    }}
                  />
                )}
              />
            </div>

            {/* LINKS */}
            <div>
              <label className="mb-3 block text-[15px] font-semibold">
                Link
              </label>

              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <div key={link.id}>
                    <span className="text-sm">{link.label}</span>
                    <div className="flex gap-2">
                      <input
                        value={link.url}
                        onChange={(e) => updateLink(link.id, e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-sm font-medium text-gray-600 placeholder:italic placeholder:text-[#9BA5B7] focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                        placeholder="https://"
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(link.id)}
                        className="px-3 text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {links.length < linkOpts.length && (
                  <button
                    type="button"
                    onClick={addLink}
                    className="flex w-full items-center justify-between rounded-xl border border-dashed border-gray-300 bg-[#f8fafc] px-4 py-3 text-sm font-medium italic text-[#9BA5B7] transition-all hover:border-primaryPink hover:bg-pink-50/30 hover:text-primaryPink"
                  >
                    Add Link
                    <span className="text-lg">＋</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4 max-lg:hidden">
              <Link
                href="/cp#manage-department"
                className="flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-white hover:opacity-80 transition-all duration-300"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="mb-2 font-semibold">Logo</label>
            <div className="relative overflow-hidden rounded-xl border bg-gray-50 aspect-square">
              {logo ? (
                <img
                  src={logo.image_url}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center italic text-gray-400">
                  No image (Recommended 1:1)
                </div>
              )}
              <div
                onClick={() => setOpenMedia(true)}
                className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition cursor-pointer"
              >
                <HiOutlinePencilAlt className="text-white text-2xl" />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setOpenMedia(true)}
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all duration-300"
              >
                <HiOutlineUpload /> {logo ? "Change Logo" : "Upload Logo"}
              </button>
              {logo && (
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  disabled={deletingLogo}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-100 transition-all duration-300"
                >
                  <HiOutlineTrash /> Delete Logo
                </button>
              )}
            </div>
            <div className="flex flex-col gap-4 mt-4 w-full">
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

            <div className="mt-12 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleResetForm}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primaryPink px-8 py-3 text-white rounded-lg hover:opacity-80 transition"
              >
                {isSubmitting ? "Adding..." : "Add Department"}
              </button>
            </div>
            <Link
              href="/cp#manage-department"
              className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white lg:hidden hover:opacity-80 transition-all duration-300"
            >
              <FaChevronLeft size={12} /> Back
            </Link>
          </div>
        </div>
        {openMedia && (
          <MediaSelector
            onClose={() => setOpenMedia(false)}
            onSelect={(photo) => {
              setLogo(photo);
              setValue("logo_id", photo.id);
              setOpenMedia(false);
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
            onFilter="department_id"
          />
        )}
        {/* Image preview modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
            onClick={() => setPreviewImage(null)}
          >
            <div
              className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4 landscape:max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage.image_url}
                alt={previewImage.id}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl landscape:max-h-[60vh]"
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
          label="Submitting Department Data"
          loaderStyle="loader-full-scr-dark"
        />
      </form>
    </div>
  );
}
