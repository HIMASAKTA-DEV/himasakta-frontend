import Link from "next/link";
import HeaderSection from "../commons/HeaderSection";

// TODO: Gak ada GET requestnya
function ManageNrpWhitelist() {
  return (
    <main className="flex w-full min-h-screen gap-8 p-4 flex-col lg:p-10">
      <div className="flex w-full items-center lg:justify-between max-lg:flex-col gap-2">
        <HeaderSection
          title={"Manage Whitelist"}
          sub={"Atur NRP yang dapat mengakses informasi khusus"}
          subStyle="text-black font-libertine"
        />
        <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90  active:opacity-80 duration-300 transition-all max-lg:text-sm">
          <Link href={"/admin/kegiatan/add"}>+ Add Event</Link>
        </button>
      </div>
    </main>
  );
}

export default ManageNrpWhitelist;
