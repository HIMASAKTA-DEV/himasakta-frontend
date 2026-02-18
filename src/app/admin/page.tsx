"use client";

import { MediaSelector } from "@/components/admin/MediaSelector";
import {
  createCabinetInfo,
  createDepartment,
  createMember,
  createMonthlyEvent,
  createNews,
  createProgenda,
  createRole,
  deleteCabinetInfo,
  deleteDepartment,
  deleteGalleryItem,
  deleteMember,
  deleteMonthlyEvent,
  deleteNews,
  deleteProgenda,
  getAllCabinets,
  getAllMembers,
  getAllMonthlyEvents,
  getAllNews,
  getAllRoles,
  getDepartments,
  getGallery,
  getProgendaByDepartment,
  login,
  updateCabinetInfo,
  updateDepartment,
  updateMember,
  updateMonthlyEvent,
  updateNews,
  updateProgenda,
} from "@/services/api";
import { AuthResponse, CabinetInfo, Department, Progenda, Role } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaBuilding,
  FaImages,
  FaRegNewspaper,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { HiLockClosed, HiUser } from "react-icons/hi";

// Modular Components
import { AdminModal } from "@/components/admin/AdminModal";
import { CabinetForm } from "@/components/admin/forms/CabinetForm";
import { DepartmentForm } from "@/components/admin/forms/DepartmentForm";
import { GalleryForm } from "@/components/admin/forms/GalleryForm";
import { MemberForm } from "@/components/admin/forms/MemberForm";
import { MonthlyEventForm } from "@/components/admin/forms/MonthlyEventForm";
import { NewsForm } from "@/components/admin/forms/NewsForm";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { ProgendaModal } from "@/components/admin/modals/ProgendaModal";
import { AdminGrid } from "@/components/admin/sections/AdminGrid";

const sidebarLinks = [
  { name: "Kabinet", icon: FaUserFriends, id: "kabinet" },
  { name: "Departemen", icon: FaBuilding, id: "departemen" },
  { name: "Anggota", icon: FaUsers, id: "anggota" },
  { name: "Berita", icon: FaRegNewspaper, id: "berita", active: true },
  { name: "Galeri", icon: FaImages, id: "galeri" },
  { name: "Get to know", icon: FaImages, id: "monthly-event" },
];

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
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  // biome-ignore lint/suspicious/noExplicitAny: dynamic admin data
  const [currentItem, setCurrentItem] = useState<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: dynamic admin data
  const [formValues, setFormValues] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState<Department[]>([]);
  const [roleOptions, setRoleOptions] = useState<Role[]>([]);
  const [cabinetOptions, setCabinetOptions] = useState<CabinetInfo[]>([]);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [targetField, setTargetField] = useState<string | null>(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);

  // Progenda Management State
  const [progendas, setProgendas] = useState<Progenda[]>([]);
  const [isProgendaLoading, setIsProgendaLoading] = useState(false);
  const [showProgendaModal, setShowProgendaModal] = useState(false);
  const [progendaModalMode, setProgendaModalMode] = useState<"add" | "edit">(
    "add",
  );
  // biome-ignore lint/suspicious/noExplicitAny: dynamic admin data
  const [progendaFormValues, setProgendaFormValues] = useState<any>({});
  const [currentProgenda, setCurrentProgenda] = useState<Progenda | null>(null);
  const [isProgendaSaving, setIsProgendaSaving] = useState(false);

  // Pagination & Refresh State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, _setRefreshKey] = useState(Date.now());
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
    // setRefreshKey(Date.now()); // Disabled to allow standard caching
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
        const response = await getAllCabinets(page, LIMIT);
        setItems(response.data || []);
        if (response.meta) {
          setTotalPages(response.meta.total_page);
        }
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
        // Fetch dependencies for dropdowns
        const [deptRes, roleRes, cabRes] = await Promise.all([
          getDepartments(1, 100),
          getAllRoles(1, 100),
          getAllCabinets(1, 100),
        ]);
        setDepartmentOptions(deptRes.data || []);
        setRoleOptions(roleRes.data || []);
        setCabinetOptions(cabRes.data || []);
      } else if (activeTab === "monthly-event") {
        const response = await getAllMonthlyEvents(page, LIMIT);
        setItems(response.data || []);
        if (response.meta) {
          setTotalPages(response.meta.total_page);
        }
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

  async function fetchProgendas(deptId: string) {
    setIsProgendaLoading(true);
    try {
      const response = await getProgendaByDepartment(deptId);
      setProgendas(response || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch progendas");
    } finally {
      setIsProgendaLoading(false);
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: dynamic media selection
  const handleMediaSelect = (media: any) => {
    if (targetField === "progenda_thumbnail_id") {
      setProgendaFormValues({
        ...progendaFormValues,
        [targetField]: media.id,
        [targetField.replace("_id", "")]: media,
      });
    } else if (targetField === "organigram_id") {
      setFormValues({
        ...formValues,
        organigram_id: media.id,
        organigram: media,
      });
    } else if (targetField) {
      setFormValues({
        ...formValues,
        [targetField]: media.id,
        [targetField.replace("_id", "")]: media,
      });
    } else if (activeTab === "galeri") {
      fetchTabData();
    }
    setShowMediaSelector(false);
    setTargetField(null);
  };

  // biome-ignore lint/suspicious/noExplicitAny: dynamic admin data
  const handleEdit = (item: any) => {
    setModalMode("edit");
    setCurrentItem(item);
    setFormValues({ ...item });
    if (activeTab === "departemen") {
      fetchProgendas(item.id);
    }
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
          organigram_id: formValues.organigram_id,
          is_active: !!formValues.is_active,
        };
        if (modalMode === "add") {
          await createCabinetInfo(payload);
          toast.success("Cabinet created successfully");
        } else {
          await updateCabinetInfo(currentItem.id, payload);
          toast.success("Cabinet updated successfully");
        }
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
          role_id: formValues.role_id,
          cabinet_id: formValues.cabinet_id,
          index: formValues.index,
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
      } else if (activeTab === "monthly-event") {
        const payload = {
          ...formValues,
          thumbnail_id: formValues.thumbnail_id,
        };
        if (modalMode === "add") {
          await createMonthlyEvent(payload);
          toast.success("Monthly event created");
        } else {
          await updateMonthlyEvent(currentItem.id, payload);
          toast.success("Monthly event updated");
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
      else if (activeTab === "kabinet") await deleteCabinetInfo(id);
      else if (activeTab === "monthly-event") await deleteMonthlyEvent(id);

      toast.success("Deleted successfully");
      fetchTabData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete item");
    }
  };

  const _handleProgendaAdd = () => {
    setProgendaModalMode("add");
    setCurrentProgenda(null);
    setProgendaFormValues({
      department_id: currentItem.id,
      timelines: [],
    });
    setShowProgendaModal(true);
  };

  const handleProgendaEdit = (progenda: Progenda) => {
    setProgendaModalMode("edit");
    setCurrentProgenda(progenda);
    setProgendaFormValues({ ...progenda });
    setShowProgendaModal(true);
  };

  const handleProgendaDelete = async (id: string) => {
    if (!confirm("Delete this progenda?")) return;
    try {
      await deleteProgenda(id);
      toast.success("Progenda deleted");
      fetchProgendas(currentItem.id);
    } catch (_e) {
      toast.error("Failed to delete progenda");
    }
  };

  const handleProgendaConfirm = async () => {
    setIsProgendaSaving(true);
    try {
      const payload = {
        ...progendaFormValues,
        department_id: currentItem.id,
        // biome-ignore lint/suspicious/noExplicitAny: dynamic timeline
        timelines: (progendaFormValues.timelines || []).map((t: any) => {
          const isUUID =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              t.id,
            );
          return {
            timeline_id: isUUID ? t.id : undefined,
            date: t.date,
            info: t.info,
            link: t.link,
          };
        }),
      };
      if (progendaModalMode === "add") {
        await createProgenda(payload);
        toast.success("Progenda created");
      } else {
        await updateProgenda(currentProgenda!.id, payload);
        toast.success("Progenda updated");
      }
      setShowProgendaModal(false);
      fetchProgendas(currentItem.id);
    } catch (_e) {
      toast.error("Failed to save progenda");
    } finally {
      setIsProgendaSaving(false);
    }
  };

  const handleCreateRole = async () => {
    setRoleLoading(true);
    try {
      const newRole = await createRole({
        name: newRoleName,
        level: 1,
        description: "",
      });
      setRoleOptions([...roleOptions, newRole]);
      setFormValues({ ...formValues, role_id: newRole.id });
      setIsAddingRole(false);
      setNewRoleName("");
      toast.success("Role created");
    } catch (e) {
      console.error(e);
      toast.error("Failed to create role");
    } finally {
      setRoleLoading(false);
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
      <AdminSidebar
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        handleLogout={handleLogout}
        sidebarLinks={sidebarLinks}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <AdminHeader />

        <div className="flex-1 overflow-y-auto p-10 bg-[#F8F9FA]">
          <AdminGrid
            activeTab={activeTab}
            items={items}
            isDataLoading={isDataLoading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleAdd={handleAdd}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            refreshKey={refreshKey}
          />
        </div>
      </main>

      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === "add" ? `Add ${activeTab}` : `Edit ${activeTab}`}
        onConfirm={handleConfirmAction}
        loading={isSaving}
      >
        {activeTab === "berita" && (
          <NewsForm
            formValues={formValues}
            setFormValues={setFormValues}
            setTargetField={setTargetField}
            setShowMediaSelector={setShowMediaSelector}
          />
        )}
        {activeTab === "departemen" && (
          <DepartmentForm
            formValues={formValues}
            setFormValues={setFormValues}
            setTargetField={setTargetField}
            setShowMediaSelector={setShowMediaSelector}
            progendas={progendas}
            isProgendaLoading={isProgendaLoading}
            handleEditProgenda={handleProgendaEdit}
            handleDeleteProgenda={handleProgendaDelete}
            setShowProgendaModal={setShowProgendaModal}
            setProgendaModalMode={setProgendaModalMode}
            setProgendaFormValues={setProgendaFormValues}
          />
        )}
        {activeTab === "anggota" && (
          <MemberForm
            formValues={formValues}
            setFormValues={setFormValues}
            setTargetField={setTargetField}
            setShowMediaSelector={setShowMediaSelector}
            roleOptions={roleOptions}
            cabinetOptions={cabinetOptions}
            departmentOptions={departmentOptions}
            isAddingRole={isAddingRole}
            setIsAddingRole={setIsAddingRole}
            newRoleName={newRoleName}
            setNewRoleName={setNewRoleName}
            roleLoading={roleLoading}
            handleCreateRole={handleCreateRole}
          />
        )}
        {activeTab === "galeri" && (
          <GalleryForm formValues={formValues} setFormValues={setFormValues} />
        )}
        {activeTab === "kabinet" && (
          <CabinetForm
            formValues={formValues}
            setFormValues={setFormValues}
            setTargetField={setTargetField}
            setShowMediaSelector={setShowMediaSelector}
          />
        )}
        {activeTab === "monthly-event" && (
          <MonthlyEventForm
            formValues={formValues}
            setFormValues={setFormValues}
            setTargetField={setTargetField}
            setShowMediaSelector={setShowMediaSelector}
          />
        )}
      </AdminModal>

      <ProgendaModal
        isOpen={showProgendaModal}
        onClose={() => setShowProgendaModal(false)}
        mode={progendaModalMode}
        progendaFormValues={progendaFormValues}
        setProgendaFormValues={setProgendaFormValues}
        onConfirm={handleProgendaConfirm}
        isSaving={isProgendaSaving}
        setTargetField={setTargetField}
        setShowMediaSelector={setShowMediaSelector}
      />

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
