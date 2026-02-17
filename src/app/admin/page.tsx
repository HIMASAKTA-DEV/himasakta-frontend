"use client";

import { MediaSelector } from "@/components/admin/MediaSelector";
import {
  createDepartment,
  createMember,
  createNews,
  deleteDepartment,
  deleteGalleryItem,
  deleteMember,
  deleteNews,
  getAllMembers,
  getAllNews,
  getCabinetInfo,
  getDepartments,
  getGallery,
  login,
  updateCabinetInfo,
  updateDepartment,
  updateMember,
  updateNews,
} from "@/services/api";
import { AuthResponse, Gallery } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaBuilding,
  FaImages,
  FaRegNewspaper,
  FaSignOutAlt,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import {
  HiChevronDown,
  HiChevronRight,
  HiLockClosed,
  HiPencil,
  HiPlus,
  HiTrash,
  HiUser,
  HiX,
} from "react-icons/hi";
import { twMerge } from "tailwind-merge";

const sidebarLinks = [
  { name: "Kabinet", icon: FaUserFriends, id: "kabinet" },
  { name: "Departemen", icon: FaBuilding, id: "departemen" },
  { name: "Anggota", icon: FaUsers, id: "anggota" },
  { name: "Berita", icon: FaRegNewspaper, id: "berita", active: true },
  { name: "Galeri", icon: FaImages, id: "galeri" },
];

const AdminModal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  loading?: boolean;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-3xl font-extrabold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <HiX size={24} className="text-slate-400" />
          </button>
        </div>
        <div className="p-10 max-h-[60vh] overflow-y-auto">{children}</div>
        <div className="p-10 bg-slate-50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 bg-white text-slate-600 rounded-2xl font-bold border border-slate-200 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className="flex-[2] py-4 px-6 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Confirm Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("berita");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  // biome-ignore lint/suspicious/noExplicitAny: dynamic admin data
  const [items, setItems] = useState<any[]>([]);
  // biome-ignore lint/suspicious/noExplicitAny: dynamic admin data
  const [cabinetData, setCabinetData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  // biome-ignore lint/suspicious/noExplicitAny: dynamic admin data
  const [currentItem, setCurrentItem] = useState<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: dynamic admin data
  const [formValues, setFormValues] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: department options for dropdown
  // biome-ignore lint/suspicious/noExplicitAny: department options for dropdown
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [targetField, setTargetField] = useState<string | null>(null);

  // Pagination & Refresh State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const LIMIT = 10;

  // Sync Hash on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && sidebarLinks.some((l) => l.id === hash)) {
        setActiveTab(hash);
      }
    }
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPage(1);
    window.location.hash = tabId;
  };

  const handleMediaSelect = (media: Gallery) => {
    if (activeTab === "galeri") {
      fetchTabData();
      setShowMediaSelector(false);
      toast.success("Gallery refreshed");
      return;
    }

    if (targetField) {
      // Heuristic: targetField is like "thumbnail_id", preview key is "thumbnail"
      const previewKey = targetField.replace("_id", "");
      setFormValues({
        ...formValues,
        [targetField]: media.id,
        [previewKey]: media,
      });
    }
    setShowMediaSelector(false);
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("docs_token") : null;
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  async function fetchTabData() {
    setIsDataLoading(true);
    setRefreshKey(Date.now()); // Update refresh key to bust image cache
    try {
      if (activeTab === "berita") {
        const response = await getAllNews(page, LIMIT);
        setItems(response.data || []);
        if (response.meta) {
          setTotalPages(response.meta.total_page);
        }
      } else if (activeTab === "departemen") {
        const response = await getDepartments(page, LIMIT);
        setItems(response.data || []);
        if (response.meta) {
          setTotalPages(response.meta.total_page);
        }
      } else if (activeTab === "kabinet") {
        const data = await getCabinetInfo();
        setCabinetData(data);
      } else if (activeTab === "galeri") {
        const response = await getGallery(page, LIMIT);
        setItems(response.data || []);
        if (response.meta) {
          setTotalPages(response.meta.total_page);
        }
      } else if (activeTab === "anggota") {
        const response = await getAllMembers(page, LIMIT);
        setItems(response.data || []);
        if (response.meta) {
          setTotalPages(response.meta.total_page);
        }
        // Also fetch departments for the dropdown
        const deptRes = await getDepartments(1, 100);
        setDepartmentOptions(deptRes.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsDataLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTabData();
    }
  }, [isAuthenticated, activeTab, page]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const response: AuthResponse = await login(credentials);

      // Try to find token in various possible locations
      const token =
        response.token ||
        (response.data && response.data.token) ||
        response.access_token;

      if (token) {
        localStorage.setItem("docs_token", token);
        setIsAuthenticated(true);
        toast.success("Login Successful");
      } else {
        toast.error("Format token tidak dikenali. Silakan periksa konsol.");
        console.error("Token not found in response:", response);
      }
    } catch (error) {
      toast.error("Invalid credentials or server error");
      console.error("Login Error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdd = () => {
    if (activeTab === "galeri") {
      setTargetField(null); // No target field since we just upload/select to "add" to gallery list (refresh)
      // But logic: onSelect should do something?
      // If targetField is null, handleMediaSelect does nothing but close.
      // Wait, for Gallery tab, we want to Add to list.
      // If we use MediaSelector, and upload/select, we just want to REFRESH the list.
      // So for Gallery, onSelect should just `fetchTabData()`.

      // Modify handleMediaSelect to handle null targetField?
      // Or creating a specific handler?
      setShowMediaSelector(true);
      return;
    }
    setModalMode("add");
    setCurrentItem(null);
    setFormValues({});
    setShowModal(true);
  };

  // biome-ignore lint/suspicious/noExplicitAny: dynamic admin data
  const handleEdit = (item: any) => {
    setModalMode("edit");
    setCurrentItem(item);
    setFormValues({ ...item });
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "berita") {
        const payload = {
          ...formValues,
          thumbnail_id: formValues.thumbnail_id,
        };
        if (modalMode === "add") {
          await createNews(payload);
          toast.success("News created successfully");
        } else {
          await updateNews(currentItem.id, payload);
          toast.success("News updated successfully");
        }
      } else if (activeTab === "departemen") {
        const payload = {
          ...formValues,
          logo_id: formValues.logo_id,
        };
        if (modalMode === "add") {
          await createDepartment(payload);
          toast.success("Department created successfully");
        } else {
          await updateDepartment(currentItem.id, payload);
          toast.success("Department updated successfully");
        }
      } else if (activeTab === "kabinet") {
        const payload = {
          ...formValues,
          logo_id: formValues.logo_id,
        };
        await updateCabinetInfo(cabinetData.id, payload);
        toast.success("Cabinet info updated");
      } else if (activeTab === "galeri") {
        if (modalMode === "add") {
          toast.success("Image added to gallery");
        } else {
          toast.success("Gallery item updated");
        }
      } else if (activeTab === "anggota") {
        const payload = {
          nrp: formValues.nrp,
          name: formValues.name,
          role: formValues.role,
          period: formValues.period,
          department_id: formValues.department_id,
          photo_id: formValues.photo_id,
        };
        if (modalMode === "add") {
          await createMember(payload);
          toast.success("Member added successfully");
        } else {
          await updateMember(currentItem.id, payload);
          toast.success("Member updated successfully");
        }
      }
      setShowModal(false);
      fetchTabData();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      if (activeTab === "berita") await deleteNews(id);
      else if (activeTab === "departemen") await deleteDepartment(id);
      else if (activeTab === "galeri") await deleteGalleryItem(id);
      else if (activeTab === "anggota") await deleteMember(id);

      toast.success("Deleted successfully");
      fetchTabData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("docs_token");
    setIsAuthenticated(false);
    toast.success("Logged out");
  };

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/20">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Admin Login
            </h1>
            <p className="text-slate-400 font-medium">
              Please enter your credentials
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                Username
              </label>
              <div className="relative group">
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  placeholder="admin"
                  className="w-full pl-12 pr-6 py-4 bg-[#F8F9FA] rounded-2xl text-slate-800 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all"
                />
                <HiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  size={20}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-[#F8F9FA] rounded-2xl text-slate-800 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all"
                />
                <HiLockClosed
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  size={20}
                />
              </div>
            </div>

            <button
              disabled={authLoading}
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <Link
            href="/"
            className="block text-center mt-8 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
          >
            &larr; Back to Website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col z-20">
        <div className="p-8 border-b border-slate-50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-95">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-extrabold text-slate-800 tracking-tight text-lg">
              HIMASAKTA
            </span>
          </Link>
        </div>

        <div className="flex-1 px-4 py-8">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">
            Main Menu
          </div>
          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleTabChange(link.id)}
                className={twMerge(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all relative group",
                  activeTab === link.id
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                )}
              >
                <link.icon
                  size={20}
                  className={
                    activeTab === link.id
                      ? "text-primary"
                      : "text-slate-400 group-hover:text-slate-600 transition-colors"
                  }
                />
                {link.name}
                {activeTab === link.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full -ml-0.75" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
          >
            <FaSignOutAlt size={18} />
            Keluar Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <div className="flex-1"></div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-slate-800">Admin</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Super Administrator
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                alt="Avatar"
              />
            </div>
            <HiChevronDown className="text-slate-400 cursor-pointer" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto">
            {/* Page Title & Action */}
            <div className="flex justify-between items-end mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <p className="text-slate-400 text-sm font-medium">
                  Manage your {activeTab} content efficiently
                </p>
              </div>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <HiPlus size={20} />
                Add {activeTab}
              </button>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isDataLoading && (
                <div className="col-span-full py-20 text-center">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-400 font-bold">
                    Loading {activeTab}...
                  </p>
                </div>
              )}

              {!isDataLoading &&
                items.length === 0 &&
                activeTab !== "kabinet" && (
                  <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">
                      No {activeTab} found.
                    </p>
                  </div>
                )}

              {activeTab === "kabinet" && cabinetData && (
                <div className="col-span-full bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
                  <div className="flex justify-between items-start mb-8">
                    <h3 className="text-2xl font-extrabold text-slate-800">
                      Cabinet Information
                    </h3>
                    <button
                      onClick={() => handleEdit(cabinetData)}
                      className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <HiPencil size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                          Tagline
                        </label>
                        <p className="text-slate-800 font-bold text-lg">
                          {cabinetData.tagline}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                          Period
                        </label>
                        <p className="text-slate-800 font-bold">
                          {new Date(cabinetData.period_start).getFullYear()} -{" "}
                          {new Date(cabinetData.period_end).getFullYear()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                          Vision
                        </label>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {cabinetData.visi}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                          Mission
                        </label>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                          {cabinetData.misi}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== "kabinet" &&
                items.map((item, i) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 group hover:shadow-2xl hover:shadow-slate-300/40 transition-all duration-500 animate-in fade-in zoom-in-95"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      <img
                        src={`${
                          item.thumbnail?.image_url ||
                          item.logo?.image_url ||
                          item.image_url ||
                          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"
                        }?t=${refreshKey}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        alt={item.title || item.name}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-widest shadow-sm">
                          {activeTab}
                        </span>
                      </div>
                    </div>
                    <div className="p-7">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-1">
                        {item.title || item.name}
                      </h3>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                        {item.published_at
                          ? new Date(item.published_at).toLocaleDateString()
                          : item.period || "No Date"}
                      </p>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                        >
                          <HiPencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <HiTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {activeTab !== "kabinet" && totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-primary transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiChevronRight className="rotate-180" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg transition-all ${
                        page === p
                          ? "bg-primary text-white shadow-primary/20"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-primary transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalMode === "add" ? "Add" : "Edit"} ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        onConfirm={handleConfirmAction}
        loading={isSaving}
      >
        <div className="space-y-6">
          {activeTab === "berita" && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Title
                </label>
                <input
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                  value={formValues.title || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, title: e.target.value })
                  }
                  placeholder="Article Title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Tagline
                </label>
                <input
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                  value={formValues.tagline || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, tagline: e.target.value })
                  }
                  placeholder="Short tagline..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Content (Markdown)
                </label>
                <textarea
                  rows={8}
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none min-h-[200px]"
                  value={formValues.content || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, content: e.target.value })
                  }
                  placeholder="Article content..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Hashtags
                </label>
                <input
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                  value={formValues.hashtags || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, hashtags: e.target.value })
                  }
                  placeholder="#tag1, #tag2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Thumbnail Image
                </label>
                <div className="flex flex-col gap-4">
                  {formValues.thumbnail?.image_url && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden group">
                      <img
                        src={formValues.thumbnail.image_url}
                        className="w-full h-full object-cover"
                        alt="thumbnail"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold">
                          Change Image
                        </span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setTargetField("thumbnail_id");
                      setShowMediaSelector(true);
                    }}
                    className="w-full py-4 px-6 bg-[#F8F9FA] border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <FaImages size={20} />
                    {formValues.thumbnail
                      ? "Change Thumbnail"
                      : "Select Thumbnail"}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "departemen" && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Department Name
                </label>
                <input
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                  value={formValues.name || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, name: e.target.value })
                  }
                  placeholder="Department Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Description
                </label>
                <textarea
                  rows={6}
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none min-h-[150px]"
                  value={formValues.description || ""}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      description: e.target.value,
                    })
                  }
                  placeholder="About the department..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Department Logo
                </label>
                <div className="flex flex-col gap-4">
                  {formValues.logo?.image_url && (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden group mx-auto">
                      <img
                        src={formValues.logo.image_url}
                        className="w-full h-full object-cover"
                        alt="logo"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setTargetField("logo_id");
                      setShowMediaSelector(true);
                    }}
                    className="w-full py-4 px-6 bg-[#F8F9FA] border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <FaImages size={20} />
                    {formValues.logo ? "Change Logo" : "Select Logo"}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "kabinet" && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Vision
                </label>
                <textarea
                  rows={4}
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none min-h-[100px]"
                  value={formValues.visi || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, visi: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Mission
                </label>
                <textarea
                  rows={6}
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none min-h-[150px]"
                  value={formValues.misi || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, misi: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Tagline
                </label>
                <input
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                  value={formValues.tagline || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, tagline: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                    Start Year
                  </label>
                  <input
                    type="date"
                    className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                    value={
                      formValues.period_start
                        ? new Date(formValues.period_start as string)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        period_start: new Date(e.target.value).toISOString(),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                    End Year
                  </label>
                  <input
                    type="date"
                    className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                    value={
                      formValues.period_end
                        ? new Date(formValues.period_end as string)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        period_end: new Date(e.target.value).toISOString(),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Cabinet Logo
                </label>
                <div className="flex flex-col gap-4">
                  {formValues.logo?.image_url && (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden group mx-auto">
                      <img
                        src={formValues.logo.image_url}
                        className="w-full h-full object-cover"
                        alt="logo"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setTargetField("logo_id");
                      setShowMediaSelector(true);
                    }}
                    className="w-full py-4 px-6 bg-[#F8F9FA] border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <FaImages size={20} />
                    {formValues.logo ? "Change Logo" : "Select Logo"}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "galeri" && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Gallery Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                  onChange={(e) =>
                    setFormValues({ ...formValues, file: e.target.files?.[0] })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Caption
                </label>
                <input
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                  value={formValues.caption || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, caption: e.target.value })
                  }
                  placeholder="Image caption"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Category
                </label>
                <select
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none appearance-none"
                  value={formValues.category || "General"}
                  onChange={(e) =>
                    setFormValues({ ...formValues, category: e.target.value })
                  }
                >
                  <option value="General">General</option>
                  <option value="Event">Event</option>
                  <option value="Department">Department</option>
                </select>
              </div>
            </>
          )}

          {activeTab === "anggota" && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  NRP
                </label>
                <input
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                  value={formValues.nrp || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, nrp: e.target.value })
                  }
                  placeholder="e.g. 12345678"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Full Name
                </label>
                <input
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                  value={formValues.name || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, name: e.target.value })
                  }
                  placeholder="Member full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Role / Position
                </label>
                <input
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                  value={formValues.role || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, role: e.target.value })
                  }
                  placeholder="e.g. Ketua Departemen, Staff"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Period
                </label>
                <input
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
                  value={formValues.period || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, period: e.target.value })
                  }
                  placeholder="e.g. 2024-2025"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Member Photo
                </label>
                <div className="flex flex-col gap-4">
                  {formValues.photo?.image_url && (
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden group mx-auto">
                      <img
                        src={formValues.photo.image_url}
                        className="w-full h-full object-cover"
                        alt="photo"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setTargetField("photo_id");
                      setShowMediaSelector(true);
                    }}
                    className="w-full py-4 px-6 bg-[#F8F9FA] border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <FaImages size={20} />
                    {formValues.photo ? "Change Photo" : "Select Photo"}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                  Department
                </label>
                <select
                  className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none appearance-none"
                  value={formValues.department_id || ""}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      department_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </AdminModal>

      {showMediaSelector && (
        <MediaSelector
          activeTab={activeTab === "galeri" ? "General" : activeTab}
          onSelect={handleMediaSelect}
          onCancel={() => setShowMediaSelector(false)}
        />
      )}
    </div>
  );
}
