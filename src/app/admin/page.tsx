"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiChevronDown,
  HiPlus,
  HiSearch,
  HiPencil,
  HiEye,
  HiTrash,
  HiChevronRight,
  HiLockClosed,
  HiUser,
} from "react-icons/hi";
import {
  FaUserFriends,
  FaRegNewspaper,
  FaBuilding,
  FaImages,
  FaSignOutAlt,
} from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { login } from "@/services/api";
import { toast } from "react-hot-toast";
import { AuthResponse } from "@/types";

const sidebarLinks = [
  { name: "Kabinet", icon: FaUserFriends, id: "kabinet" },
  { name: "Departemen", icon: FaBuilding, id: "departemen" },
  { name: "Berita", icon: FaRegNewspaper, id: "berita", active: true },
  { name: "Galeri", icon: FaImages, id: "galeri" },
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

  useEffect(() => {
    const token = localStorage.getItem("docs_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

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
                onClick={() => setActiveTab(link.id)}
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
          <div className="relative group w-96">
            <input
              type="text"
              placeholder="Find something here..."
              className="w-full pl-12 pr-4 py-2.5 bg-[#F8F9FA] rounded-full text-sm border border-transparent focus:bg-white focus:border-slate-200 focus:outline-none transition-all"
            />
            <HiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
          </div>

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
              <button className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <HiPlus size={20} />
                Add {activeTab}
              </button>
            </div>

            {/* Grid of News (Cards from Design Reference) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 group hover:shadow-2xl hover:shadow-slate-300/40 transition-all duration-500 animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt="News"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-widest shadow-sm">
                        {activeTab}
                      </span>
                    </div>
                  </div>
                  <div className="p-7">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                      Lorem ipsum dolor sit amet.
                    </h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                      09 Februari 2024
                    </p>

                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
                        <HiPencil size={18} />
                      </button>
                      <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-accent/10 hover:text-accent transition-all">
                        <HiEye size={18} />
                      </button>
                      <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                        <HiTrash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-12 flex justify-center items-center gap-2">
              <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-primary transition-all shadow-sm">
                <HiChevronRight className="rotate-180" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20">
                1
              </button>
              <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center font-bold hover:border-primary hover:text-primary transition-all">
                2
              </button>
              <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-primary transition-all shadow-sm">
                <HiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
