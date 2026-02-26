"use client";

import HeaderSection from "@/components/commons/HeaderSection";
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
  role: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: FormValues) => {
    console.log("SUBMIT:", data);

    // contoh async submit
    await new Promise((r) => setTimeout(r, 1000));

    reset();
  };

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-primaryPink/20 via-white to-primaryGreen/20">
      {/* background kamu tetap */}
      <div className="lg:w-[50vw] relative flex flex-col gap-6 bg-white/70 backdrop-blur-2xl p-10 rounded-2xl w-full max-w-xl items-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 animate-fade-in">
        <HeaderSection title="Tambah Anggota" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          {/* NAMA */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama</label>
            <input
              {...register("name", {
                required: "Nama wajib diisi",
                minLength: {
                  value: 3,
                  message: "Minimal 3 karakter",
                },
              })}
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primaryPink outline-none"
              placeholder="Nama lengkap"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email wajib diisi",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Format email tidak valid",
                },
              })}
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primaryPink outline-none"
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* ROLE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Role</label>
            <select
              {...register("role", {
                required: "Role wajib dipilih",
              })}
              className="px-4 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primaryPink outline-none"
            >
              <option value="">Pilih Role</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primaryPink text-white py-2 rounded-lg hover:opacity-90 disabled:opacity-60 transition"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>

            <button
              type="button"
              onClick={() => reset()}
              className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
