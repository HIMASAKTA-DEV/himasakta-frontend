"use client";

import HeaderSection from "@/components/commons/HeaderSection";
import { GetAllCabinets } from "@/services/admin/GetAllCabinets";
import { GetAllRole } from "@/services/admin/GetAllRole";
import { PostCreateRole } from "@/services/admin/PostCreateRole";
import { GetAllDepts } from "@/services/departments/GetAllDepts";
import { CreateMemberType } from "@/types/data/CreateMember";
import { CreateRoleType } from "@/types/data/CreateRole";
import { DepartmentType } from "@/types/data/DepartmentType";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import { RoleType } from "@/types/data/RoleType";
import { useEffect, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { StylesConfig } from "react-select";

type FormValues = CreateMemberType;
type RoleForm = CreateRoleType;

type OptionType = {
  label?: string;
  value?: string;
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

export default function Page() {
  // Main Member Form
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      nrp: "",
      role_id: "",
      department_id: "",
      cabinet_id: "",
      photo_id: "",
    },
  });

  // Role Form
  const {
    register: registerRole,
    handleSubmit: handleSubmitRole,
    reset: resetRoleForm,
    formState: { errors: roleErrors, isSubmitting: roleSubmitting },
  } = useForm<RoleForm>();

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
    // Add your PostCreateMember service here
    reset();
  };

  // Submit Role form
  const onRoleSubmit = async (data: RoleForm) => {
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

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primaryPink/20 via-white to-primaryGreen/20">
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow border">
        <HeaderSection title="Tambah Anggota" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
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

          {/* Jabatan */}
          <Field label="Jabatan" required error={errors.role_id?.message}>
            <div className="flex flex-col gap-2">
              <Controller
                control={control}
                name="role_id"
                rules={{ required: "Jabatan wajib dipilih" }}
                render={({ field }) => (
                  <Select
                    placeholder="Pilih Jabatan"
                    styles={selectStyles}
                    isLoading={loading}
                    options={roles.map((r) => ({ value: r.id, label: r.name }))}
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
              <button
                type="button"
                onClick={() => setOpenRoleModal(true)}
                className="self-start px-3 py-1.5 text-sm rounded-md border text-primaryPink border-primaryPink/40 hover:bg-primaryPink/10 transition w-full"
              >
                + Tambah Jabatan Baru
              </button>
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
              disabled={isSubmitting}
              className="flex-1 bg-primaryPink text-white py-2 rounded-lg active:bg-primaryPink/40 hover:opacity-80 transition-all disabled:bg-gray-300"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              Reset
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
                  disabled={roleSubmitting}
                  className="flex-1 bg-primaryPink text-white py-2 rounded-lg hover:opacity-80 transition-all disabled:bg-gray-300"
                  type="submit"
                >
                  {roleSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
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
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

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
