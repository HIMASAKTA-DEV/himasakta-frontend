"use client";
import toast from "react-hot-toast";

import api from "@/lib/axios";
import { ManageGalleryType } from "@/types/admin/ManageGallery";
import { ApiResponse } from "@/types/commons/apiResponse";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { FaCloudUploadAlt, FaImages, FaTimes } from "react-icons/fa";
import RenderPagination from "../_news/RenderPagination";
import ImageFallback from "../commons/ImageFallback";

import ReactCrop, { Crop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [_isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const MIN_DIMENSION = 150;
  const [aspectRatio, setAspectRatio] = useState(1);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

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
        `/gallery?${
          onFilter
            ? `filter_by=${onFilter}&filter=null&page=${currentPage}&limit=${LIMIT}`
            : `page=${currentPage}&limit=${LIMIT}`
        }`,
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadPreview(URL.createObjectURL(file));
      setCrop(undefined);
      setCompletedCrop(null);
    }
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setCrop(undefined);
    setCompletedCrop(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0] || null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const _handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] || null);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageRef(img);

    const { naturalWidth, naturalHeight } = img;

    const initialCrop = makeAspectCrop(
      { unit: "%", width: 50 },
      aspectRatio,
      naturalWidth,
      naturalHeight,
    );

    setCrop(initialCrop);
  };

  const getCroppedBlob = async (): Promise<Blob | null> => {
    if (!imageRef || !completedCrop) return null;

    const canvas = document.createElement("canvas");

    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    const cropPx = {
      x: completedCrop.x! * scaleX,
      y: completedCrop.y! * scaleY,
      width: completedCrop.width! * scaleX,
      height: completedCrop.height! * scaleY,
    };

    canvas.width = cropPx.width;
    canvas.height = cropPx.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(
      imageRef,
      cropPx.x,
      cropPx.y,
      cropPx.width,
      cropPx.height,
      0,
      0,
      cropPx.width,
      cropPx.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
    });
  };

  const changeAspect = (ratio: number) => {
    setAspectRatio(ratio);

    if (!imageRef) return;

    const { naturalWidth, naturalHeight } = imageRef;

    const newCrop = makeAspectCrop(
      {
        unit: "%",
        width: 80,
      },
      ratio,
      naturalWidth,
      naturalHeight,
    );

    setCrop(newCrop);
    setCompletedCrop(null);
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) return;

    const croppedBlob = await getCroppedBlob();

    if (!croppedBlob) {
      toast.error("Crop image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", croppedBlob, "cropped.jpg");

    setIsUploading(true);
    try {
      const resp = await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploaded = resp.data.data;

      onSelect({
        id: uploaded.id,
        image_url: uploaded.image_url,
      });
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload image");
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

        <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
          {activeTab === "upload" ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div
                onClick={() =>
                  !uploadPreview &&
                  document.getElementById("media-upload")?.click()
                }
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full max-w-lg border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${
                  uploadPreview
                    ? "border-primaryPink bg-pink-50/20 p-4"
                    : "border-gray-200 hover:border-primaryPink hover:bg-pink-50/10 cursor-pointer aspect-video overflow-hidden"
                }`}
              >
                {uploadPreview ? (
                  <div
                    className="w-full flex flex-col items-center justify-center bg-gray-100/50 rounded-xl overflow-hidden"
                    // Container ini tidak boleh punya fixed aspect-ratio
                    style={{ minHeight: "300px" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative w-full flex items-center justify-center p-2">
                      <ReactCrop
                        crop={crop}
                        onChange={(_pixelCrop, percentCrop) =>
                          setCrop(percentCrop)
                        }
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspectRatio || undefined}
                        minWidth={MIN_DIMENSION}
                        // Penting: Memastikan container crop tidak meluber
                        style={{ maxWidth: "100%", maxHeight: "60vh" }}
                      >
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          onLoad={onImageLoad}
                          // Kuncinya di sini: max-h harus lebih kecil dari container modal
                          // agar header & footer modal tetap terlihat
                          className="block w-auto h-auto max-w-full max-h-[50vh] object-contain"
                        />
                      </ReactCrop>
                    </div>
                  </div>
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
                {/* 
                <>
                    
                  </> */}
                <input
                  id="media-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </div>
              {uploadPreview && (
                <div className="flex flex-col items-center justify-center gap-2 lg:gap-4">
                  <div className="flex gap-2 lg:gap-4 items-center justify-center">
                    <button
                      className={
                        aspectRatio === 1 ? "text-primaryPink font-bold" : ""
                      }
                      onClick={() => changeAspect(1)}
                      type="button"
                    >
                      1:1
                    </button>
                    <button
                      className={
                        aspectRatio === 16 / 9
                          ? "text-primaryPink font-bold"
                          : ""
                      }
                      onClick={() => changeAspect(16 / 9)}
                      type="button"
                    >
                      16:9
                    </button>
                    <button
                      className={
                        aspectRatio === 9 / 16
                          ? "text-primaryPink font-bold"
                          : ""
                      }
                      onClick={() => changeAspect(9 / 16)}
                      type="button"
                    >
                      9:16
                    </button>
                    <button
                      className={
                        aspectRatio === 4 / 3
                          ? "text-primaryPink font-bold"
                          : ""
                      }
                      onClick={() => changeAspect(4 / 3)}
                      type="button"
                    >
                      4:3
                    </button>
                    <button
                      className={
                        aspectRatio === 3 / 4
                          ? "text-primaryPink font-bold"
                          : ""
                      }
                      onClick={() => changeAspect(3 / 4)}
                      type="button"
                    >
                      3:4
                    </button>
                    <button
                      className={
                        aspectRatio === 0 ? "text-primaryPink font-bold" : ""
                      }
                      onClick={() => changeAspect(0)}
                      type="button"
                    >
                      Free
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadFile(null);
                      setUploadPreview(null);
                      setCrop(undefined);
                      setCompletedCrop(null);
                      setImageRef(null);
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove Selection
                  </button>
                </div>
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
