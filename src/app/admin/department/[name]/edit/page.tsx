"use client";

import { useEffect, useRef, useState } from "react";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft, FaCloudUploadAlt } from "react-icons/fa";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUpload,
} from "react-icons/hi";

import { UUID } from "crypto";
import Typography from "@/components/Typography";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { ApiResponse } from "@/types/commons/apiResponse";
import { DepartmentType } from "@/types/data/DepartmentType";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  url: string; // match with department type
};

type FormValues = {
  id: UUID | string;
  name: string;
  description: string;
  logo_id: UUID | string;
  social_media_link: string;
  bank_soal_link: string;
  silabus_link: string;
  bank_ref_link: string;
};

type PhotoData = {
  id: UUID | string;
  image_url: string;
};

export default function EditDepartmentPage() {
  const { name } = useParams<{ name: string }>();
  const route = useRouter();
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const [initVal, setInitVal] = useState<DepartmentType>();
  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [initLogo, setInitLogo] = useState<PhotoData | null>(null);
  const [_loadData, setLoadData] = useState(false);
  const [descVal, setDescVal] = useState("");
  const [descMode, setDescMode] = useState<"edit" | "preview">("edit");
  const [_preview, setPreview] = useState(false);
  const {
    register,
    formState: { isSubmitting },
    control,
    setValue,
    reset,
    handleSubmit,
  } = useForm<FormValues>();
  const [openUpload, setOpenUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [_logoDeleted, setLogoDeleted] = useState(false);

  const handleUploadLogo = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const resp = await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded: PhotoData = resp.data.data;

      setLogo(uploaded);
      setValue("logo_id", uploaded.id, { shouldValidate: true });
      setOpenUpload(false);

      alert("Berhasil upload logo");
    } catch (err) {
      alert(`Gagal upload logo: ${getApiErrorMessage(err)}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogo = async (): Promise<boolean> => {
    if (!logo?.id || !initVal?.id) return true;

    const confirmDelete = confirm(
      "Yakin? Logo akan dilepas dan gambar dihapus permanen.",
    );
    if (!confirmDelete) return false;

    try {
      setDeletingLogo(true);

      // 1️⃣ UNLINK LOGO DARI DEPARTMENT
      await api.put(`/department/${initVal.id}`, {
        ...initVal,
        logo_id: "",
      });

      // 2️⃣ DELETE FILE GALLERY
      await api.delete(`/gallery/${logo.id}`);

      // 3️⃣ UPDATE STATE FE
      setLogoDeleted(true);
      setLogo(null);
      setInitLogo(null);
      setValue("logo_id", "", { shouldDirty: true });

      alert("Logo berhasil dihapus");
      return true;
    } catch (err) {
      alert(`Gagal menghapus logo: ${getApiErrorMessage(err)}`);
      return false;
    } finally {
      setDeletingLogo(false);
    }
  };

  // FETCH DEPT BY ID
  useEffect(() => {
    const fetchDeptById = async () => {
      setLoadData(true);
      try {
        const resp = await api.get<ApiResponse<DepartmentType>>(
          `/department/${name}`,
        );
        const data = resp.data.data;
        reset({
          id: data.id,
          name: data.name,
          description: data.description,
          logo_id: data.logo?.id,
          social_media_link: data.social_media_link ?? "",
          bank_soal_link: data.bank_soal_link,
          bank_ref_link: data.bank_ref_link,
          silabus_link: data.silabus_link,
        });

        setDescVal(data.description ?? "");
        setInitVal(data);
        if (data.logo?.id && data.logo?.image_url) {
          setInitLogo({ id: data.logo.id, image_url: data.logo.image_url });
          setLogo({ id: data.logo.id, image_url: data.logo.image_url });
        }
      } catch (err) {
        alert(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
      } finally {
        setLoadData(false);
      }
    };

    fetchDeptById();
  }, []);

  // HANDLE MARKDOWN EDIT
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

  // HANDLE ADD LINKS UI
  const [links, setLinks] = useState<LinkProps[]>([]);

  // SYNC WITH INITVAl FOR EDIT MODE
  useEffect(() => {
    if (!initVal) return;

    const mappedLinks: LinkProps[] = [];

    if (initVal.social_media_link) {
      mappedLinks.push({
        id: crypto.randomUUID(),
        type: "social_media_link",
        label: "Social Media",
        url: initVal?.social_media_link,
      });
    }

    if (initVal.silabus_link) {
      mappedLinks.push({
        id: crypto.randomUUID(),
        type: "silabus_link",
        label: "Silabus",
        url: initVal.silabus_link,
      });
    }

    if (initVal.bank_soal_link) {
      mappedLinks.push({
        id: crypto.randomUUID(),
        type: "bank_soal_link",
        label: "Bank Soal",
        url: initVal.bank_soal_link,
      });
    }

    if (initVal.bank_ref_link) {
      mappedLinks.push({
        id: crypto.randomUUID(),
        type: "bank_ref_link",
        label: "Bank Referensi",
        url: initVal.bank_ref_link,
      });
    }

    setLinks(mappedLinks);
  }, [initVal]);

  // HANDLE RESET FORM
  const handleResetForm = () => {
    reset({
      ...initVal,
    });

    setLogo(initLogo);
    setOpenUpload(false);
  };

  const linkOpts: {
    type: DepartmentLinkType;
    label: string;
  }[] = [
    { type: "social_media_link", label: "Social Media" },
    { type: "silabus_link", label: "Silabus" },
    { type: "bank_soal_link", label: "Bank Soal" },
    { type: "bank_ref_link", label: "Bank Referensi" },
  ];

  const addLink = () => {
    const usedTypes = links.map((l) => l.type);
    const available = linkOpts.find((opt) => !usedTypes.includes(opt.type));

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

  // PUT CHANGES
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

      await api.put(`/department/${payload.id}`, payload);
      alert("Berhasil menyimpan perubahan!");
      route.push("/admin#manage-department");
    } catch (err) {
      alert(`Gagal menyimpan perubahan departemen: ${getApiErrorMessage(err)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 lg:p-10">
      <form className="mx-auto max-w-7xl" onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <Typography
          variant="h1"
          className="mb-10 font-averia text-4xl font-bold text-black lg:text-5xl"
        >
          Edit Department
        </Typography>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Left Column: Form */}
          <div className="flex flex-1 flex-col gap-6 lg:max-w-[55%]">
            {/* Name Field */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Nama Departemen
              </label>
              <input
                {...register("name")}
                placeholder="Insert post title..."
                className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
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
                      />
                    )}
                  />
                )}
              </div>
            </div>

            {/* DEPT LINKS */}
            <div>
              <label className="mb-3 block text-[15px] font-semibold text-black">
                Link
              </label>

              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <div key={link.id} className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">
                      {link.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.url ?? ""}
                        onChange={(e) => updateLink(link.id, e.target.value)}
                        placeholder="https://..."
                        className="flex-1 rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-sm font-medium text-gray-600 placeholder:italic placeholder:text-[#9BA5B7] focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                      />

                      <button
                        type="button"
                        onClick={() => removeLink(link.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {/* ADD BUTTON */}
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

            {/* Back Button */}
            <div className="mt-6">
              <button disabled={isSubmitting}>
                <Link
                  href="/admin#manage-department"
                  className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-white hover:opacity-80 transition-all duration-300 max-lg:hidden"
                >
                  <FaChevronLeft size={12} /> Back
                </Link>
              </button>
            </div>
          </div>

          {/* Dept Image */}
          <div className="flex-1 flex flex-col">
            <label className="mb-2 font-semibold">Photo</label>
            <div
              onClick={async () => {
                const ok = await handleDeleteLogo();
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
                onClick={async () => {
                  const ok = await handleDeleteLogo();
                  if (ok) setOpenUpload(true);
                }}
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all duration-300"
              >
                <HiOutlineUpload /> Change Image
              </button>
              {logo && (
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  disabled={deletingLogo}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-100 transition-all duration-300"
                >
                  <HiOutlineTrash /> Delete Image
                </button>
              )}
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
                {isSubmitting ? "Saving..." : "Save Gallery"}
              </button>
            </div>
            <button disabled={isSubmitting}>
              <Link
                href="/admin#manage-department"
                className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-sm font-medium text-white lg:hidden hover:opacity-80 transition-all duration-300"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </button>
          </div>
        </div>
        {/* Upload image modal */}
        {openUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
              <h2 className="text-lg font-semibold mb-4">Upload Image</h2>

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
                  if (file) handleUploadLogo(file);
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
                      handleUploadLogo(e.target.files[0]);
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
    </div>
  );
}
