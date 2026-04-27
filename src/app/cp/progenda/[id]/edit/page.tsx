"use client";
import toast from "react-hot-toast";

import Typography from "@/components/Typography";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import MediaSelector from "@/components/admin/MediaSelector";
import Unauthorized_404 from "@/components/admin/Unauthorized_404";
import VerifToken from "@/components/admin/VerifToken";
import MarkdownRenderer from "@/components/commons/MarkdownRenderer";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import { useAdminAuth } from "@/services/admin/useAdminAuth";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUpload,
} from "react-icons/hi";
import Select, { StylesConfig } from "react-select";
import useProgendaEdit from "./_page";
import { OptionType, linkOpts } from "./type";

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
  const { state, refs, setters, actions, forms } = useProgendaEdit();

  const { jwtToken, ready } = useAdminAuth();
  if (!ready) return <SkeletonPleaseWait />;
  if (!jwtToken) return <Unauthorized_404 />;

  if (state.loadData) {
    return (
      <LoadingFullScreen
        isSubmitting={true}
        label="Loading Progenda Data"
        styling="bg-white text-black"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 lg:p-10" data-lenis-prevent>
      <form
        className="mx-auto max-w-7xl"
        onSubmit={forms.handleSubmit(actions.onSubmit)}
      >
        <VerifToken />
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
                {...forms.register("name")}
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
                  onClick={() => setters.setDescMode("edit")}
                  className={`px-4 py-1.5 font-medium transition ${
                    state.descMode === "edit"
                      ? "bg-primaryPink text-white"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setters.setDescMode("preview")}
                  className={`px-4 py-1.5 font-medium transition ${
                    state.descMode === "preview"
                      ? "bg-primaryPink text-white"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#f8fafc]">
                {state.descMode === "edit" && (
                  <>
                    <div className="flex items-center gap-2 border-b px-3 py-2">
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          actions.applyFormat("**");
                          e.preventDefault();
                        }}
                      >
                        <BiBold size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          actions.applyFormat("*");
                          e.preventDefault();
                        }}
                      >
                        <BiItalic size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          actions.applyFormat("<u>", "</u>");
                        }}
                      >
                        <BiUnderline size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          actions.applyFormat("\n  - ", "");
                        }}
                      >
                        <AiOutlineUnorderedList size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          actions.applyFormat("\n  1. ", "");
                          e.preventDefault();
                        }}
                      >
                        <AiOutlineOrderedList size={18} />
                      </button>
                    </div>
                    <Controller
                      name="description"
                      control={forms.control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          ref={(el) => {
                            field.ref(el);
                            refs.descRef.current = el;
                          }}
                          value={state.descVal}
                          onChange={(e) => {
                            setters.setDescVal(e.target.value);
                            field.onChange(e.target.value);
                          }}
                          className="w-full min-h-[200px] bg-[#f8fafc] p-4 text-gray-800 font-medium focus:outline-none"
                          placeholder="Tulis markdown di sini..."
                        />
                      )}
                    />
                  </>
                )}
                {state.descMode === "preview" && (
                  <div className="w-full min-h-[200px] bg-[#f8fafc] p-4">
                    <MarkdownRenderer>{state.descVal}</MarkdownRenderer>
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
                  onClick={() => setters.setGoalMode("edit")}
                  className={`px-4 py-1.5 font-medium transition ${
                    state.goalMode === "edit"
                      ? "bg-primaryPink text-white"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setters.setGoalMode("preview")}
                  className={`px-4 py-1.5 font-medium transition ${
                    state.goalMode === "preview"
                      ? "bg-primaryPink text-white"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#f8fafc]">
                {state.goalMode === "edit" && (
                  <>
                    <div className="flex items-center gap-2 border-b px-3 py-2">
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          actions.applyFormat2("**");
                          e.preventDefault();
                        }}
                      >
                        <BiBold size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          actions.applyFormat2("*");
                          e.preventDefault();
                        }}
                      >
                        <BiItalic size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          actions.applyFormat2("<u>", "</u>");
                        }}
                      >
                        <BiUnderline size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          actions.applyFormat2("\n  - ", "");
                        }}
                      >
                        <AiOutlineUnorderedList size={18} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          actions.applyFormat2("\n  1. ", "");
                          e.preventDefault();
                        }}
                      >
                        <AiOutlineOrderedList size={18} />
                      </button>
                    </div>
                    <Controller
                      name="goal"
                      control={forms.control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          ref={(el) => {
                            field.ref(el);
                            refs.goalRef.current = el;
                          }}
                          value={state.goalVal}
                          onChange={(e) => {
                            setters.setGoalVal(e.target.value);
                            field.onChange(e.target.value);
                          }}
                          className="w-full min-h-[200px] bg-[#f8fafc] p-4 text-gray-800 font-medium focus:outline-none"
                          placeholder="Tulis markdown di sini..."
                        />
                      )}
                    />
                  </>
                )}
                {state.goalMode === "preview" && (
                  <div className="w-full min-h-[200px] bg-[#f8fafc] p-4">
                    <MarkdownRenderer>{state.goalVal}</MarkdownRenderer>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="mb-3 block text-[15px] font-semibold text-black">
                Links
              </label>

              <div className="flex flex-col gap-4">
                {state.links.map((link) => (
                  <div key={link.id} className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">
                      {link.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          actions.updateLink(link.id, e.target.value)
                        }
                        placeholder="https://..."
                        className="flex-1 rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                      />

                      <button
                        type="button"
                        onClick={() => actions.removeLink(link.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {state.links.length < linkOpts.length && (
                  <button
                    type="button"
                    onClick={actions.addLink}
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
                control={forms.control}
                name="department_id"
                render={({ field }) => (
                  <Select
                    placeholder="Pilih Departemen"
                    styles={selectStyles}
                    options={state.depts.map((d) => ({
                      value: d.id,
                      label: d.name,
                    }))}
                    value={
                      state.depts
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
                  onClick={() => setters.setOpenTimelineModal(true)}
                  className="bg-primaryPink px-3 py-2 text-white rounded-lg hover:opacity-80 transition"
                >
                  Manage Timeline
                </button>
              </div>

              <div
                className="mt-4 space-y-2 max-h-[240px] overflow-y-auto shadow-inner rounded-lg"
                data-lenis-prevent
              >
                {state.timelines.map((t) => (
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
              disabled={forms.formState.isSubmitting}
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
          <div className="flex-1 flex-col justify-center gap-8">
            <div className="flex flex-col gap-4">
              <label className="mb-2 font-semibold text-black">Logo</label>
              <div className="relative overflow-hidden rounded-xl border bg-gray-50 aspect-square">
                {state.thumbnail ? (
                  <img
                    src={state.thumbnail.image_url}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center italic text-gray-400">
                    No image (Recommended 1:1)
                  </div>
                )}
                <div
                  onClick={() => setters.setOpenMedia(true)}
                  className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                >
                  <HiOutlinePencilAlt className="text-white text-2xl" />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setters.setOpenMedia(true)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all duration-300"
                >
                  <HiOutlineUpload />{" "}
                  {state.thumbnail ? "Change Logo" : "Upload Logo"}
                </button>
                {state.thumbnail && (
                  <button
                    type="button"
                    onClick={actions.handleDeleteThumbnail}
                    disabled={state.deletingThumbnail}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-100 transition-all duration-300"
                  >
                    <HiOutlineTrash /> Delete Logo
                  </button>
                )}
              </div>
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
                  {state.feeds.length < 20 && (
                    <button
                      type="button"
                      onClick={() => setters.setEditingFeeds(true)}
                      className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 bg-[#f8fafc] px-4 py-3 text-sm font-medium italic text-[#9BA5B7] hover:border-primaryPink hover:text-primaryPink w-full"
                    >
                      Add Image
                      <span className="text-lg">＋</span>
                    </button>
                  )}
                  {state.feeds.map((img) => (
                    <div
                      key={img.id}
                      className="flex items-center gap-3 border rounded-lg p-2 w-full justify-between bg-gradient-to-r from-slate-100 to-white"
                    >
                      <div className="flex items-center w-full gap-2">
                        <img
                          src={img.image_url}
                          className="w-16 h-16 object-cover rounded-md hover:cursor-pointer"
                          onClick={() => setters.setPreviewImage(img)}
                        />
                        <p className="font-bold font-averia line-clamp-1">
                          {img.id}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setters.setPreviewImage(img)}
                          className="text-blue-600 text-sm hover:opacity-60"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => actions.removeFeed(img)}
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
                      if (!state.initVal) return;
                      forms.reset({ ...state.initVal });
                      setters.setDescVal(state.initVal.description ?? "");
                      setters.setThumbnail(state.initVal.thumbnail ?? null);
                      setters.setLinks(state.initLinks);
                      setters.setFeeds(state.initVal.feeds ?? []);
                      setters.setTimelines(state.initVal.timelines ?? []);
                      setters.setGoalVal(state.initVal.goal ?? "");
                      setters.setDelFeed([]);
                      toast.success("Berhasil direset!");
                    }}
                    disabled={forms.formState.isSubmitting}
                    className="px-8 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={forms.formState.isSubmitting}
                    className="bg-primaryPink px-10 py-3 text-white rounded-xl font-semibold shadow-lg shadow-pink-200 transition-all hover:opacity-90 hover:shadow-pink-300 active:scale-95 disabled:opacity-50"
                  >
                    {forms.formState.isSubmitting
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </div>
              <button
                className="mt-8 flex gap-4 lg:hidden"
                disabled={forms.formState.isSubmitting}
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
          {/* MANAGE TIMELINE MODAL */}
          {state.openTimelineModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-[90vw] rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-bold">Manage Timeline</h2>

                {/* LIST */}
                <div
                  className="space-y-2 max-h-60 overflow-y-auto"
                  data-lenis-prevent
                >
                  {state.timelines.map((t) => (
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
                            setters.setEditingTimeline(t);
                            setters.setTimelineForm({
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
                          onClick={() => actions.deleteTimeline(t.id)}
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
                    value={state.timelineForm.date}
                    onChange={(e) =>
                      setters.setTimelineForm({
                        ...state.timelineForm,
                        date: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2 text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  />

                  <input
                    placeholder="Info"
                    value={state.timelineForm.info}
                    onChange={(e) =>
                      setters.setTimelineForm({
                        ...state.timelineForm,
                        info: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2 text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  />

                  <input
                    placeholder="Link"
                    value={state.timelineForm.link}
                    onChange={(e) =>
                      setters.setTimelineForm({
                        ...state.timelineForm,
                        link: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2 text-gray-800 placeholder:italic placeholder:text-[#9BA5B7] transition-all focus:outline-none focus:ring-2 focus:ring-primaryPink/50"
                  />

                  <button
                    onClick={actions.saveTimeline}
                    className="bg-primaryPink px-3 py-2 text-white rounded-lg hover:opacity-80 transition w-full"
                    type="button"
                  >
                    {state.editingTimeline ? "Update Timeline" : "Add Timeline"}
                  </button>
                </div>

                <button
                  onClick={() => setters.setOpenTimelineModal(false)}
                  className="w-full border py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {state.openMedia && (
            <MediaSelector
              onClose={() => setters.setOpenMedia(false)}
              onSelect={(photo) => {
                setters.setThumbnail(photo);
                forms.setValue("thumbnail_id", photo.id);
                setters.setOpenMedia(false);
              }}
            />
          )}
          {state.editingFeeds && (
            <MediaSelector
              title="Upload Feeds (Beberapa gambar)"
              onClose={() => setters.setEditingFeeds(false)}
              onSelect={(p) => {
                if (state.feeds.length >= 20) {
                  toast("Maksimal 20 gambar!");
                  return;
                }
                actions.addFeeds(p);
              }}
              onFilter="progenda_id"
            />
          )}
          {/* Image preview modal */}
          {state.previewImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
              onClick={() => setters.setPreviewImage(null)}
            >
              <div
                className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4 landscape:max-w-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={state.previewImage.image_url}
                  alt={state.previewImage.id}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl landscape:max-h-[60vh]"
                />
                <p className="text-white text-center text-sm font-medium bg-black/40 px-4 py-2 rounded-lg">
                  {state.previewImage.id}
                </p>
                <button
                  onClick={() => setters.setPreviewImage(null)}
                  className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all text-gray-700 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          <LoadingFullScreen
            isSubmitting={forms.formState.isSubmitting}
            label="Submitting Progenda Data"
            loaderStyle="loader-full-scr-dark"
          />
        </div>
      </form>
    </div>
  );
}

export default page;
