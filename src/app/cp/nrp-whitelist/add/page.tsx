"use client";
import toast from "react-hot-toast";

import HeaderSection from "@/components/commons/HeaderSection";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { useAdminAuth } from "@/services/admin/useAdminAuth";
import Link from "next/link";
import { useForm } from "react-hook-form";

type FormValues = { nrp: string; name: string };

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
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function page() {
  const { ready } = useAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ defaultValues: { nrp: "", name: "" } });

  const onSubmit = async (data: FormValues) => {
    try {
      const resp = await api.post("/nrp-whitelist/add", data);
      if (resp.status === 201 || resp.status === 200) {
        toast.success("Berhasil menambahkan NRP whitelist!");
        reset();
      }
    } catch (err) {
      toast.error(`Gagal: ${getApiErrorMessage(err)}`);
    }
  };

  if (!ready) return <SkeletonPleaseWait />;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primaryPink/20 via-white to-primaryGreen/20">
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow border">
        <HeaderSection title="Tambah NRP Whitelist" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-5"
        >
          <Field
            label="NRP (Nomor Registrasi Pokok)"
            required
            error={errors.nrp?.message}
          >
            <input
              {...register("nrp", { required: "NRP wajib diisi" })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primaryPink/40 focus:border-primaryPink outline-none transition-all"
              placeholder="5025251104"
            />
          </Field>

          <Field label="Nama Lengkap" required error={errors.name?.message}>
            <input
              {...register("name", { required: "Nama wajib diisi" })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primaryPink/40 focus:border-primaryPink outline-none transition-all"
              placeholder="John Doe"
            />
          </Field>

          <div className="flex gap-3 pt-4">
            <Link
              href="/cp#manage-nrp-whitelist"
              className="flex-1 border py-2.5 rounded-xl text-center bg-slate-900 text-white font-semibold transition-all hover:bg-slate-800 active:scale-95"
            >
              Back
            </Link>
            <button
              type="button"
              onClick={() => reset()}
              disabled={isSubmitting}
              className="flex-1 border py-2.5 rounded-xl font-semibold text-gray-600 transition-all hover:bg-gray-50 active:scale-95"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primaryPink text-white py-2.5 rounded-xl font-semibold shadow-lg shadow-pink-200 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default page;
