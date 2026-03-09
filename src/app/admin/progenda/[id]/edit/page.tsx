"use client";

import MediaSelector from "@/components/admin/MediaSelector";
import Unauthorized_404 from "@/components/admin/Unauthorized_404";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import Typography from "@/components/Typography";
import api from "@/lib/axios";
import { useAdminAuth } from "@/services/admin/useAdminAuth";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { ApiResponse } from "@/types/api";
import { Media } from "@/types/commons/mediaType";
import { DepartmentType } from "@/types/data/DepartmentType";
import { ProgendaType, Timelines } from "@/types/data/ProgendaType";
import { UUID } from "crypto";
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
import Select, { StylesConfig } from "react-select";

type FormValues = ProgendaType;
type OptionType = { label?: string; value?: string };
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

const selectStyles: StylesConfig<OptionType, false> = {
  control: (base, state) => ({
    ...base,
    borderRadius: "0.5rem",
    minHeight: "42px",
    outline: "none",
    borderColor: state.isFocused ? "#D58A94" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 1px #D58A94" : "none",
    "&:hover": { borderColor: "#D58A94" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#D58A94"
      : state.isFocused
        ? "#fce7f3"
        : "white",
    color: state.isSelected ? "white" : "#111827",
    cursor: "pointer",
  }),
};

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

/**
 * In this page you need to operate crud timeline and crud progenda separately
 * Because the REST API design is like that
 */
function page() {
  const { id } = useParams();
  const route = useRouter();
  const [initVal, setInitVal] = useState<FormValues | null>(null);
  const [loadData, setLoadData] = useState(false);
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
  const [depts, setDepts] = useState<DepartmentType[]>([]);
  const [timelineForm, setTimelineForm] = useState({
    date: "",
    info: "",
    link: "",
  });
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [feeds, setFeeds] = useState<PhotoData[]>([]);
  const [delFeed, setDelFeed] = useState<PhotoData[]>([]);
  const [newFeeds, setNewFeeds] = useState<PhotoData[]>([]);
  const [editingFeeds, setEditingFeeds] = useState(false);
  const [previewImage, setPreviewImage] = useState<PhotoData | null>(null);
  const [initLinks, setInitLinks] = useState<LinkProps[]>([]);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
    setValue,
  } = useForm<FormValues>();

  const addFeeds = (photo: PhotoData) => {
    if (feeds.length >= 20) {
      alert("Maksimal 20 gambar!");
      return;
    }
    setFeeds((p) => [...p, photo]);
    setNewFeeds((p) => [...p, photo]);
  };

  const removeFeed = (photo: PhotoData) => {
    setFeeds((p) => p.filter((prev) => prev.id !== photo.id));
    setDelFeed((d) => [...d, photo]);
  };

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
        const [json, d] = await Promise.all([
          api.get<ApiResponse<ProgendaType>>(`/progenda/${id}`), // Tanpa await di sini
          GetAllDepts(1, 50), // Tanpa await di sini
        ]);
        setDepts(d.data);
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
          feeds: data.feeds || [],
        };

        // DEBUG
        console.log(mappedData);

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
        setFeeds(mappedData.feeds ?? []);
        // DEBUG WARNING: I set the id into some value to make CRUD easier, absolutely need to remove the id
        const mappingLinks: LinkProps[] = [
          {
            id: "1",
            type: "website_link",
            label: "Website",
            url: mappedData.website_link,
          },
          {
            id: "2",
            type: "instagram_link",
            label: "Instagram",
            url: mappedData.instagram_link,
          },
          {
            id: "3",
            type: "twitter_link",
            label: "Twitter/X",
            url: mappedData.twitter_link,
          },
          {
            id: "4",
            type: "linkedin_link",
            label: "LinkedIn",
            url: mappedData.linkedin_link,
          },
          {
            id: "5",
            type: "youtube_link",
            label: "YouTube",
            url: mappedData.youtube_link,
          },
        ];
        setLinks(mappingLinks);
        setInitLinks(mappingLinks);
        setDescVal(mappedData.description);
        setGoalVal(mappedData.goal);
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
      const payload: Partial<FormValues> = {};

      if (dirtyFields.name) payload.name = data.name;
      if (dirtyFields.description) payload.description = data.description;
      if (dirtyFields.goal) payload.goal = data.goal;
      if (dirtyFields.department_id) payload.department_id = data.department_id;

      // thumbnail
      if (thumbnail) payload.thumbnail_id = thumbnail.id;

      // links
      payload.website_link =
        links.find((l) => l.type === "website_link")?.url ?? "";
      payload.instagram_link =
        links.find((l) => l.type === "instagram_link")?.url ?? "";
      payload.twitter_link =
        links.find((l) => l.type === "twitter_link")?.url ?? "";
      payload.linkedin_link =
        links.find((l) => l.type === "linkedin_link")?.url ?? "";
      payload.youtube_link =
        links.find((l) => l.type === "youtube_link")?.url ?? "";

      // feeds
      payload.feeds = feeds.map((f) => ({
        id: f.id as UUID,
        image_url: "",
        caption: "",
        category: "",
        department_id: null,
        progenda_id: null,
        cabinet_id: null,
        created_at: "",
        updated_at: "",
        deleted_at: "",
      }));

      if (Object.keys(payload).length === 0) {
        alert("Tidak ada perubahan.");
        return;
      }

      await api.put(`/progenda/${id}`, payload);
      alert("Step 1: Progenda berhasil diupdate!");
      if (newFeeds) {
        try {
          await Promise.all(
            newFeeds.map((f) => {
              const payloadWithId = { ...f, progenda_id: id };
              console.log("Data yang akan dikirim:", payloadWithId); // DEBUG
              return api.put(`gallery/${f.id}`, payloadWithId);
            }),
          );
          alert("Step 2: Berhasil menambahkan feeds!");
        } catch (err) {
          alert(`Gagal menambahkan semua feeds: ${getApiErrorMessage(err)}`);
        }
      }

      if (delFeed) {
        try {
          await Promise.all(
            delFeed.map((f) => {
              const payloadWithId = { ...f, progenda_id: null };
              console.log("Data yang akan dikirim:", payloadWithId); // DEBUG
              return api.put(`gallery/${f.id}`, payloadWithId);
            }),
          );
          alert("Step 3: Berhasil menambahkan perubahan feeds!");
        } catch (err) {
          alert(
            `Gagal menambahkan semua perubahan feeds: ${getApiErrorMessage(err)}`,
          );
        }
      }
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
    if (!confirm("Hapus timeline ini? Tidak dapat dipulihkan")) return;

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
      await api.put(`/department/${initVal.id}`, {
        ...initVal,
        logo_id: "",
      });
      await api.delete(`/gallery/${thumbnail.id}`);
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

  // prevent scrolling when modal opened
  useEffect(() => {
    const isModalOpen = isSubmitting;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSubmitting]);

  const { jwtToken, ready } = useAdminAuth();
  if (!ready) return <SkeletonPleaseWait />;
  if (!jwtToken) return <Unauthorized_404 />;

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
            <Field label="Departemen">
              <Controller
                control={control}
                name="department_id"
                render={({ field }) => (
                  <Select
                    placeholder="Pilih Departemen"
                    styles={selectStyles}
                    options={depts.map((d) => ({ value: d.id, label: d.name }))}
                    value={
                      depts
                        .map((d) => ({ value: d.id, label: d.name }))
                        .find((o) => o.value === field.value) || null
                    }
                    onChange={(opt) => field.onChange(opt?.value ?? "")}
                    isClearable
                  />
                )}
              />
            </Field>
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

              <div className="mt-4 space-y-2 max-h-[240px] overflow-y-auto shadow-inner rounded-lg">
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
                href="/admin#manage-progenda"
                className="flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-white hover:opacity-80 transition-all duration-300"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </button>
          </div>
          {/* RIGHT */}
          <div className="flex-1 flex-col justify-center gap-8">
            <div className="flex flex-col gap-4">
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
                  <HiOutlineUpload />{" "}
                  {thumbnail ? "Change Logo" : "Upload Logo"}
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
              </div>
              <div className="flex flex-col gap-4 mt-4 w-full">
                {/* MANAGE FEEDS */}
                <div className="w-full flex flex-row justify-between items-center">
                  <label className="mb-2 font-semibold text-black">
                    Feeds/Galeri
                  </label>
                  <div className="text-sm italic text-gray-500">
                    Upload maksimum 20 gambar.
                  </div>
                </div>
                <div className="max-h-[320px] overflow-y-auto pr-2 space-y-2 rounded-xl p-3 bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-md border border-white/40 shadow-inner">
                  {feeds.length < 20 && (
                    <button
                      type="button"
                      onClick={() => setEditingFeeds(true)}
                      className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 bg-[#f8fafc] px-4 py-3 text-sm font-medium italic text-[#9BA5B7] hover:border-primaryPink hover:text-primaryPink w-full"
                    >
                      Add Image
                      <span className="text-lg">＋</span>
                    </button>
                  )}
                  {feeds.map((img) => (
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
                          onClick={() => removeFeed(img)}
                          className="text-red-500 text-sm hover:opacity-60"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!initVal) return;
                      reset({ ...initVal });
                      setDescVal(initVal.description ?? "");
                      setThumbnail(initVal.thumbnail ?? null);
                      setLinks(initLinks);
                      setFeeds(initVal.feeds ?? []);
                      setTimelines(initVal.timelines ?? []);
                      setGoalVal(initVal.goal ?? "");
                      setDelFeed([]);
                      alert("Berhasil direset!");
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
              <button
                className="mt-8 flex gap-4 lg:hidden"
                disabled={isSubmitting}
              >
                <Link
                  href="/admin#manage-progenda"
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
              <div className="bg-white w-[90vw] rounded-xl p-6 space-y-4">
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
                          type="button"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteTimeline(t.id)}
                          className="text-red-500 hover:opacity-60 transition"
                          type="button"
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
                    type="button"
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
          {editingFeeds && (
            <MediaSelector
              title="Upload Feeds (Beberapa gambar)"
              onClose={() => setEditingFeeds(false)}
              onSelect={(p) => {
                if (feeds.length >= 20) {
                  alert("Maksimal 20 gambar!");
                  return;
                }
                addFeeds(p);
              }}
              onFilter="progenda_id"
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
          {isSubmitting && (
            <div className="flex w-full min-h-screen items-center justify-center bg-black/50 backdrop-blur-sm fixed inset-0 cursor-not-allowed">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primaryPink border-t-transparent" />
                <p className="font-averia text-lg text-white">
                  Submitting Progenda Data...
                </p>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default page;
