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
  url: string;
};

type FormValues = {
  id: string;
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

export default function EditDepartmentPage() {
  const { name: deptNameId } = useParams<{ name: string }>();
  const route = useRouter();
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const [initVal, setInitVal] = useState<DepartmentType | null>(null);
  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [initLogo, setInitLogo] = useState<PhotoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [descVal, setDescVal] = useState("");
  const [descMode, setDescMode] = useState<"edit" | "preview">("edit");

  const [deletingLogo, setDeletingLogo] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);

  const {
    register,
    formState: { isSubmitting },
    control,
    setValue,
    reset,
    handleSubmit,
  } = useForm<FormValues>();

  const handleDeleteLogo = async (): Promise<boolean> => {
    if (!logo?.id || !initVal?.id) return true;

    const confirmDelete = confirm(
      "Yakin? Logo akan dilepas dan gambar dihapus permanen.",
    );
    if (!confirmDelete) return false;

    setDeletingLogo(true);
    try {
      // 1. Unlink logo from department
      await api.put(`/department/${initVal.id}`, {
        ...initVal,
        logo_id: "",
      });

      // 2. Delete file from gallery
      await api.delete(`/gallery/${logo.id}`);

      // 3. Update state
      setLogo(null);
      setInitLogo(null);
      setValue("logo_id", "");

      alert("Logo berhasil dihapus");
      return true;
    } catch (err) {
      alert(`Gagal menghapus logo: ${getApiErrorMessage(err)}`);
      return false;
    } finally {
      setDeletingLogo(false);
    }
  };

  useEffect(() => {
    const fetchDept = async () => {
      setLoading(true);
      try {
        const resp = await api.get<ApiResponse<DepartmentType>>(
          `/department/${deptNameId}`,
        );
        const data = resp.data.data;

        const initialFormValues: FormValues = {
          id: data.id || "",
          name: data.name || "",
          description: data.description || "",
          logo_id: data.logo?.id || "",
          social_media_link: data.social_media_link || "",
          bank_soal_link: data.bank_soal_link || "",
          bank_ref_link: data.bank_ref_link || "",
          silabus_link: data.silabus_link || "",
        };

        reset(initialFormValues);
        setDescVal(data.description || "");
        setInitVal(data);

        if (data.logo?.id && data.logo?.image_url) {
          const photoData = {
            id: data.logo.id,
            image_url: data.logo.image_url,
          };
          setInitLogo(photoData);
          setLogo(photoData);
        }

        // Handle Links UI
        const mappedLinks: LinkProps[] = [];
        if (data.social_media_link) {
          mappedLinks.push({
            id: crypto.randomUUID(),
            type: "social_media_link",
            label: "Social Media",
            url: data.social_media_link,
          });
        }
        if (data.silabus_link) {
          mappedLinks.push({
            id: crypto.randomUUID(),
            type: "silabus_link",
            label: "Silabus",
            url: data.silabus_link,
          });
        }
        if (data.bank_soal_link) {
          mappedLinks.push({
            id: crypto.randomUUID(),
            type: "bank_soal_link",
            label: "Bank Soal",
            url: data.bank_soal_link,
          });
        }
        if (data.bank_ref_link) {
          mappedLinks.push({
            id: crypto.randomUUID(),
            type: "bank_ref_link",
            label: "Bank Referensi",
            url: data.bank_ref_link,
          });
        }
        setLinks(mappedLinks);
      } catch (err) {
        alert(`Gagal mengambil data: ${getApiErrorMessage(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDept();
  }, [deptNameId, reset]);

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
    const available = linkOpts.find((opt) => !used.includes(opt.type));
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

  const handleResetForm = () => {
    if (!initVal) return;
    reset({
      id: initVal.id || "",
      name: initVal.name || "",
      description: initVal.description || "",
      logo_id: initVal.logo?.id || "",
      social_media_link: initVal.social_media_link || "",
      bank_soal_link: initVal.bank_soal_link || "",
      bank_ref_link: initVal.bank_ref_link || "",
      silabus_link: initVal.silabus_link || "",
    });
    setDescVal(initVal.description || "");
    setLogo(initLogo);

    // Reset links
    const mappedLinks: LinkProps[] = [];
    if (initVal.social_media_link) {
      mappedLinks.push({
        id: crypto.randomUUID(),
        type: "social_media_link",
        label: "Social Media",
        url: initVal.social_media_link,
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

      await api.put(`/department/${payload.id}`, payload);
      alert("Berhasil menyimpan perubahan!");
      route.push("/admin#manage-department");
    } catch (err) {
      alert(`Gagal menyimpan perubahan: ${getApiErrorMessage(err)}`);
    }
  };

  if (loading) {
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
          className="mb-10 font-averia text-4xl font-bold text-black lg:text-5xl"
        >
          Edit Department
        </Typography>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* LEFT */}
          <div className="flex flex-1 flex-col gap-6 lg:max-w-[55%]">
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Nama Departemen
              </label>
              <input
                {...register("name")}
                className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                placeholder="Insert department name..."
              />
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
                          className="w-full min-h-[200px] bg-[#f8fafc] p-4 text-gray-800 font-medium focus:outline-none"
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
                        value={link.url}
                        onChange={(e) => updateLink(link.id, e.target.value)}
                        placeholder="https://..."
                        className="flex-1 rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
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

            <button
              className="mt-8 flex gap-4 max-lg:hidden"
              disabled={isSubmitting}
            >
              <Link
                href="/admin#manage-department"
                className="flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-white hover:opacity-80 transition-all duration-300"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </button>
          </div>
          {/* RIGHT */}
          <div className="flex-1 flex flex-col">
            <label className="mb-2 font-semibold text-black">Logo</label>
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
            <button
              className="mt-8 flex gap-4 lg:hidden"
              disabled={isSubmitting}
            >
              <Link
                href="/admin#manage-department"
                className="flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-white hover:opacity-80 transition-all duration-300"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </button>
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
      </form>
    </div>
  );
}
