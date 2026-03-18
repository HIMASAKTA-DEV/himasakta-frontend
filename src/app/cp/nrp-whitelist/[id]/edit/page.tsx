"use client";
import toast from "react-hot-toast";

import LoadingFullScreen from "@/components/admin/LoadingFullScreen";
import Unauthorized_404 from "@/components/admin/Unauthorized_404";
import HeaderSection from "@/components/commons/HeaderSection";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { useAdminAuth } from "@/services/admin/useAdminAuth";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { jwtToken, ready } = useAdminAuth();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const resp = await api.get(`/nrp-whitelist`);
        const raw = resp.data?.data ?? resp.data ?? [];
        const arr = Array.isArray(raw) ? raw : [];
        const found = arr.find((e: { id: string }) => e.id === id);
        if (found) {
          reset({ nrp: found.Nrp ?? "", name: found.Name ?? "" });
        }
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengambil data NRP whitelist");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: FormValues) => {
    const payload: Partial<FormValues> = {};
    if (dirtyFields.nrp) payload.nrp = data.nrp;
    if (dirtyFields.name) payload.name = data.name;

    if (Object.keys(payload).length === 0) {
      toast("Tidak ada perubahan.");
      return;
    }

    try {
      const resp = await api.put(`/nrp-whitelist/${id}`, payload);
      if (resp.status === 200) {
        toast.success("Berhasil memperbarui NRP whitelist!");
        router.push("/cp#manage-nrp-whitelist");
      }
    } catch (err) {
      toast.error(`Gagal: ${getApiErrorMessage(err)}`);
    }
  };

  // prevent scrolling when modal opened
  useEffect(() => {
    const isModalOpen = isSubmitting;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSubmitting]);

  if (!ready) return <SkeletonPleaseWait />;
  if (!jwtToken) return <Unauthorized_404 />;

  if (loading) {
    return (
      <LoadingFullScreen
        isSubmitting={true}
        label="Loading NRP Whitelist Data"
        styling="bg-white text-black"
      />
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primaryPink/20 via-white to-primaryGreen/20">
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow border">
        <HeaderSection title="Edit NRP Whitelist" />

        {loading ? (
          <div className="py-10 flex items-center justify-center">
            <SkeletonPleaseWait />
          </div>
        ) : (
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
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primaryPink text-white py-2.5 rounded-xl font-semibold shadow-lg shadow-pink-200 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Update"}
              </button>
            </div>
          </form>
        )}
        {isSubmitting && (
          <div className="flex w-full min-h-screen items-center justify-center bg-black/50 backdrop-blur-sm fixed inset-0 cursor-not-allowed">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primaryPink border-t-transparent" />
              <p className="font-averia text-lg text-white">
                Submitting NRP Whitelist Data...
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default page;
