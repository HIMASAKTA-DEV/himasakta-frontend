"use client";

import { useEffect, useRef, useState } from "react";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";

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

export default function AddDepartmentPage() {
  const route = useRouter();
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [descVal, setDescVal] = useState("");
  const [descMode, setDescMode] = useState<"edit" | "preview">("edit");

  const [deletingLogo, setDeletingLogo] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);

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

      alert("Logo berhasil dihapus");
    } catch (err) {
      alert(`Gagal menghapus logo: ${getApiErrorMessage(err)}`);
      return false;
    } finally {
      setDeletingLogo(false);
    }
    return true;
  };

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

      await api.post("/department", payload);

      alert("Departemen berhasil ditambahkan!");
      localStorage.removeItem("department_form_draft");
      route.push("/admin#manage-department");
    } catch (err) {
      alert(`Gagal menambahkan departemen: ${getApiErrorMessage(err)}`);
    }
  };

  const handleResetForm = () => {
    reset();
    setLinks([]);
    setDescVal("");
    setLogo(null);
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

  if (!isRestored) {
    return (
      <div className="flex items-center justify-center p-10 min-h-screen w-full">
        <SkeletonPleaseWait />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 lg:p-10">
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
                {descMode === "edit" && (
                  <>
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
                    </div>
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
                          className="w-full min-h-[200px] bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 focus:outline-none"
                          placeholder="Tulis markdown di sini..."
                        />
                      )}
                    />
                  </>
                )}
                {descMode === "preview" && (
                  <div className="w-full min-h-[200px] bg-[#f8fafc] p-4">
                    <MarkdownRenderer>{descVal}</MarkdownRenderer>
                  </div>
                )}
              </div>
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
                    className="border border-dashed rounded-xl py-3 hover:bg-gray-50 transition"
                  >
                    Add Link
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4 max-lg:hidden">
              <Link
                href="/admin#manage-department"
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
              href="/admin#manage-department"
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
        <LoadingFullScreen
          isSubmitting={isSubmitting}
          label="Submitting Department Data"
        />
      </form>
    </div>
  );
}
