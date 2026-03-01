"use client";

import Unauthorized_404 from "@/components/admin/Unauthorized_404";
import HeaderSection from "@/components/commons/HeaderSection";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import api from "@/lib/axios";
import { GetAllCabinets } from "@/services/admin/GetAllCabinets";
import { GetAllRole } from "@/services/admin/GetAllRole";
import { PostCreateRole } from "@/services/admin/PostCreateRole";
import { useAdminAuth } from "@/services/admin/useAdminAuth";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { CreateMemberType } from "@/types/data/CreateMember";
import { CreateRoleType } from "@/types/data/CreateRole";
import { DepartmentType } from "@/types/data/DepartmentType";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import { RoleType } from "@/types/data/RoleType";
import { UUID } from "crypto";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FaCloudUploadAlt,
  FaEdit,
  FaRegEdit,
  FaRegTrashAlt,
} from "react-icons/fa";
import Select from "react-select";
import { StylesConfig } from "react-select";

type FormValues = CreateMemberType;
type RoleForm = CreateRoleType;

type OptionType = {
  label?: string;
  value?: string;
};

type PhotoData = {
  id: UUID | string;
  image_url: string;
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

export default function Page() {
  // Main Member Form
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      nrp: "",
      name: "",
      role_id: "",
      department_id: "",
      photo_id: undefined,
      cabinet_id: "",
    },
  });

  // Role Form
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

  // handle role edit functionality
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [isManagingRoles, setIsManagingRoles] = useState(false);
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleType | null>(null);
  const [deleteRoleLoading, setDeleteRoleLoading] = useState(false);
  const [deleteRoleError, setDeleteRoleError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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

    try {
      await PostCreateRole(payload);
      await fetchRoles();
      setOpenRoleModal(false);
      resetRoleForm();
      alert("Jabatan berhasil ditambahkan!");
    } catch (err) {
      console.error("API ERROR:", err);
      alert("Gagal menambahkan jabatan.");
    }
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
    }

    if (roleDirtyFields.description) {
      payload.description = data.description?.trim() || undefined;
      hasUpdates = true;
    }

    if (!hasUpdates) {
      alert("Tidak ada perubahan pada jabatan.");
      return;
    }

    try {
      await api.put(`/role/${editingRoleId}`, payload); // 🔥 JSON, BUKAN FormData
      alert("Jabatan berhasil diperbarui!");
      await fetchRoles();
      closeRoleModal();
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui jabatan.");
    }
  };

  const closeRoleModal = () => {
    setOpenRoleModal(false);
    setEditingRoleId(null);
    resetRoleForm({ name: "", level: undefined, description: "" });
  };

  const [roles, setRoles] = useState<RoleType[]>([]);
  const [depts, setDepts] = useState<DepartmentType[]>([]);
  const [cabinets, setCabinets] = useState<CabinetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRoleModal, setOpenRoleModal] = useState(false);

  // Fetch functions
  const fetchRoles = useCallback(async () => {
    try {
      const r = await GetAllRole(1, 50);
      setRoles(r.data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [d, c] = await Promise.all([
          GetAllDepts(1, 50),
          GetAllCabinets(1, 50),
        ]);
        await fetchRoles(); // Initial role fetch
        setDepts(d.data);
        setCabinets(c.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [fetchRoles]);

  // Submit main form
  const onSubmit = async (data: FormValues) => {
    try {
      // await PostCreateMember(data);
      const formData = new FormData();

      formData.append("nrp", data.nrp);
      formData.append("name", data.name);
      formData.append("role_id", data.role_id);
      formData.append("cabinet_id", data.cabinet_id);

      if (data.department_id) {
        formData.append("department_id", data.department_id);
      }

      if (data.photo_id && data.photo_id.length > 10) {
        formData.append("photo_id", data.photo_id);
      }

      await api.post("/member", formData);
      alert("Berhasil menambahkan anggota baru!");
      reset();
      setPhoto(null);
    } catch (err) {
      console.error("API ERROR: ", err);
      alert("Gagal menambahkan anggota baru :(");
    }
    reset();
  };

  // handle image upload
  const [openUpload, setOpenUpload] = useState(false);
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const resp = await api.post("/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedPhoto: PhotoData = resp.data.data;
      setPhoto(uploadedPhoto);
      setValue("photo_id", uploadedPhoto.id, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setOpenUpload(false);
      alert("Berhasil upload");
    } catch (err) {
      console.error(err);
      alert("Gagal upload");
    } finally {
      setUploading(false);
    }
  };

  // test if the jwt is here
  const { jwtToken, ready } = useAdminAuth();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SkeletonPleaseWait />
      </div>
    );
  }

  if (!jwtToken) {
    return <Unauthorized_404 />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primaryPink/20 via-white to-primaryGreen/20">
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow border">
        <HeaderSection title="Tambah Anggota" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          {/* Photo profile */}
          <div className="w-full flex items-center justify-center">
            <Field
              label="Photo Profile"
              required
              error={errors.photo_id?.message}
            >
              <div
                onClick={() => setOpenUpload(true)}
                className="group relative w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:opacity-90"
              >
                {photo ? (
                  <img
                    src={photo.image_url}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Upload</span>
                )}

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7h3l2-3h8l2 3h3v11H3V7z"
                    />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
              </div>
            </Field>
          </div>
          {/* Nama */}
          <Field label="Nama" required error={errors.name?.message}>
            <input
              {...register("name", {
                required: "Nama wajib diisi",
                minLength: { value: 3, message: "Minimal 3 karakter" },
              })}
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primaryPink outline-none"
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
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between bg-white p-2 rounded border shadow-sm"
                    >
                      <span className="text-sm font-medium">
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
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaRegEdit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRole(role)}
                          className="text-red-500 hover:text-red-700"
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

          {/* Departemen */}
          <Field label="Departemen">
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

          {/* Kabinet */}
          <Field label="Kabinet" required error={errors.cabinet_id?.message}>
            <Controller
              control={control}
              name="cabinet_id"
              rules={{ required: "Kabinet wajib dipilih" }}
              render={({ field }) => (
                <Select
                  placeholder="Pilih Kabinet"
                  styles={selectStyles}
                  options={cabinets.map((c) => ({
                    value: c.id,
                    label: c.tagline,
                  }))}
                  value={
                    cabinets
                      .map((c) => ({ value: c.id, label: c.tagline }))
                      .find((o) => o.value === field.value) || null
                  }
                  onChange={(opt) => field.onChange(opt?.value ?? "")}
                  isClearable
                />
              )}
            />
          </Field>

          <small className="text-red-500">* wajib diisi</small>

          <div className="flex gap-3 pt-4">
            <button
              className="flex-1 border py-2 rounded-lg hover:opacity-80 active:opacity-70 bg-black text-white transition-all"
              disabled={isSubmitting}
              type="button"
            >
              <Link href={"/admin/#manage-anggota"}>Back</Link>
            </button>
            <button
              type="button"
              onClick={() => reset()}
              disabled={isSubmitting}
              className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
            <button
              disabled={isSubmitting}
              className="flex-1 bg-primaryPink text-white py-2 rounded-lg active:bg-primaryPink/40 hover:opacity-80 transition-all disabled:bg-gray-300"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
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

      {openUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Upload</h2>

            <div
              onClick={() => {
                if (uploading) return;
                document.getElementById("upload-input")?.click();
              }}
              onDragOver={(e) => {
                if (!uploading) e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (uploading) return;

                const file = e.dataTransfer.files?.[0];
                if (file) handleUpload(file);
              }}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 transition-all
              ${
                uploading
                  ? "cursor-not-allowed opacity-60 bg-gray-100"
                  : "cursor-pointer hover:border-primaryPink hover:bg-pink-50"
              }
            `}
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-primaryPink">
                <FaCloudUploadAlt />
              </div>

              <p className="text-sm font-medium">
                {uploading ? "Uploading..." : "Klik atau drag file ke sini"}
              </p>

              <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>

              <input
                id="upload-input"
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={(e) => {
                  if (uploading) return;
                  if (e.target.files?.[0]) {
                    handleUpload(e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="flex gap-2 pt-6">
              <button
                type="button"
                disabled={uploading}
                onClick={() => {
                  setOpenUpload(false);
                  resetRoleForm();
                }}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
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
    </main>
  );
}
