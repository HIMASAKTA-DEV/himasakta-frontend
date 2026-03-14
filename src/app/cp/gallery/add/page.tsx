"use client";

import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUpload,
} from "react-icons/hi";

import Typography from "@/components/Typography";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { ManageGalleryType } from "@/types/admin/ManageGallery";
import { ApiResponse } from "@/types/commons/apiResponse";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type PhotoData = {
  id: string;
  image_url: string;
};

type DeptName = {
  id: string;
  name: string;
};

type ProgendaDD = {
  id: string;
  name: string;
};

type CabinetDD = {
  id: string;
  tagline: string;
};

export default function AddGalleryPage() {
  const router = useRouter();
  const [deptData, setDeptData] = useState<DeptName[]>([]);
  const [progendaDD, setProgendaDD] = useState<ProgendaDD[]>([]);
  const [cabinetDD, setCabinetDD] = useState<CabinetDD[]>([]);
  const [logo, setLogo] = useState<PhotoData | null>(null);
  const [openMedia, setOpenMedia] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  const LOCAL_KEY = "add_gallery_draft";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ManageGalleryType>({
    defaultValues: {
      caption: "",
      category: "",
      department_id: "",
      image_url: "",
      cabinet_id: "",
      progenda_id: "",
    },
  });

  const watchedValues = watch();

  /* ================= FETCH DEPARTMENTS ================= */
  useEffect(() => {
    const fetchDept = async () => {
      try {
        const resp = await api.get<ApiResponse<DeptName[]>>("/department");
        if (Array.isArray(resp.data.data)) {
          setDeptData(resp.data.data);
        } else {
          console.warn("Department response is not an array", resp.data.data);
          setDeptData([]);
        }
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil daftar departemen");
      } finally {
        setIsRestored(true);
      }
    };
    fetchDept();
  }, []);

  /* ================= FETCH PROGENDA ================= */
  useEffect(() => {
    const fetchProgenda = async () => {
      try {
        const resp = await api.get<ApiResponse<ProgendaDD[]>>("/progenda");
        if (Array.isArray(resp.data.data)) {
          setProgendaDD(resp.data.data);
        } else {
          console.warn("Progenda response is not an array", resp.data.data);
          setProgendaDD([]);
        }
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil daftar progenda");
      } finally {
        setIsRestored(true);
      }
    };
    fetchProgenda();
  }, []);

  /* ================= FETCH CABINET ================= */
  useEffect(() => {
    const fetchCabinet = async () => {
      try {
        const resp = await api.get<ApiResponse<CabinetDD[]>>("/cabinet-info");
        if (Array.isArray(resp.data.data)) {
          setCabinetDD(resp.data.data);
        } else {
          console.warn("Cabinet response is not an array", resp.data.data);
          setCabinetDD([]);
        }
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil daftar cabinet");
      } finally {
        setIsRestored(true);
      }
    };
    fetchCabinet();
  }, []);

  /* ================= LOCAL STORAGE DRAFT ================= */
  useEffect(() => {
    if (!isRestored) return;
    const draft = { ...watchedValues, logo };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(draft));
  }, [watchedValues, logo, isRestored]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      reset(data);
      setLogo(data.logo ?? null);
    }
    setIsRestored(true);
  }, [reset]);

  /* ================= DELETE IMAGE ================= */
  const handleDeleteImage = () => {
    setLogo(null);
    setValue("image_url", "");
  };

  /* ================= SUBMIT FORM ================= */
  const onSubmit = async (data: ManageGalleryType) => {
    try {
      await api.post("/gallery", data);
      alert("Gallery berhasil ditambahkan!");
      reset();
      setLogo(null);
      localStorage.removeItem(LOCAL_KEY);
      router.push("/cp#manage-gallery");
    } catch (err) {
      console.error(err);
      alert(`Gagal menambahkan gallery: ${getApiErrorMessage(err)}`);
    }
  };

  const handleResetForm = () => {
    reset({
      caption: "",
      category: "",
      department_id: "",
      image_url: "",
      cabinet_id: "",
      progenda_id: "",
    });

    setLogo(null);
    setOpenMedia(false);
    localStorage.removeItem(LOCAL_KEY);
  };

  if (!isRestored) {
    return (
      <LoadingFullScreen
        isSubmitting={true}
        label="Loading Gallery Data"
        styling="bg-white text-black"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-10 bg-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <Typography
          variant="h1"
          className="font-averia text-black text-5xl font-bold mb-10 mx-auto"
        >
          Add Gallery
        </Typography>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT FORM */}
          <div className="flex-1 flex flex-col gap-6">
            {/* TITLE */}
            <div>
              <label className="block font-semibold mb-2">Title</label>
              <input
                {...register("caption", { required: "Judul wajib diisi" })}
                placeholder="Insert photo title..."
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primaryPink transition-all"
              />
              {errors.caption && (
                <p className="text-sm text-red-500">{errors.caption.message}</p>
              )}
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block font-semibold mb-2">Category</label>
              <input
                {...register("category")}
                placeholder="Insert category..."
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primaryPink transition-all"
              />
            </div>

            {/* DEPARTMENT */}
            <div>
              <label className="block font-semibold mb-2">Department</label>
              <select
                {...register("department_id")}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primaryPink transition-all"
              >
                <option value="">Pilih Departemen</option>
                {deptData.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PROGENDA */}
            <div>
              <label className="block font-semibold mb-2">Progenda</label>
              <select
                {...register("progenda_id")}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primaryPink transition-all"
              >
                <option value="">Pilih Progenda</option>
                {progendaDD.map((progenda) => (
                  <option key={progenda.id} value={progenda.id}>
                    {progenda.name}
                  </option>
                ))}
              </select>
            </div>

            {/* KABINET */}
            <div>
              <label className="block font-semibold mb-2">Kabinet</label>
              <select
                {...register("cabinet_id")}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primaryPink transition-all"
              >
                <option value="">Pilih Kabinet</option>
                {cabinetDD.map((cabinet) => (
                  <option key={cabinet.id} value={cabinet.id}>
                    {cabinet.tagline}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8">
              <Link
                href="/cp#manage-gallery"
                className="flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
              >
                <FaChevronLeft size={12} /> Back
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <label className="block font-semibold mb-3">Photo Gallery</label>
            <div
              onClick={() => setOpenMedia(true)}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-primaryPink hover:bg-pink-50"
            >
              {logo ? (
                <img
                  src={logo.image_url}
                  alt="Gallery"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
                  <div className="rounded-full bg-white p-4 shadow-sm transition-transform group-hover:scale-110">
                    <HiOutlineUpload size={24} className="text-primaryPink" />
                  </div>
                  <span className="text-sm font-medium">
                    Click to select image
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <HiOutlinePencilAlt className="text-3xl text-white" />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setOpenMedia(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-100 hover:text-blue-700 active:scale-[0.98]"
              >
                <HiOutlineUpload size={18} />
                {logo ? "Change Image" : "Select Image"}
              </button>

              {logo && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500 transition-all hover:bg-red-100 hover:text-red-600 active:scale-[0.98]"
                >
                  <HiOutlineTrash size={18} />
                  Delete Image
                </button>
              )}
            </div>

            <div className="mt-12 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={handleResetForm}
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
                {isSubmitting ? "Adding..." : "Add Gallery"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* UPLOAD MODAL */}
      {openMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Upload Gallery Image</h2>
            <div
              onClick={() =>
                document.getElementById("gallery-upload-input")?.click()
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const formData = new FormData();
                  formData.append("image", file);
                  api
                    .post("/gallery", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then((resp) => {
                      const uploaded = resp.data.data;
                      setLogo(uploaded);
                      setValue("image_url", uploaded.image_url, {
                        shouldValidate: true,
                      });
                      setOpenMedia(false);
                    })
                    .catch(() => alert("Gagal upload gambar"));
                }
              }}
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer hover:border-primaryPink hover:bg-pink-50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-primaryPink">
                <HiOutlineUpload size={20} />
              </div>
              <p className="text-sm font-medium">Klik atau drag file ke sini</p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
              <input
                id="gallery-upload-input"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("image", file);
                  api
                    .post("/gallery", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then((resp) => {
                      const uploaded = resp.data.data;
                      setLogo(uploaded);
                      setValue("image_url", uploaded.image_url, {
                        shouldValidate: true,
                      });
                      setOpenMedia(false);
                    })
                    .catch(() => alert("Gagal upload gambar"));
                }}
              />
            </div>
            <div className="flex gap-2 pt-6">
              <button
                type="button"
                onClick={() => setOpenMedia(false)}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-200 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      <LoadingFullScreen
        isSubmitting={isSubmitting}
        label="Submitting Gallery Data"
      />
    </form>
  );
}
