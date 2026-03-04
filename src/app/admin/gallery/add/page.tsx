"use client";

import Link from "next/link";
import { FaChevronLeft, FaCloudUploadAlt } from "react-icons/fa";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUpload,
} from "react-icons/hi";

import Typography from "@/components/Typography";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
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
  const [openUpload, setOpenUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
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

  /* ================= UPLOAD IMAGE ================= */
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const resp = await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploaded: PhotoData = resp.data.data;
      setLogo(uploaded);
      setValue("image_url", uploaded.image_url, { shouldValidate: true });
      setOpenUpload(false);
      alert("Berhasil upload gambar");
    } catch (err) {
      console.error(err);
      alert(`Gagal upload gambar: ${getApiErrorMessage(err)}`);
    } finally {
      setUploading(false);
    }
  };

  /* ================= DELETE IMAGE ================= */
  const handleDeleteImage = async (): Promise<boolean> => {
    if (!logo?.id) return true; // tidak ada gambar → langsung boleh upload

    const confirmDelete = confirm("Yakin ingin menghapus gambar ini?");
    if (!confirmDelete) return false;

    try {
      setDeletingLogo(true);
      await api.delete(`/gallery/${logo.id}`);
      setLogo(null);
      setValue("image_url", "");
      alert("Gambar berhasil dihapus");
      return true;
    } catch (err) {
      console.error(err);
      alert(`Gagal menghapus gambar: ${getApiErrorMessage(err)}`);
      return false;
    } finally {
      setDeletingLogo(false);
    }
  };

  /* ================= SUBMIT FORM ================= */
  const onSubmit = async (data: ManageGalleryType) => {
    try {
      await api.post("/gallery", data);
      alert("Gallery berhasil ditambahkan!");
      reset();
      setLogo(null);
      localStorage.removeItem(LOCAL_KEY);
      router.push("/admin#manage-gallery");
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
    setOpenUpload(false);
    localStorage.removeItem(LOCAL_KEY);
  };

  if (!isRestored) {
    return (
      <div className="flex items-center justify-center p-10 min-h-screen w-full">
        <SkeletonPleaseWait />
      </div>
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

            <Link
              href="/admin#manage-gallery"
              className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-white hover:opacity-80 transition-all duration-300 max-lg:hidden"
            >
              <FaChevronLeft size={12} /> Back
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 flex flex-col">
            <label className="mb-2 font-semibold">Photo</label>
            <div
              onClick={async () => {
                const ok = await handleDeleteImage();
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
                  const ok = await handleDeleteImage();
                  if (ok) setOpenUpload(true);
                }}
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all duration-300"
              >
                <HiOutlineUpload /> Change Image
              </button>

              {logo && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  disabled={deletingLogo}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-100 transition-all duration-300"
                >
                  <HiOutlineTrash /> Delete Image
                </button>
              )}
              {logo && (
                <small className="text-red-600 mt-4 bg-red-100 px-2">
                  ⚠️ WARNING: Kosongkan Departemen, Kabinet, dan Progenda sebelum
                  edit/hapus gambar!
                </small>
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
                {isSubmitting ? "Adding..." : "Add Gallery"}
              </button>
            </div>
          </div>

          <Link
            href="/admin#manage-gallery"
            className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#12182B] px-8 py-3 text-white hover:opacity-80 transition-all duration-300 lg:hidden"
          >
            <FaChevronLeft size={12} /> Back
          </Link>
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {openUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Upload Photo</h2>

            <div
              onClick={() => document.getElementById("upload-input")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleUpload(file);
              }}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 transition-all ${
                uploading || deletingLogo
                  ? "opacity-60 cursor-not-allowed bg-gray-100"
                  : "cursor-pointer hover:border-primaryPink hover:bg-pink-50"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-primaryPink">
                <FaCloudUploadAlt />
              </div>
              <p>
                {uploading ? "Uploading..." : "Klik atau drag file ke sini"}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
              <input
                id="upload-input"
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={(e) =>
                  e.target.files?.[0] && handleUpload(e.target.files[0])
                }
              />
            </div>

            <div className="flex gap-2 pt-6">
              <button
                type="button"
                disabled={uploading}
                onClick={() => setOpenUpload(false)}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
