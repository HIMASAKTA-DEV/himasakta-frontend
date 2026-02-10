import NextImage from "@/components/NextImage";
import Link from "next/link";
import DesktopNavbar from "./_navbar/DesktopNavbar";
import MobileNavbar from "./_navbar/MobileNavbar";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white h-[115px] px-12 border-b border-neutral-300 sticky top-0 z-[500]">
      {/* Ini bagian Logo */}
      <div>
        <Link href="/" className="flex items-center gap-[24px]">
          <NextImage
            src="/HimasaktaMain.png"
            width={46}
            height={46}
            alt="Himasakta"
          />
          <h1 className="font-averia text-[32px] font-bold">HIMASAKTA</h1>
        </Link>
      </div>

      {/* Ini bagian navigasi */}
      <DesktopNavbar />
      <MobileNavbar />
    </nav>
  );
}
