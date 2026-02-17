import { getGallery, uploadGalleryImage } from "@/services/api";
import { Gallery } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { HiCheck, HiChevronRight, HiCloudUpload, HiX } from "react-icons/hi";

type MediaSelectorProps = {
  activeTab?: string;
  onSelect: (media: Gallery) => void;
  onCancel: () => void;
};

export function MediaSelector({
  activeTab = "General",
  onSelect,
  onCancel,
}: MediaSelectorProps) {
  const [tab, setTab] = useState<"select" | "upload">("upload");
  const [images, setImages] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  // Gallery Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 12; // Grid 4x3? Or just 10. Let's use 12 for grid.

  useEffect(() => {
    if (tab === "select") {
      fetchGallery();
    }
  }, [tab, page]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await getGallery(page, LIMIT);
      if (res && res.data) {
        setImages(res.data);
        if (res.meta) {
          setTotalPages(res.meta.total_page);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption || file.name);
      formData.append("category", activeTab);

      const res = await uploadGalleryImage(formData);
      // Assuming res is the created item (Gallery type)
      onSelect(res as unknown as Gallery);
      toast.success("Image uploaded and selected");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="text-xl font-bold text-slate-900">Select Media</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <HiX size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6">
          <button
            onClick={() => setTab("upload")}
            className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${
              tab === "upload"
                ? "border-primary text-primary"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Upload New
          </button>
          <button
            onClick={() => setTab("select")}
            className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${
              tab === "select"
                ? "border-primary text-primary"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Select from Gallery
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8F9FA]">
          {tab === "upload" ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-6">
              <div className="w-full max-w-md space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:bg-white transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100">
                      <img
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Change Image
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <HiCloudUpload size={32} />
                      </div>
                      <h4 className="font-bold text-slate-800">
                        Click to upload
                      </h4>
                      <p className="text-sm text-slate-400">
                        SVG, PNG, JPG or GIF
                      </p>
                    </>
                  )}
                </div>

                {file && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full px-6 py-4 bg-white rounded-2xl border border-slate-200 focus:border-primary/50 outline-none"
                    />
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <HiCheck size={20} />
                          Upload & Select
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {loading && (
                <div className="py-20 text-center">
                  <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {!loading &&
                  images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => onSelect(img)}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 hover:ring-4 hover:ring-primary/50 transition-all focus:outline-none"
                    >
                      <img
                        src={img.image_url}
                        alt={img.caption}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-left">
                        <p className="text-white text-xs font-bold line-clamp-1">
                          {img.caption || "No Caption"}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>

              {!loading && images.length === 0 && (
                <div className="text-center py-20 text-slate-400 font-bold">
                  No images found in gallery.
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6 border-t border-slate-100">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50 hover:bg-white hover:text-primary transition-all"
                  >
                    <HiChevronRight className="rotate-180" size={20} />
                  </button>
                  <span className="text-sm font-bold text-slate-600 px-4">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50 hover:bg-white hover:text-primary transition-all"
                  >
                    <HiChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
