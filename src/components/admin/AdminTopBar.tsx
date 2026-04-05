import { useEffect, useState } from "react";
import AccDropDown from "./AccDropDown";

type Props = {
  usr: string;
  onLogout: () => void;
};

export default function TopBar({ usr, onLogout }: Props) {
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
        return (
          <div className="flex gap-2 items-center">
            <h1 className="text-md lg:text-lg font-semibold">
              Manage Kabinet:{" "}
            </h1>
            <p>Atur informasi kabinet</p>
          </div>
        );
      case "manage-department":
        return (
          <div className="flex gap-2 items-center">
            <h1 className="text-md lg:text-lg font-semibold">
              Manage Departemen:{" "}
            </h1>
            <p>Atur informasi departemen</p>
          </div>
        );
      case "manage-news":
        return (
          <div className="flex gap-2 items-center">
            <h1 className="text-md lg:text-lg font-semibold">
              Manage Berita:{" "}
            </h1>
            <p>Atur data berita</p>
          </div>
        );
      case "manage-gallery":
        return (
          <div className="flex gap-2 items-center">
            <h1 className="text-md lg:text-lg font-semibold">
              Manage Galeri:{" "}
            </h1>
            <p>Atur data galeri pada departemen</p>
          </div>
        );
      case "manage-anggota":
        return (
          <div className="flex gap-2 items-center">
            <h1 className="text-md lg:text-lg font-semibold">
              Manage Anggota:{" "}
            </h1>
            <p>Atur data anggota pada departemen</p>
          </div>
        );
      case "manage-progenda":
        return (
          <div className="flex gap-2 items-center">
            <h1 className="text-md lg:text-lg font-semibold">
              Manage Progenda:{" "}
            </h1>
            <p>Atur data program & agenda pada departemen</p>
          </div>
        );
      case "manage-kegiatan":
        return (
          <div className="flex gap-2 items-center">
            <h1 className="text-md lg:text-lg font-semibold">
              Manage Kegiatan:{" "}
            </h1>
            <p>Atur data kegiatan/GetToKnow pada halaman utama</p>
          </div>
        );
      case "manage-nrp-whitelist":
        return (
          <div className="flex gap-2 items-center">
            <h1 className="text-md lg:text-lg font-semibold">
              Manage Nrp Whitelist:
            </h1>
            <p>Atur siapa saja yang dapat mengakses tautan departemen</p>
          </div>
        );
      case "global-settings":
        return (
          <div className="flex gap-2 items-center">
            <h1 className="text-md lg:text-lg font-semibold">
              Global Settings:
            </h1>
            <p>Atur pengaturan lanjutan dan info umum web</p>
          </div>
        );
      default:
        return (
          <div className="flex gap-2 items-center">
            <h1 className="text-md lg:text-lg font-semibold">Dashboard: </h1>
            <p>Informasi akun dan dokumentasi website</p>
          </div>
        );
    }
  };

  return (
    <div className="flex justify-between items-center sticky top-0 gap-4 w-full z-[999] px-4 h-8 lg:py-2">
      {/* Mobile View: Marquee Container */}
      <div className="flex lg:hidden flex-1 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="inline-block px-4">{renderContent()}</span>
        </div>
      </div>
      {/* Desktop View: Static Content */}
      <div className="hidden lg:block relative w-full max-w-[85%]">
        {renderContent()}
      </div>

      <div className="flex-shrink-0">
        <AccDropDown usr={usr} onLogout={onLogout} />
      </div>
    </div>
  );
}
