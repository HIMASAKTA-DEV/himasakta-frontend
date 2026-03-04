"use client";

import Link from "next/link";
import { FaChevronLeft, FaCloudUploadAlt } from "react-icons/fa";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUpload,
} from "react-icons/hi";

import Typography from "@/components/Typography";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ManageGalleryType } from "@/types/admin/ManageGallery";
import { ApiResponse } from "@/types/commons/apiResponse";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";

type PhotoData = {
  id: string;
  image_url: string;
};

type DeptName = {
  id: string;
  name: string;
};

export default function AddGalleryPage() {
  const router = useRouter();
  const [deptData, setDeptData] = useState<DeptName[]>([]);
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
  const handleDeleteImage = async () => {
    if (!logo?.id) return;
    const confirmDelete = confirm("Yakin ingin menghapus gambar ini?");
    if (!confirmDelete) return;

    try {
      setDeletingLogo(true);
      await api.delete(`/gallery/${logo.id}`);
      setLogo(null);
      setValue("image_url", "");
      alert("Gambar berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert(`Gagal menghapus gambar: ${getApiErrorMessage(err)}`);
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
              onClick={() => {
                handleDeleteImage();
                setOpenUpload(true);
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
                onClick={() => {
                  handleDeleteImage();
                  setOpenUpload(true);
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
            </div>

            <div className="mt-12 flex justify-end gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primaryPink px-8 py-3 text-white rounded-lg hover:opacity-80 transition"
              >
                {isSubmitting ? "Saving..." : "Add Gallery"}
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
