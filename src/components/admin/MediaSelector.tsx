"use client";

import api from "@/lib/axios";
import { ManageGalleryType } from "@/types/admin/ManageGallery";
import { ApiResponse } from "@/types/commons/apiResponse";
import { useEffect, useState } from "react";
import { FaCloudUploadAlt, FaImages, FaTimes } from "react-icons/fa";
import RenderPagination from "../_news/RenderPagination";
import ImageFallback from "../commons/ImageFallback";

interface MediaSelectorProps {
  onClose: () => void;
  onSelect: (image: { id: string; image_url: string }) => void;
  title?: string;
  onFilter?: "progenda_id" | "cabinet_id" | "department_id" | "orphan" | "";
}

export default function MediaSelector({
  onClose,
  onSelect,
  title = "Select Media",
  onFilter = "",
}: MediaSelectorProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "gallery">("upload");

  // Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Gallery State
  const [galleryData, setGalleryData] = useState<ManageGalleryType[]>([]);
  const [selectedGalleryImage, setSelectedGalleryImage] =
    useState<ManageGalleryType | null>(null);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 15;

  const fetchGallery = async () => {
    setIsLoadingGallery(true);
    try {
      const resp = await api.get<ApiResponse<ManageGalleryType[]>>(
        `/gallery?${onFilter ? `filter_by=${onFilter}&filter=null&page=${currentPage}&limit=${LIMIT}` : `page=${currentPage}&limit=${LIMIT}`}`,
      );
      setGalleryData(resp.data.data);
      setTotalPages(resp.data.meta.total_page ?? 1);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  useEffect(() => {
    if (activeTab === "gallery") {
      fetchGallery();
    }
  }, [activeTab, currentPage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append("image", uploadFile);

    setIsUploading(true);
    try {
      const resp = await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploaded = resp.data.data;
      onSelect({ id: uploaded.id, image_url: uploaded.image_url });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGallerySubmit = () => {
    if (selectedGalleryImage) {
      onSelect({
        id: selectedGalleryImage.id as string,
        image_url: selectedGalleryImage.image_url,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold font-averia text-black">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-all ${
              activeTab === "upload"
                ? "text-primaryPink border-b-2 border-primaryPink bg-pink-50/30"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <FaCloudUploadAlt />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-all ${
              activeTab === "gallery"
                ? "text-primaryPink border-b-2 border-primaryPink bg-pink-50/30"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <FaImages />
            Select from Gallery
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
          {activeTab === "upload" ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div
                onClick={() => document.getElementById("media-upload")?.click()}
                className={`w-full max-w-lg aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all overflow-hidden ${
                  uploadPreview
                    ? "border-primaryPink bg-pink-50/20"
                    : "border-gray-200 hover:border-primaryPink hover:bg-pink-50/10 cursor-pointer"
                }`}
              >
                {uploadPreview ? (
                  <img
                    src={uploadPreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-primaryPink">
                      <FaCloudUploadAlt size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-400">
                        PNG, JPG, JPEG, GIF up to 5MB
                      </p>
                    </div>
                  </>
                )}
                <input
                  id="media-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </div>

              {uploadPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setUploadFile(null);
                    setUploadPreview(null);
                  }}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove Selection
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {isLoadingGallery ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 animate-pulse rounded-xl"
                    />
                  ))}
                </div>
              ) : (
                <>
                  {onFilter !== "" && (
                    <h1>
                      Galeri sudah disaring. Gambar yang sudah digunakan tidak
                      dapat digunakan kembali
                    </h1>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {galleryData.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => setSelectedGalleryImage(img)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-4 transition-all cursor-pointer ${
                          selectedGalleryImage?.id === img.id
                            ? "border-primaryPink scale-95"
                            : "border-transparent hover:border-gray-200"
                        }`}
                      >
                        <ImageFallback
                          src={img.image_url}
                          alt={img.caption || "Gallery Image"}
                          isFill
                          imgStyle="object-cover"
                        />
                        {selectedGalleryImage?.id === img.id && (
                          <div className="absolute inset-0 bg-primaryPink/20 flex items-center justify-center" />
                        )}
                      </div>
                    ))}
                  </div>

                  {galleryData.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500">
                        No images found in gallery.
                      </p>
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="flex justify-center pt-4">
                      <RenderPagination
                        currPage={currentPage}
                        totPage={totalPages}
                        onChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          {activeTab === "upload" ? (
            <button
              type="button"
              onClick={handleUploadSubmit}
              disabled={!uploadFile || isUploading}
              className="px-8 py-2.5 rounded-xl bg-primaryPink text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition active:scale-95"
            >
              {isUploading ? "Uploading..." : "Upload & Select"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGallerySubmit}
              disabled={!selectedGalleryImage}
              className="px-8 py-2.5 rounded-xl bg-primaryPink text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition active:scale-95"
            >
              Select Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
