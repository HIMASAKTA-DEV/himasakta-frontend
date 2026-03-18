"use client";

import { UUID } from "crypto";
import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import MediaSelector from "@/components/admin/MediaSelector";
import HeaderSection from "@/components/commons/HeaderSection";
import api from "@/lib/axios";
import { GetAllCabinets } from "@/services/admin/GetAllCabinets";
import { GetAllRole } from "@/services/admin/GetAllRole";
import { PostCreateRole } from "@/services/admin/PostCreateRole";
import { PutUpdateMember } from "@/services/admin/PutUpdateMember";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { CreateMemberType } from "@/types/data/CreateMember";
import { CreateRoleType } from "@/types/data/CreateRole";
import { DepartmentType } from "@/types/data/DepartmentType";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import { RoleType } from "@/types/data/RoleType";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEdit, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineUpload } from "react-icons/hi";
import Select, { StylesConfig } from "react-select";

type FormValues = CreateMemberType;
type RoleForm = CreateRoleType;

type OptionType = { label?: string; value?: string };
type PhotoData = { id: UUID | string; image_url: string };

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

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields }, // Added dirtyFields
    reset,
    setValue,
  } = useForm<FormValues>();

  const [roles, setRoles] = useState<RoleType[]>([]);
  const [depts, setDepts] = useState<DepartmentType[]>([]);
  const [cabinets, setCabinets] = useState<CabinetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [openMedia, setOpenMedia] = useState(false);

  const fetchRoles = useCallback(async () => {
    try {
      const r = await GetAllRole(1, 50);
      const sorted = [...r.data].sort((a, b) => b.level - a.level);
      setRoles(sorted);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [d, c, memberResp] = await Promise.all([
          GetAllDepts(1, 50),
          GetAllCabinets(1, 50),
          api.get(`/member/${id}`), // Fetch existing member data
        ]);

        const memberData = memberResp.data.data;
        setDepts(d.data);
        setCabinets(c.data);
        await fetchRoles();

        // Populate Form
        reset({
          name: memberData.name,
          nrp: memberData.nrp,
          role_id: memberData.role_id,
          department_id: memberData.department_id,
          cabinet_id: memberData.cabinet_id,
          photo_id: memberData.photo?.id,
        });

        if (memberData.photo) {
          setPhoto({
            id: memberData.photo.id,
            image_url: memberData.photo.image_url,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengambil data anggota");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset, fetchRoles]);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload: Partial<CreateMemberType> = {};
      let hasUpdates = false;

      // Only append dirty (changed) fields
      if (dirtyFields.name) {
        payload.name = data.name;
        hasUpdates = true;
      }
      if (dirtyFields.nrp) {
        payload.nrp = data.nrp;
        hasUpdates = true;
      }
      if (dirtyFields.role_id) {
        payload.role_id = data.role_id;
        hasUpdates = true;
      }
      if (dirtyFields.cabinet_id) {
        payload.cabinet_id = data.cabinet_id;
        hasUpdates = true;
      }
      if (dirtyFields.department_id) {
        payload.department_id = data.department_id || "";
        hasUpdates = true;
      }
      if (dirtyFields.photo_id) {
        payload.photo_id = data.photo_id as string;
        hasUpdates = true;
      }

      if (!hasUpdates) {
        toast("Tidak ada perubahan yang disimpan. Silahkan kembali");
        return;
      }

      await PutUpdateMember(id as string, payload);
      toast.success("Berhasil memperbarui anggota!");
      router.push("/cp#manage-anggota");
    } catch (err) {
      console.error("API ERROR: ", err);
      toast.error("Gagal memperbarui anggota.");
    }
  };

  // handle submit new role
  const {
    register: registerRole,
    handleSubmit: handleSubmitRole,
    reset: resetRoleForm,
    formState: {
      errors: roleErrors,
      isSubmitting: roleSubmitting,
      dirtyFields: roleDirtyFields,
    },
  } = useForm<RoleForm>();

  // Submit Role form
  const onRoleSubmit = async (data: RoleForm) => {
    if (!isCreating) {
      onRoleEditSubmit(data);
      return;
    }
    const payload: CreateRoleType = {
      name: data.name.trim(),
      level: data.level,
      description: data.description?.trim() || undefined,
    };

    // Check for duplicate level
    const duplicate = roles.find((r) => r.level === data.level);
    if (duplicate) {
      toast.error(
        `Peringatan: Level ${data.level} sudah digunakan oleh jabatan "${duplicate.name}".`,
      );
    }

    try {
      await PostCreateRole(payload);
      await fetchRoles();
      setOpenRoleModal(false);
      resetRoleForm();
      toast.success("Jabatan berhasil ditambahkan!");
    } catch (err) {
      console.error("API ERROR:", err);
      toast.error("Gagal menambahkan jabatan.");
    }
  };

  // handle role edit functionality
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [isManagingRoles, setIsManagingRoles] = useState(false);
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleType | null>(null);
  const [deleteRoleLoading, setDeleteRoleLoading] = useState(false);
  const [deleteRoleError, setDeleteRoleError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const handleDrop = async (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) {
      setDraggedItemIndex(null);
      return;
    }

    const newRoles = [...roles];
    const draggedItem = { ...newRoles[draggedItemIndex] };
    newRoles.splice(draggedItemIndex, 1);
    newRoles.splice(index, 0, draggedItem);

    const originalLevels = roles.map((r) => r.level).sort((a, b) => b - a);
    const updatedRoles = newRoles.map((role, idx) => ({
      ...role,
      level:
        originalLevels[idx] ??
        originalLevels[originalLevels.length - 1] -
          (idx - originalLevels.length + 1),
    }));

    // Find roles that actually changed levels
    const changedRoles = updatedRoles.filter(
      (role) => role.level !== roles.find((r) => r.id === role.id)?.level,
    );

    if (changedRoles.length === 0) {
      setDraggedItemIndex(null);
      return;
    }

    setRoles(updatedRoles);
    setDraggedItemIndex(null);

    const updatePromise = Promise.all(
      changedRoles.map((role) =>
        api.put(`/role/${role.id}`, { level: role.level }),
      ),
    );

    toast.promise(updatePromise, {
      loading: "Memperbarui urutan jabatan...",
      success: "Urutan jabatan diperbarui!",
      error: "Gagal memperbarui urutan ke server.",
    });

    try {
      await updatePromise;
      await fetchRoles(); // Refresh to ensure backend consistency
    } catch (err) {
      console.error("Failed to sync role hierarchy:", err);
      await fetchRoles(); // Revert to server state on failure
    }
  };

  const handleDeleteRole = (role: RoleType) => {
    setRoleToDelete(role);
    setDeleteRoleError(null);
    setShowDeleteRoleModal(true);
  };

  // Delete role
  const confirmDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      setDeleteRoleLoading(true);
      setDeleteRoleError(null);

      await api.delete(`/role/${roleToDelete.id}`);

      // kalau role yg dihapus sedang dipakai
      if (roleToDelete.id === control._formValues.role_id) {
        setValue("role_id", "", { shouldDirty: true });
      }

      await fetchRoles();
      setShowDeleteRoleModal(false);
      setRoleToDelete(null);
    } catch (err) {
      setDeleteRoleError("Gagal menghapus jabatan. Mungkin masih digunakan.");
      console.error(err);
    } finally {
      setDeleteRoleLoading(false);
    }
  };

  // edit role
  const handleEditRoleClick = (role: RoleType) => {
    setEditingRoleId(role.id);
    resetRoleForm({
      name: role.name,
      level: role.level,
      description: role.description,
    });
    setOpenRoleModal(true);
  };

  const onRoleEditSubmit = async (data: RoleForm) => {
    if (!editingRoleId) return;

    const payload: Partial<RoleForm> = {};
    let hasUpdates = false;

    if (roleDirtyFields.name) {
      payload.name = data.name.trim();
      hasUpdates = true;
    }

    if (roleDirtyFields.level && data.level !== undefined) {
      payload.level = data.level;
      hasUpdates = true;

      // Check for duplicate level
      const duplicate = roles.find(
        (r) => r.level === data.level && r.id !== editingRoleId,
      );
      if (duplicate) {
        toast.error(
          `Peringatan: Level ${data.level} sudah digunakan oleh jabatan "${duplicate.name}".`,
        );
      }
    }

    if (roleDirtyFields.description) {
      payload.description = data.description?.trim() || undefined;
      hasUpdates = true;
    }

    if (!hasUpdates) {
      toast("Tidak ada perubahan pada jabatan.");
      return;
    }

    try {
      await api.put(`/role/${editingRoleId}`, payload);
      toast.success("Jabatan berhasil diperbarui!");
      await fetchRoles();
      closeRoleModal();
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui jabatan.");
    }
  };

  const closeRoleModal = () => {
    setOpenRoleModal(false);
    setEditingRoleId(null);
    resetRoleForm({ name: "", level: undefined, description: "" });
  };

  if (loading)
    return (
      <LoadingFullScreen
        isSubmitting={true}
        label="Loading Member Data"
        styling="bg-white text-black"
      />
    );

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primaryPink/20 via-white to-primaryGreen/20">
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow border">
        <HeaderSection title="Edit Anggota" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          {/* Photo Section */}
          <div className="w-full flex items-center justify-center">
            <Field label="Photo Profile" error={errors.photo_id?.message}>
              <div
                onClick={() => setOpenMedia(true)}
                className="group relative w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-primaryPink"
              >
                {photo ? (
                  <img
                    src={photo.image_url}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
                    <HiOutlineUpload size={20} className="text-primaryPink" />
                    <span className="text-[10px]">Upload</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <HiOutlinePencilAlt className="text-white text-xl" />
                </div>
              </div>
            </Field>
          </div>

          <Field label="Nama" required error={errors.name?.message}>
            <input
              {...register("name", { required: "Nama wajib diisi" })}
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primaryPink outline-none"
              placeholder="Nama Lengkap"
            />
          </Field>

          {/* NRP */}
          <Field label="NRP" required error={errors.nrp?.message}>
            <input
              {...register("nrp", {
                required: "NRP wajib diisi",
                pattern: { value: /^\d+$/, message: "NRP hanya boleh angka" },
              })}
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primaryPink outline-none"
              placeholder="e.g. 5025261..."
            />
          </Field>

          {/* Jabatan Field with Edit/Delete capabilities */}
          <Field label="Jabatan" required error={errors.role_id?.message}>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Controller
                    control={control}
                    name="role_id"
                    rules={{ required: "Jabatan wajib dipilih" }}
                    render={({ field }) => (
                      <Select
                        placeholder="Pilih Jabatan"
                        styles={selectStyles}
                        isLoading={loading}
                        options={roles.map((r) => ({
                          value: r.id,
                          label: r.name,
                        }))}
                        value={
                          roles
                            .map((r) => ({ value: r.id, label: r.name }))
                            .find((o) => o.value === field.value) || null
                        }
                        onChange={(opt) => field.onChange(opt?.value ?? "")}
                        isClearable
                      />
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsManagingRoles(!isManagingRoles)}
                  className={`px-3 rounded-lg border transition-colors ${isManagingRoles ? "bg-primaryPink text-white" : "bg-gray-100 text-gray-600"}`}
                  title="Kelola Daftar Jabatan"
                >
                  <FaEdit />
                </button>
              </div>

              {/* Collapsible Role Manager List */}
              {isManagingRoles && (
                <div className="mt-1 p-3 border rounded-lg bg-gray-50/50 flex flex-col gap-2 max-h-40 overflow-y-auto">
                  <p className="text-[10px] font-bold uppercase text-gray-400">
                    Daftar Jabatan (Klik untuk Edit/Hapus)
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRoleId(null);
                      setOpenRoleModal(true);
                      setIsCreating(true);
                    }}
                    className="flex items-center justify-center gap-2 self-start px-3 py-1.5 text-sm rounded-md border text-primaryPink border-primaryPink/40 hover:bg-primaryPink/10 transition w-full"
                  >
                    + Tambah Jabatan Baru
                  </button>
                  {roles.map((role, index) => (
                    <div
                      key={role.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center justify-between bg-white p-2 rounded border shadow-sm cursor-move select-none ${
                        draggedItemIndex === index
                          ? "opacity-30 border-primaryPink"
                          : "opacity-100 hover:border-primaryPink/50"
                      }`}
                    >
                      <span className="text-sm font-medium pointer-events-none">
                        {role.name}{" "}
                        <span className="text-xs text-gray-400">
                          (Lv. {role.level})
                        </span>
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleEditRoleClick(role);
                            setIsCreating(false);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1"
                        >
                          <FaRegEdit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRole(role)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FaRegTrashAlt size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <Field label="Departemen">
            <Controller
              control={control}
              name="department_id"
              render={({ field }) => (
                <Select
                  {...field}
                  options={depts.map((d) => ({ value: d.id, label: d.name }))}
                  value={depts
                    .map((d) => ({ value: d.id, label: d.name }))
                    .find((o) => o.value === field.value)}
                  onChange={(val) => field.onChange(val?.value)}
                  isClearable
                  styles={selectStyles}
                />
              )}
            />
          </Field>

          <Field label="Kabinet" required error={errors.cabinet_id?.message}>
            <Controller
              control={control}
              name="cabinet_id"
              render={({ field }) => (
                <Select
                  {...field}
                  options={cabinets.map((c) => ({
                    value: c.id,
                    label: c.tagline,
                  }))}
                  value={cabinets
                    .map((c) => ({ value: c.id, label: c.tagline }))
                    .find((o) => o.value === field.value)}
                  onChange={(val) => field.onChange(val?.value)}
                  styles={selectStyles}
                />
              )}
            />
          </Field>

          <div className="flex gap-3 pt-4">
            <Link
              href="/cp#manage-anggota"
              className="flex-1 border py-2.5 rounded-xl text-center bg-slate-900 text-white font-semibold transition-all hover:bg-slate-800 active:scale-95"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primaryPink text-white py-2.5 rounded-xl font-semibold shadow-lg shadow-pink-200 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Update Data"}
            </button>
          </div>
        </form>
      </div>

      {/* Add Role Modal */}
      {openRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Tambah Jabatan</h2>
            <form
              onSubmit={handleSubmitRole(onRoleSubmit)}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Nama Jabatan <span className="text-red-500">*</span>
                </label>
                <input
                  {...registerRole("name", {
                    required: "Nama jabatan wajib diisi",
                  })}
                  className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primaryPink outline-none"
                />
                {roleErrors.name && (
                  <p className="text-xs text-red-500">
                    {roleErrors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Level <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...registerRole("level", {
                    required: "Level wajib diisi",
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primaryPink outline-none"
                  placeholder="1"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Deskripsi</label>
                <textarea
                  {...registerRole("description")}
                  rows={3}
                  className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primaryPink outline-none"
                  placeholder="Opsional"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpenRoleModal(false);
                    resetRoleForm();
                  }}
                  className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button
                  disabled={roleSubmitting}
                  className="flex-1 bg-primaryPink text-white py-2 rounded-lg hover:opacity-80 transition-all disabled:bg-gray-300"
                  type="submit"
                >
                  {roleSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEDIA SELECTOR */}
      {openMedia && (
        <MediaSelector
          onSelect={(m) => {
            setPhoto(m);
            setValue("photo_id", m.id, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setOpenMedia(false);
          }}
          onClose={() => setOpenMedia(false)}
        />
      )}

      {/* Delete role modal */}
      {showDeleteRoleModal && roleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2 text-red-600">
              Hapus Jabatan
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus jabatan{" "}
              <span className="font-semibold">{roleToDelete.name}</span>?
              Tindakan ini{" "}
              <b>
                memengaruhi data anggota dengan jabatan ini dan tidak dapat
                dibatalkan
              </b>
              .
            </p>

            {deleteRoleError && (
              <p className="text-sm text-red-500 mb-3">{deleteRoleError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteRoleModal(false);
                  setRoleToDelete(null);
                }}
                disabled={deleteRoleLoading}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                onClick={confirmDeleteRole}
                disabled={deleteRoleLoading}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90 disabled:opacity-50"
              >
                {deleteRoleLoading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
      <LoadingFullScreen
        isSubmitting={isSubmitting}
        label="Submitting Member Data"
      />
    </main>
  );
}
