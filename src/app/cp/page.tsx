"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import NextImage from "@/components/NextImage";
import AdminTopBar from "@/components/admin/AdminTopBar";
import {
  DashboardAdmin,
  GlobalSetting,
  ManageAnggota,
  ManageCabinet,
  ManageDepartment,
  ManageEvent,
  ManageGallery,
  ManageNews,
  ManageNrpWhitelist,
  ManageProgenda,
} from "@/components/admin/ManageEverything";
import Sidebar from "@/components/admin/Sidebar";
import ImageFallback from "@/components/commons/ImageFallback";
import SkeletonPleaseWait from "@/components/commons/skeletons/SkeletonPleaseWait";
import ButtonLink from "@/components/links/ButtonLink";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import clsx from "clsx";
import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa";

type LoginForm = {
  username: string;
  password: string;
};

type JwtResp = {
  token: string;
};

export default function AdminPage() {
  const [jwt, setJwt] = useState<string | null>(null);
  const [usr, setUsr] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isReady, setIsReady] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  // handle data storage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("jwt_token");
    const username = localStorage.getItem("admin_username");

    if (token && username) {
      setJwt(token);
      setUsr(username);
    } else {
      setJwt(null);
      setUsr("");
    }

    setIsReady(true); // auth state sudah siap
  }, []);

  // handle auth/login
  const handleAuth = async (data: LoginForm) => {
    setErrMsg("");
    try {
      const resp = await api.post<ApiResponse<JwtResp>>("/auth/login", data);
      const token = resp.data.data.token;

      localStorage.setItem("jwt_token", token);
      localStorage.setItem("admin_username", data.username);

      setJwt(token);
      setUsr(data.username);
    } catch {
      setErrMsg("NRP atau password salah");
    }
  };

  // handle logout
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("admin_username");

    setJwt(null);
    setUsr("");
  };

  // sidebar nav
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    const handleHashChange = () => {
      setActive(window.location.hash.replace("#", "") || "dashboard");
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderContent = () => {
    switch (active) {
      case "manage-cabinet":
        return <ManageCabinet />;
      case "manage-department":
        return <ManageDepartment />;
      case "manage-news":
        return <ManageNews />;
      case "manage-gallery":
        return <ManageGallery />;
      case "manage-anggota":
        return <ManageAnggota />;
      case "manage-progenda":
        return <ManageProgenda />;
      case "manage-kegiatan":
        return <ManageEvent />;
      case "manage-nrp-whitelist":
        return <ManageNrpWhitelist />;
      case "global-settings":
        return <GlobalSetting />;
      default:
        return <DashboardAdmin usr={usr} onLogout={handleLogout} />;
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-pulse text-gray-500">
          <SkeletonPleaseWait />
        </span>
      </div>
    );
  }

  // if authed
  if (jwt) {
    return (
      <div
        className="flex min-h-screen sticky top-0 overflow-x-clip"
        data-lenis-prevent
      >
        {/* SIDEBAR */}
        <aside
          className="
            fixed
            top-0
            left-0
            h-screen
            w-20 lg:w-80
            bg-white/70
            backdrop-blur-xl
            border-r
            z-50 shadow-md
            "
        >
          <Sidebar active={active} />
        </aside>
        <main
          className="flex-1 bg-white ml-20 lg:ml-80 overflow-auto"
          data-lenis-prevent
        >
          {/* Sesuaikan ml sesuai ukuran sidebar */}
          <div className="fixed px-4 py-8 max-lg:py-8 top-0 bg-white/60 backdrop-blur-3xl w-full shadow-md z-40" />
          <div className="px-4 py-4 fixed top-0 z-50 w-[83vw]">
            <AdminTopBar usr={usr} onLogout={handleLogout} />
          </div>
          <div className="p-6 py-20">{renderContent()}</div>
        </main>
      </div>
    );
  }

  // login page
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      <main className="w-full min-h-screen items-center justify-center flex overflow-hidden">
        <div className="w-full items-center justify-center bg-primaryPink min-h-screen [@media((max-width:1023px)_or_(orientation:portrait))]:hidden [@media((min-width:1023px)_and_(orientation:landscape)]:flex relative">
          <section className="relative w-full min-h-screen overflow-hidden">
            <Image
              src="/images/HeroLogin.jpg"
              alt="hero-image"
              fill
              priority
              className="
                object-cover
                object-center
                [mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]
                [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]
              "
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primaryPink/100 via-primaryPink/60 to-transparent backdrop-blur-[2px]" />

            {/* Ini bagian Title */}
            <div className="relative z-499 flex h-full items-center px-12 lg:px-32 font-libertine py-72 justify-center">
              <div className="flex flex-col gap-6">
                <h1 className="text-white text-4xl lg:text-5xl font-bold font-inter">
                  Content Management System
                </h1>
                <div className="flex items-center gap-4 mt-10">
                  <div className="flex flex-col w-full items-center mb-4">
                    <div className="flex items-center w-full p-2 gap-2 mt-2 justify-center">
                      <NextImage
                        src={"/HimasaktaMainWhite.png"}
                        width={108}
                        height={108}
                        alt="HIMASAKTA ITS"
                      />
                      <h1
                        className={clsx(
                          "font-averia text-[70px] hidden lg:inline-block font-bold transition-colors duration-300",
                          "text-white",
                        )}
                      >
                        HIMASAKTA
                      </h1>
                    </div>
                    <h1 className="font-inter hidden lg:inline-block text-[50px] font-bold transition-colors duration-300  text-white">
                      Administrator
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="w-full items-center justify-center">
          {/* Background + Login */}
          <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br max-lg:from-primaryPink/20 max-lg:via-white max-lg:to-primaryGreen/20">
            {/* Animated bg */}
            <div className="absolute inset-0 -z-10 overflow-hidden lg:hidden">
              <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-primaryPink/40 rounded-full blur-2xl animate-blob" />
              <div className="absolute top-1/4 -right-40 w-[36rem] h-[36rem] bg-primaryGreen/40 rounded-full blur-2xl animate-blob [animation-delay:3s]" />
              <div className="absolute bottom-[-10rem] left-1/4 w-[34rem] h-[34rem] bg-pink-300/40 rounded-full blur-2xl animate-blob [animation-delay:6s]" />
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleSubmit(handleAuth)}
              className="
                relative
                flex flex-col gap-4
                p-10 rounded-2xl
                w-full max-w-full
                items-center
                animate-fade-in
              max-lg:bg-gray-100/70
                max-lg:backdrop-blur-2xl
                max-lg:shadow-[0_20px_50px_rgba(0,0,0,0.1)]
                max-lg:border max-lg:border-white/40
              "
            >
              <h1 className="text-3xl font-bold text-center">
                Login Admin HIMASAKTA ITS
              </h1>
              <div className="w-[70%] relative aspect-video rounded-lg shadow-md">
                <ImageFallback
                  isFill
                  src={`/images/Logo-Himasakta-Full.png`}
                  imgStyle="object-top rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <small className="text-red-600 font-semibold text-center">
                  Acces Restricted
                </small>
                <small className="text-gray-500 font-semibold text-center">
                  Login untuk akses content management system website
                </small>
              </div>

              <div className="w-full">
                <label className="font-semibold">Username</label>
                <input
                  {...register("username", {
                    required: "Username wajib diisi",
                  })}
                  className="w-full mt-1 px-3 py-2 rounded border bg-white/50 focus:bg-white transition-colors outline-none focus:ring-2 ring-primaryGreen/20"
                  placeholder="e.g. John Doe"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="font-semibold">Password</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password wajib diisi",
                  })}
                  className="w-full mt-1 px-3 py-2 rounded border bg-white/50 focus:bg-white transition-colors outline-none focus:ring-2 ring-primaryGreen/20"
                  placeholder="e.g. 50251234567890"
                />
              </div>

              {errMsg && <p className="text-red-500 font-medium">{errMsg}</p>}

              <button
                disabled={isSubmitting}
                className="bg-black hover:bg-zinc-800 text-white py-2.5 rounded-lg w-full transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <small className="text-gray-400 font-medium mt-4 landscape:mb-10">
                &copy; HIMASAKTA ITS 2026 | Flexoo Academy
              </small>
            </form>
          </div>
        </div>
      </main>

      {/* Back Home Button */}
      <ButtonLink
        href="/"
        variant="black"
        className="
          absolute
          bottom-6
          left-6
          lg:bottom-8
          lg:left-16
          flex items-center gap-3
          w-28
        "
      >
        <FaChevronLeft />
        <p>Home</p>
      </ButtonLink>
    </div>
  );
}
