"use client";
import toast from "react-hot-toast";

import { UUID } from "crypto";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { ApiResponse } from "@/types/api";
import { DepartmentType } from "@/types/data/DepartmentType";
import { ProgendaType, Timelines } from "@/types/data/ProgendaType";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FormValues, LinkProps, PhotoData, linkOpts } from "./type";

export default function useProgendaEdit() {
  // STATE
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

  // ACTION
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
      toast("Maksimal 20 gambar!");
      return;
    }

    const isDuplicate = feeds.some((f) => f.id === photo.id);

    if (isDuplicate) {
      toast("Gambar ini sudah ada dalam progenda ini!");
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
        toast.error(`Gagal memuat data: ${getApiErrorMessage(err)}`);
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
        toast("Tidak ada perubahan.");
        return;
      }

      await api.put(`/progenda/${id}`, payload);
      toast.success("Step 1: Progenda berhasil diupdate!");
      if (newFeeds) {
        try {
          await Promise.all(
            newFeeds.map((f) => {
              const payloadWithId = { ...f, progenda_id: id };
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

      if (delFeed) {
        try {
          await Promise.all(
            delFeed.map((f) => {
              const payloadWithId = { ...f, progenda_id: null };
              return api.put(`gallery/${f.id}`, payloadWithId);
            }),
          );
          toast.success("Step 3: Berhasil menambahkan perubahan feeds!");
        } catch (err) {
          toast.error(
            `Gagal menambahkan semua perubahan feeds: ${getApiErrorMessage(err)}`,
          );
        }
      }
      route.push("/cp#manage-progenda");
    } catch (err) {
      toast.error(`Gagal update progenda: ${getApiErrorMessage(err)}`);
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
      toast("Tanggal wajib diisi");
      return;
    }

    if (!timelineForm.info.trim()) {
      toast("Info timeline wajib diisi");
      return;
    }

    const sorted = [...timelines].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const lastDate = sorted[sorted.length - 1]?.date;

    if (!editingTimeline && lastDate) {
      if (new Date(timelineForm.date) <= new Date(lastDate)) {
        toast("Tanggal timeline harus urut");
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
      toast.error(`Gagal memperbarui data: ${getApiErrorMessage(err)}`);
    }
  };

  // Deleting timeline
  const deleteTimeline = async (timelineId: string) => {
    if (!confirm("Hapus timeline ini? Tidak dapat dipulihkan")) return;

    try {
      await api.delete(`/progenda/timeline/${timelineId}`);

      setTimelines((prev) => prev.filter((t) => t.id !== timelineId));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
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

      toast.success("Logo berhasil dihapus");
      return true;
    } catch (err) {
      toast.error(`Gagal menghapus logo: ${getApiErrorMessage(err)}`);
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

  return {
    state: {
      id,
      route,
      initVal,
      loadData,
      timelines,
      descVal,
      descMode,
      goalVal,
      goalMode,
      openTimelineModal,
      editingTimeline,
      openMedia,
      thumbnail,
      initThumbnail,
      deletingThumbnail,
      depts,
      timelineForm,
      links,
      feeds,
      delFeed,
      newFeeds,
      editingFeeds,
      previewImage,
      initLinks,
    },

    refs: {
      descRef,
      goalRef,
    },

    setters: {
      setInitVal,
      setLoadData,
      setTimelines,
      setDescVal,
      setDescMode,
      setGoalVal,
      setGoalMode,
      setOpenTimelineModal,
      setEditingTimeline,
      setOpenMedia,
      setThumbnail,
      setInitThumbnail,
      setDeletingThumbnail,
      setDepts,
      setTimelineForm,
      setLinks,
      setFeeds,
      setDelFeed,
      setNewFeeds,
      setEditingFeeds,
      setPreviewImage,
      setInitLinks,
    },

    actions: {
      addFeeds,
      removeFeed,
      addLink,
      updateLink,
      removeLink,
      saveTimeline,
      deleteTimeline,
      handleDeleteThumbnail,
      applyFormat,
      applyFormat2,
      onSubmit,
    },

    forms: {
      handleSubmit,
      register,
      control,
      formState: {
        isSubmitting,
        errors,
        dirtyFields,
      },
      reset,
      setValue,
    },
  };
}
