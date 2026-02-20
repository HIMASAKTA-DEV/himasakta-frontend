"use client";

import ManageAnggota from "@/components/admin/ManageAnggota";
import ManageCabinet from "@/components/admin/ManageCabinet";
import ManageDepartment from "@/components/admin/ManageDepartment";
import ManageGallery from "@/components/admin/ManageGallery";
import ManageNews from "@/components/admin/ManageNews";
import ManageProgenda from "@/components/admin/ManageProgenda";
import Sidebar from "@/components/admin/Sidebar";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [active, setActive] = useState<string>("dashboard");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setActive(hash || "dashboard");
    };

    handleHashChange(); // initial load
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
      default:
        return <ManageCabinet />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} />
      <main className="flex-1 p-6 bg-gray-50">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search data..."
            className="w-full max-w-md rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {renderContent()}
      </main>
    </div>
  );
}
