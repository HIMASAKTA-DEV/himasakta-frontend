"use client";

import HeaderSection from "@/components/commons/HeaderSection";
import Typography from "@/components/Typography";
import api from "@/lib/axios";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { CrudProgendaType } from "@/types/admin/CrudProgenda";
import { CrudTimelineType } from "@/types/admin/CrudTimelines";
import { ApiResponse } from "@/types/commons/apiResponse";
import { DepartmentType } from "@/types/data/DepartmentType";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StylesConfig } from "react-select";
import Select from "react-select";

type OptionType = {
  label?: string;
  value?: string;
};

const selectStyles: StylesConfig<OptionType, false> = {
  control: (base, state) => ({
    ...base,
    borderRadius: "0.5rem",
    minHeight: "42px",
    outline: "none",
    borderColor: state.isFocused ? "#D58A94" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 1px #D58A94" : "none",
    "&:hover": {
      borderColor: "#D58A94",
    },
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
  singleValue: (base) => ({
    ...base,
    color: "#111827",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
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

function page() {
  const [descVal, setDescVal] = useState("");
  const [arrTimelines, setArrTimelines] = useState<CrudTimelineType[]>([]);
  const [depts, setDepts] = useState<DepartmentType[]>([]);
  const [loadingDept, setLoadingDepts] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm<CrudProgendaType>({
    defaultValues: {
      name: "",
      thumbnail_id: "",
      goal: "",
      description: "",
      website_link: "",
      instagram_link: "",
      twitter_link: "",
      linkedin_link: "",
      youtube_link: "",
      department_id: "",
      timelines: [],
    },
  });

  // FOR MAIN FORM ADD
  const onSubmit = async (data: CrudProgendaType) => {
    try {
      const payload: CrudProgendaType = {
        ...data,
        timelines: arrTimelines,
        description: descVal,
      };
      await api.post<ApiResponse<CrudProgendaType>>("/progenda", payload);
      alert("Berhasil menambahkan progenda baru!");
    } catch (err) {
      alert(`Gagal menambahkan progenda baru: ${getApiErrorMessage(err)}`);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoadingDepts(true);
      try {
        const d = await GetAllDepts(1, 50);
        setDepts(d.data);
      } finally {
        setLoadingDepts(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 lg:p-10">
      <form className="mx-auto max-w-7xl" onSubmit={handleSubmit(onSubmit)}>
        <Typography
          variant="h1"
          className="mb-10 font-averia text-4xl font-bold lg:text-5xl"
        >
          Add Progenda
        </Typography>
        <div className="flex flex-col lg:flex-row gap-12 md:gap-16">
          {/* LEFT */}
          <div className="flex-1 lg:max-w-[55%] flex flex-col gap-6">
            {/* TITLE */}
            <div>
              <label className="block font-semibold mb-2">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", { required: "Nama wajib diisi" })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
                placeholder="Insert progenda name..."
              />
              {errors.name?.message && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">
                Tujuan/Goal <span className="text-red-500">*</span>
              </label>
              <input
                {...register("goal", { required: "Tujuan wajib diisi" })}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
                placeholder="Insert progenda goal..."
              />
              {errors.goal?.message && (
                <p className="text-sm text-red-500">{errors.goal.message}</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">Instagram Link</label>
              <input
                {...register("instagram_link")}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
                placeholder="Insert instagram link..."
              />
              {errors.instagram_link?.message && (
                <p className="text-sm text-red-500">
                  {errors.instagram_link.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">Twitter Link</label>
              <input
                {...register("twitter_link")}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
                placeholder="Insert twitter link..."
              />
              {errors.twitter_link?.message && (
                <p className="text-sm text-red-500">
                  {errors.twitter_link.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">Linkendin Link</label>
              <input
                {...register("linkedin_link")}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
                placeholder="Insert linkedin link..."
              />
              {errors.linkedin_link?.message && (
                <p className="text-sm text-red-500">
                  {errors.linkedin_link.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">Youtube Link</label>
              <input
                {...register("youtube_link")}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
                placeholder="Insert youtube link..."
              />
              {errors.youtube_link?.message && (
                <p className="text-sm text-red-500">
                  {errors.youtube_link.message}
                </p>
              )}
            </div>
            <Field label="Departemen" required>
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
            {/* CONTENT */}
                        <div>
                          <label className="block font-semibold mb-2">Content</label>
            
                          {/* TOGGLE */}
                          <div className="flex w-44 rounded-lg border overflow-hidden text-sm mb-2">
                            <button
                              type="button"
                              onClick={() => setDescMode("edit")}
                              className={`flex-1 py-1 ${
                                descMode === "edit" ? "bg-primaryPink text-white" : ""
                              }`}
                            >
                              Markdown
                            </button>
                            <button
                              type="button"
                              onClick={() => setDescMode("preview")}
                              className={`flex-1 py-1 ${
                                descMode === "preview" ? "bg-primaryPink text-white" : ""
                              }`}
                            >
                              Preview
                            </button>
                          </div>
            
                          <div className="rounded-xl border bg-[#f8fafc]">
                            {descMode === "edit" && (
                              <>
                                {/* TOOLBAR */}
                                <div className="flex gap-2 border-b p-2">
                                  <button
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      applyFormat("**");
                                    }}
                                  >
                                    <BiBold />
                                  </button>
                                  <button
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      applyFormat("*");
                                    }}
                                  >
                                    <BiItalic />
                                  </button>
                                  <button
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      applyFormat("<u>", "</u>");
                                    }}
                                  >
                                    <BiUnderline />
                                  </button>
                                  <button
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      applyFormat("\n- ", "");
                                    }}
                                  >
                                    <AiOutlineUnorderedList />
                                  </button>
                                  <button
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      applyFormat("\n1. ", "");
                                    }}
                                  >
                                    <AiOutlineOrderedList />
                                  </button>
                                </div>
            
                                <textarea
                                  ref={descRef}
                                  value={descVal}
                                  onChange={(e) => {
                                    setDescVal(e.target.value);
                                    setValue("content", e.target.value, {
                                      shouldDirty: true,
                                    });
                                  }}
                                  rows={6}
                                  placeholder="Cotent goes here..."
                                  className="w-full bg-[#f8fafc] rounded-xl px-4 py-3 placeholder:text-[#9BA5B7] placeholder:italic text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all font-medium"
                                />
                              </>
                            )}
            
                            {descMode === "preview" && (
                              <div className="prose px-4 py-3">
                                <MarkdownRenderer>
                                  {descVal || "_Tidak ada konten_"}
                                </MarkdownRenderer>
                              </div>
                            )}
                          </div>
            
                          {/* hidden field for RHF */}
                          <input
                            type="hidden"
                            {...register("content", {
                              required: "Content tidak boleh kosong",
                            })}
                          />
                        </div>
            
                        <button disabled={isSubmitting}>
                          <Link
                            href="/admin#manage-news"
                            className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-white hover:opacity-80 transition-all duration-300 max-lg:hidden"
                          >
                            <FaChevronLeft size={12} /> Back
                          </Link>
                        </button>
                      </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default page;
