"use client";
import toast from "react-hot-toast";

import Typography from "@/components/Typography";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import MediaSelector from "@/components/admin/MediaSelector";
import Unauthorized_404 from "@/components/admin/Unauthorized_404";
import VerifToken from "@/components/admin/VerifToken";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { useAdminAuth } from "@/services/admin/useAdminAuth";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { ApiResponse } from "@/types/api";
import { DepartmentType } from "@/types/data/DepartmentType";
import { ProgendaType, Timelines } from "@/types/data/ProgendaType";
import Link from "next/link";
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

type _FormTimeline = Omit<Timelines, "progenda_id">;
type FormTimeline = Omit<_FormTimeline, "id">;

type FormValues = Omit<ProgendaType, "timelines"> & {
  timelines: FormTimeline[];
};

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
  { type: "twitter_link", label: "Twitter/X" },
  { type: "linkedin_link", label: "LinkedIn" },
  { type: "youtube_link", label: "YouTube" },
] as const;

type PhotoData = {
  id: string;
  image_url: string;
};

type OptionType = { label?: string; value?: string };

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

/**
 * In this page you need to operate crud timeline and crud progenda separately
 * Because the REST API design is like that
 */
function page() {
  const [initVal, _setInitVal] = useState<FormValues | null>(null);
  const [loadData, _setLoadData] = useState(false);
  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      department_id: "",
      name: "",
      goal: "",
      description: "",
      twitter_link: "",
      website_link: "",
      instagram_link: "",
      linkedin_link: "",
      youtube_link: "",
    },
  });
  const [descVal, setDescVal] = useState("");
  const [descMode, setDescMode] = useState<"edit" | "preview">("edit");
  const [goalVal, setGoalVal] = useState("");
  const [goalMode, setGoalMode] = useState<"edit" | "preview">("edit");
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const goalRef = useRef<HTMLTextAreaElement | null>(null);
  const [openMedia, setOpenMedia] = useState(false);
  const [thumbnail, setThumbnail] = useState<PhotoData | null>(null);
  const [_initThumbnail, setInitThumbnail] = useState<PhotoData | null>(null);
  const [deletingThumbnail, setDeletingThumbnail] = useState(false);
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [depts, setDepts] = useState<DepartmentType[]>([]);
  const [feeds, setFeeds] = useState<PhotoData[]>([]);
  const [editingFeeds, setEditingFeeds] = useState(false);
  const [previewImage, setPreviewImage] = useState<PhotoData | null>(null);
  const [openTimelineModal, setOpenTimelineModal] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<FormTimeline | null>(
    null,
  );
  const [timelineForm, setTimelineForm] = useState<FormTimeline>({
    created_at: "",
    updated_at: "",
    DeletedAt: null,
    date: "",
    info: "",
    link: "",
  });
  const [timelines, setTimelines] = useState<FormTimeline[]>([]);
  const STORAGE_KEY = "progenda_draft";

  // LOAD DRAFT
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw);

      if (draft.descVal) setDescVal(draft.descVal);
      if (draft.goalVal) setGoalVal(draft.goalVal);
      if (draft.links) setLinks(draft.links);
      if (draft.thumbnail) setThumbnail(draft.thumbnail);
      if (draft.timelines) setTimelines(draft.timelines);

      if (draft.formValues) {
        reset(draft.formValues);
      }
    } catch {
      console.warn("Draft parse error");
    }
  }, [reset]);

  // AUTO SAVE DRAFT
  useEffect(() => {
    const draft = {
      descVal,
      goalVal,
      links,
      thumbnail,
      timelines,
      formValues: {
        department_id: "",
        name: "",
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [descVal, goalVal, links, thumbnail, timelines]);

  const addFeeds = (photo: PhotoData) => {
    if (feeds.length >= 20) {
      toast("Maksimal 20 gambar!");
      return;
    }
    const isDuplicate = feeds.some((f) => f.id === photo.id);

    if (isDuplicate) {
      toast("Gambar ini sudah ada dalam progenda ini!");
      return;
    }

    setFeeds((p) => [...p, photo]);
  };

  const removeFeed = (id: string) => {
    setFeeds((p) => p.filter((photo) => photo.id !== id));
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

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        description: descVal,
        goal: goalVal,
        thumbnail_id: thumbnail?.id ?? null,
        timelines: timelines.map((t) => ({
          ...t,
          created_at: new Date(t.created_at).toISOString(),
          updated_at: new Date(t.updated_at).toISOString(),
          date: new Date(t.date).toISOString(),
        })),
        website_link: links.find((l) => l.type === "website_link")?.url ?? "",
        instagram_link:
          links.find((l) => l.type === "instagram_link")?.url ?? "",
        twitter_link: links.find((l) => l.type === "twitter_link")?.url ?? "",
        linkedin_link: links.find((l) => l.type === "linkedin_link")?.url ?? "",
        youtube_link: links.find((l) => l.type === "youtube_link")?.url ?? "",
      };

      const resJson = await api.post<ApiResponse<ProgendaType>>(
        "/progenda",
        payload,
      );

      const newId = resJson.data.data.id;

      toast.success("Step 1: Progenda berhasil dibuat!");
      localStorage.removeItem(STORAGE_KEY);
      if (feeds) {
        try {
          await Promise.all(
            feeds.map((f) => {
              const payloadWithId = { ...f, progenda_id: newId };
              return api.put(`gallery/${f.id}`, payloadWithId);
            }),
          );
          toast.success("Step 2: Berhasil menambahkan feeds!");
        } catch (err) {
          toast.error(
            `Gagal menambahkan semua feeds: ${getApiErrorMessage(err)}`,
          );
        }
      }
    } catch (err) {
      toast.error(`Gagal membuat progenda: ${getApiErrorMessage(err)}`);
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
    if (!goalRef.current) return;
    const el = goalRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = goalVal.slice(start, end);
    const newValue =
      goalVal.slice(0, start) + before + selected + after + goalVal.slice(end);
    setGoalVal(newValue);
    setValue("goal", newValue);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    }, 0);
  };

  const handleDeleteThumbnail = async (): Promise<boolean> => {
    if (!thumbnail?.id || !initVal?.id) return true;

    const confirmDelete = confirm(
      "Yakin? Logo akan dilepas dan gambar dihapus permanen.",
    );
    if (!confirmDelete) return false;

    setDeletingThumbnail(true);
    try {
      // 1. Unlink logo from progenda
      await api.put(`/progenda/${initVal.id}`, {
        ...initVal,
        logo_id: "",
      });

      // 2. Delete file from gallery
      await api.delete(`/gallery/${thumbnail.id}`);

      // 3. Update state
      setThumbnail(null);
      setInitThumbnail(null);
      setValue("thumbnail_id", "");

      toast.success("Logo berhasil dihapus");
      return true;
    } catch (err) {
      toast.error(`Gagal menghapus logo: ${getApiErrorMessage(err)}`);
      return false;
    } finally {
      setDeletingThumbnail(false);
    }
  };

  useEffect(() => {
    const fetchDepts = async () => {
      const d = await GetAllDepts(1, 50);
      setDepts(d.data);
    };
    fetchDepts();
  }, []);

  // HANDLE SAVING TIMELINE
  const saveTimeline = () => {
    // VALIDATION
    if (!timelineForm.date) {
      toast("Tanggal wajib diisi");
      return;
    }

    if (!timelineForm.info.trim()) {
      toast("Info timeline wajib diisi");
      return;
    }

    if (!editingTimeline) {
      const tmps: FormTimeline[] = [...timelines];
      tmps.push({ ...timelineForm });
      setTimelines(tmps);
    } else {
      const updatedTl: FormTimeline[] = timelines.map((t) => {
        return t.created_at === editingTimeline.created_at
          ? { ...timelineForm }
          : t;
      });

      setTimelines(updatedTl);
      setEditingTimeline(null);
    }

    setTimelineForm({
      created_at: "",
      updated_at: "",
      DeletedAt: null,
      date: "",
      info: "",
      link: "",
    });
  };

  // HANDLE DEL TIMELINE
  const deleteTimeline = (crt: string) => {
    const tmps: FormTimeline[] = [...timelines].filter(
      (d) => d.created_at !== crt,
    );
    setTimelines(tmps);
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
      <LoadingFullScreen
        isSubmitting={true}
        label="Loading Progenda Data"
        styling="bg-white text-black"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 lg:p-10">
      <form className="mx-auto max-w-7xl" onSubmit={handleSubmit(onSubmit)}>
        <VerifToken />
        <Typography
          variant="h1"
          className="mb-10 font-averia text-4xl font-bold text-black lg:text-5xl"
        >
          Add Progenda
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
              <div
                className="mt-4 space-y-2 max-h-[240px] overflow-y-auto shadow-inner rounded-lg"
                data-lenis-prevent
              >
                {timelines.map((t, idx) => (
                  <div
                    key={idx}
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
                href="/cp#manage-progenda"
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
              <div className="flex flex-col gap-4 mt-4 w-full">
                {/* MANAGE FEEDS */}
                <div className="w-full flex flex-row lg:justify-between lg:items-center mb-0 max-lg:flex-col">
                  <label className="font-semibold text-black">
                    Feeds/Galeri
                  </label>
                  <div className="text-sm italic text-gray-500">
                    Upload maksimum 20 gambar. Tidak disimpan sementara
                  </div>
                </div>
                <div
                  className="max-h-[320px] overflow-y-auto pr-2 space-y-2 rounded-xl p-3 bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-md border border-white/40 shadow-inner"
                  data-lenis-prevent
                >
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
                          onClick={() => removeFeed(img.id)}
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
                      reset();
                      setDescVal("");
                      setThumbnail(null);
                      setFeeds([]);
                      setGoalVal("");
                      setLinks([]);
                      setTimelines([]);
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
                  href="/cp#manage-progenda"
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
                  toast("Maksimal 20 gambar!");
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
          {/* MANAGE TIMELINE MODAL */}
          {openTimelineModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-[90vw] rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-bold">Manage Timeline</h2>

                {/* LIST */}
                <div
                  className="space-y-2 max-h-60 overflow-y-auto"
                  data-lenis-prevent
                >
                  {timelines.map((t, idx) => (
                    <div
                      key={idx}
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
                              created_at: new Date().toISOString(),
                              updated_at: new Date().toISOString(),
                              date: t.date ? t.date.split("T")[0] : "", // Ambil bagian tanggal saja
                              info: t.info,
                              link: t.link,
                              DeletedAt: null,
                            });
                          }}
                          className="text-blue-500 hover:opacity-60 transition"
                          type="button"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteTimeline(t.created_at)}
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
                      setTimelineForm({
                        ...timelineForm,
                        link: e.target.value,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      })
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
          <LoadingFullScreen
            isSubmitting={isSubmitting}
            label="Submitting Progenda Data"
            loaderStyle="loader-full-scr-dark"
          />
        </div>
      </form>
    </div>
  );
}

export default page;
