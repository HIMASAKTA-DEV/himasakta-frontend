"use client";

import MediaSelector from "@/components/admin/MediaSelector";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import Typography from "@/components/Typography";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { ApiResponse } from "@/types/api";
import { ProgendaType, Timelines } from "@/types/data/ProgendaType";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

type FormValues = ProgendaType;

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

type ProgendaLinkType =
  | "website_link"
  | "instagram_link"
  | "twitter_link"
  | "linkedin_link"
  | "youtube_link";

type LinkProps = {
  id: string;
  type: ProgendaLinkType;
  label: string;
  url: string;
};

const linkOpts = [
  { type: "website_link", label: "Website" },
  { type: "instagram_link", label: "Instagram" },
  { type: "twitter_link", label: "Twitter" },
  { type: "linkedin_link", label: "LinkedIn" },
  { type: "youtube_link", label: "YouTube" },
] as const;

type PhotoData = {
  id: string;
  image_url: string;
};

/**
 * In this page you need to operate crud timeline and crud progenda separately
 * Because the REST API design is like that
 */
function page() {
  const { id } = useParams();
  const route = useRouter();
  const [initVal, setInitVal] = useState<FormValues | null>(null);
  const [loadData, setLoadData] = useState(false);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
    setValue,
  } = useForm<FormValues>();
  const [timelines, setTimelines] = useState<Timelines[]>([]);
  const [descVal, setDescVal] = useState("");
  const [descMode, setDescMode] = useState<"edit" | "preview">("edit");
  const [goalVal, setGoalVal] = useState("");
  const [goalMode, setGoalMode] = useState<"edit" | "preview">("edit");
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const goalRef = useRef<HTMLTextAreaElement | null>(null);
  const [openTimelineModal, setOpenTimelineModal] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<Timelines | null>(
    null,
  );
  const [openMedia, setOpenMedia] = useState(false);
  const [thumbnail, setThumbnail] = useState<PhotoData | null>(null);
  const [initThumbnail, setInitThumbnail] = useState<PhotoData | null>(null);
  const [deletingThumbnail, setDeletingThumbnail] = useState(false);

  const [timelineForm, setTimelineForm] = useState({
    date: "",
    info: "",
    link: "",
  });
  const [links, setLinks] = useState<LinkProps[]>([]);

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

  useEffect(() => {
    const fetchProgendaData = async () => {
      setLoadData(true);
      try {
        const json = await api.get<ApiResponse<ProgendaType>>(
          `/progenda/${id}`,
        );
        const data = json.data.data;
        // Thanks Gemini
        const mappedData: ProgendaType = {
          id: data.id || "",
          name: data.name || "",
          description: data.description || "",
          goal: data.goal || "",
          thumbnail_id: data.thumbnail_id || null,
          thumbnail: data.thumbnail || null,
          website_link: data.website_link || "",
          instagram_link: data.instagram_link || "",
          twitter_link: data.twitter_link || "",
          linkedin_link: data.linkedin_link || "",
          youtube_link: data.youtube_link || "",
          department_id: data.department_id || null,
          department: data.department || null,
          timelines: data.timelines || [],
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
          DeletedAt: data.DeletedAt || null,
        };

        setInitVal(mappedData);
        reset(mappedData);
        setTimelines(mappedData.timelines ?? []);
        if (data.thumbnail?.id && data.thumbnail?.image_url) {
          const photoData = {
            id: data.thumbnail.id,
            image_url: data.thumbnail.image_url,
          };
          setInitThumbnail(photoData);
          setThumbnail(photoData);
        }
      } catch (err) {
        console.error(err);
        alert(`Gagal memuat data: ${getApiErrorMessage(err)}`);
      } finally {
        setLoadData(false);
      }
    };
    fetchProgendaData();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        website_link: links.find((l) => l.type === "website_link")?.url ?? "",
        instagram_link:
          links.find((l) => l.type === "instagram_link")?.url ?? "",
        twitter_link: links.find((l) => l.type === "twitter_link")?.url ?? "",
        linkedin_link: links.find((l) => l.type === "linkedin_link")?.url ?? "",
        youtube_link: links.find((l) => l.type === "youtube_link")?.url ?? "",
      };

      await api.put(`/progenda/${data.id}`, payload);

      alert("Progenda berhasil diupdate!");
      route.push("/admin#manage-progenda");
    } catch (err) {
      alert(`Gagal update progenda: ${getApiErrorMessage(err)}`);
    }
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

  const applyFormat2 = (before: string, after = before) => {
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

  // SAVING TIMELINE
  const saveTimeline = async () => {
    // VALIDATION
    if (!timelineForm.date) {
      alert("Tanggal wajib diisi");
      return;
    }

    if (!timelineForm.info.trim()) {
      alert("Info timeline wajib diisi");
      return;
    }

    const sorted = [...timelines].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const lastDate = sorted[sorted.length - 1]?.date;

    if (!editingTimeline && lastDate) {
      if (new Date(timelineForm.date) <= new Date(lastDate)) {
        alert("Tanggal timeline harus urut");
        return;
      }
    }

    try {
      if (editingTimeline) {
        const payload = {
          ...timelineForm,
          date: new Date(timelineForm.date).toISOString(),
        };

        const res = await api.put(
          `/progenda/timeline/${editingTimeline.id}`,
          payload,
        );

        setTimelines((prev) =>
          prev.map((t) => (t.id === editingTimeline.id ? res.data.data : t)),
        );

        setEditingTimeline(null);
      } else {
        const payload = {
          ...timelineForm,
          date: new Date(timelineForm.date).toISOString(),
        };

        const res = await api.post(`/progenda/${id}/timeline`, payload);

        setTimelines((prev) => [...prev, res.data.data]);
      }

      setTimelineForm({ date: "", info: "", link: "" });
    } catch (err) {
      alert(`Gagal memperbarui data: ${getApiErrorMessage(err)}`);
    }
  };

  // Deleting timeline
  const deleteTimeline = async (timelineId: string) => {
    if (!confirm("Delete this timeline?")) return;

    try {
      await api.delete(`/progenda/timeline/${timelineId}`);

      setTimelines((prev) => prev.filter((t) => t.id !== timelineId));
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  const handleDeleteThumbnail = async (): Promise<boolean> => {
    if (!thumbnail?.id || !initVal?.id) return true;

    const confirmDelete = confirm(
      "Yakin? Logo akan dilepas dan gambar dihapus permanen.",
    );
    if (!confirmDelete) return false;

    setDeletingThumbnail(true);
    try {
      // 1. Unlink logo from department
      await api.put(`/department/${initVal.id}`, {
        ...initVal,
        logo_id: "",
      });

      // 2. Delete file from gallery
      await api.delete(`/gallery/${thumbnail.id}`);

      // 3. Update state
      setThumbnail(null);
      setInitThumbnail(null);
      setValue("thumbnail_id", "");

      alert("Logo berhasil dihapus");
      return true;
    } catch (err) {
      alert(`Gagal menghapus logo: ${getApiErrorMessage(err)}`);
      return false;
    } finally {
      setDeletingThumbnail(false);
    }
  };

  if (loadData) {
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
          Edit Progenda
        </Typography>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* LEFT */}
          <div className="flex flex-1 flex-col gap-6 lg:max-w-[55%]">
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Nama Progenda
              </label>
              <input
                {...register("name")}
                className="w-full rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 font-medium text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                placeholder="Insert progenda name..."
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

            {/* GOAL */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-black">
                Tujuan
              </label>
              <div className="flex w-44 rounded-lg border overflow-hidden text-sm my-2">
                <button
                  type="button"
                  onClick={() => setGoalMode("edit")}
                  className={`px-4 py-1.5 font-medium transition ${
                    goalMode === "edit"
                      ? "bg-primaryPink text-white"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setGoalMode("preview")}
                  className={`px-4 py-1.5 font-medium transition ${
                    goalMode === "preview"
                      ? "bg-primaryPink text-white"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#f8fafc]">
                {goalMode === "edit" && (
                  <>
                    <div className="flex items-center gap-2 border-b px-3 py-2">
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          applyFormat2("**");
                          e.preventDefault();
                        }}
                      >
                        <BiBold size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          applyFormat2("*");
                          e.preventDefault();
                        }}
                      >
                        <BiItalic size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyFormat2("<u>", "</u>");
                        }}
                      >
                        <BiUnderline size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyFormat2("\n  - ", "");
                        }}
                      >
                        <AiOutlineUnorderedList size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          applyFormat2("\n  1. ", "");
                          e.preventDefault();
                        }}
                      >
                        <AiOutlineOrderedList size={18} />
                      </button>
                    </div>
                    <Controller
                      name="goal"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          ref={(el) => {
                            field.ref(el);
                            goalRef.current = el;
                          }}
                          value={goalVal}
                          onChange={(e) => {
                            setGoalVal(e.target.value);
                            field.onChange(e.target.value);
                          }}
                          className="w-full min-h-[200px] bg-[#f8fafc] p-4 text-gray-800 font-medium focus:outline-none"
                          placeholder="Tulis markdown di sini..."
                        />
                      )}
                    />
                  </>
                )}
                {goalMode === "preview" && (
                  <div className="w-full min-h-[200px] bg-[#f8fafc] p-4">
                    <MarkdownRenderer>{goalVal}</MarkdownRenderer>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="mb-3 block text-[15px] font-semibold text-black">
                Links
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
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <label className="mb-2 block text-[15px] font-semibold text-black">
                  Timeline Progenda
                </label>

                <button
                  type="button"
                  onClick={() => setOpenTimelineModal(true)}
                  className="bg-primaryPink px-3 py-2 text-white rounded-lg hover:opacity-80 transition"
                >
                  Manage Timeline
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {timelines.map((t) => (
                  <div
                    key={t.id}
                    className="border rounded-lg p-3 flex justify-between"
                  >
                    <div>
                      <p className="font-medium">{t.info}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
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
              {thumbnail ? (
                <img
                  src={thumbnail.image_url}
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
                <HiOutlineUpload /> {thumbnail ? "Change Logo" : "Upload Logo"}
              </button>
              {thumbnail && (
                <button
                  type="button"
                  onClick={handleDeleteThumbnail}
                  disabled={deletingThumbnail}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-100 transition-all duration-300"
                >
                  <HiOutlineTrash /> Delete Logo
                </button>
              )}
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
          {/* MANAGE TIMELINE MODAL */}
          {openTimelineModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-[600px] rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-bold">Manage Timeline</h2>

                {/* LIST */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {timelines.map((t) => (
                    <div
                      key={t.id}
                      className="border rounded-lg p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{t.info}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(t.date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTimeline(t);
                            setTimelineForm({
                              date: t.date.slice(0, 10),
                              info: t.info,
                              link: t.link,
                            });
                          }}
                          className="text-blue-500 hover:opacity-60 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteTimeline(t.id)}
                          className="text-red-500 hover:opacity-60 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FORM */}
                <div className="space-y-3 border-t pt-4">
                  <input
                    type="date"
                    value={timelineForm.date}
                    onChange={(e) =>
                      setTimelineForm({ ...timelineForm, date: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  />

                  <input
                    placeholder="Info"
                    value={timelineForm.info}
                    onChange={(e) =>
                      setTimelineForm({ ...timelineForm, info: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  />

                  <input
                    placeholder="Link"
                    value={timelineForm.link}
                    onChange={(e) =>
                      setTimelineForm({ ...timelineForm, link: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  />

                  <button
                    onClick={saveTimeline}
                    className="bg-primaryPink px-3 py-2 text-white rounded-lg hover:opacity-80 transition w-full"
                  >
                    {editingTimeline ? "Update Timeline" : "Add Timeline"}
                  </button>
                </div>

                <button
                  onClick={() => setOpenTimelineModal(false)}
                  className="w-full border py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {openMedia && (
            <MediaSelector
              onClose={() => setOpenMedia(false)}
              onSelect={(photo) => {
                setThumbnail(photo);
                setValue("thumbnail_id", photo.id);
                setOpenMedia(false);
              }}
            />
          )}
        </div>
      </form>
    </div>
  );
}

export default page;
