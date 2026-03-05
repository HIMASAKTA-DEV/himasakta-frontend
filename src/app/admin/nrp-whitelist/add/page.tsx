"use client";

import HeaderSection from "@/components/commons/HeaderSection";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { NrpWhitelistType } from "@/types/data/NrpWhitelistType";
import Link from "next/link";
import { useForm } from "react-hook-form";

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

function page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NrpWhitelistType>({
    defaultValues: {
      nrp: "",
      name: "",
    },
  });

  const onSubmit = async (data: NrpWhitelistType) => {
    try {
      await api.post("/nrp-whitelist/add", data);
      alert("Berhasil menambahkan NRP whitelist baru!");
      reset();
    } catch (err) {
      alert(`Gagal menambahkan NRP whitelist: ${getApiErrorMessage(err)}`);
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primaryPink/20 via-white to-primaryGreen/20">
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow border">
        <HeaderSection title={"Tambah Whitelist"} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <div className="w-full flex flex-col mb-8 gap-4 items-cebter justify-center">
            <div>
              <Field label="Nama" required error={errors.name?.message}>
                <input
                  {...register("name", { required: "Nama wajib diisi" })}
                  className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primaryPink outline-none"
                  placeholder="Nama Lengkap"
                />
              </Field>
            </div>
            <div>
              <Field
                label="NRP (Nomor Registrasi Pokok)"
                required
                error={errors.name?.message}
              >
                <input
                  {...register("nrp", { required: "NRP wajib diisi" })}
                  className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primaryPink outline-none"
                  placeholder="Nama Lengkap"
                />
              </Field>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              className="flex-1 border py-2 rounded-lg hover:opacity-80 active:opacity-70 bg-black text-white transition-all"
              disabled={isSubmitting}
              type="button"
            >
              <Link href={"/admin#manage-nrp-whitelist"}>Back</Link>
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
    </main>
  );
}

export default page;
