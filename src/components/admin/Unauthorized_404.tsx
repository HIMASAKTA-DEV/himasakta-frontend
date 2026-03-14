import Link from "next/link";
import HeaderSection from "../commons/HeaderSection";

function Unauthorized_404() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
      <HeaderSection
        title={"401 Unauthorized"}
        sub={"Anda kemungkinan keluar dari halaman admin, silahkan login ulang"}
      />
      <button className="px-4 py-2 bg-black text-white rounded-md font-bold hover:opacity-80 active:opacity-70 duration-300 transition-all">
        <Link href={"/cp"}>Ke Halaman Login</Link>
      </button>
    </div>
  );
}

export default Unauthorized_404;
