import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import RenderPagination from "../_news/RenderPagination";

type HelpModalProps = {
  children: React.ReactNode;
  onClose: Dispatch<SetStateAction<boolean>>;
};

export function HelpModal({ children, onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-3xl shadow-xl flex flex-col max-h-[80vh]">
        <div className="overflow-y-auto flex-1">
          {children}

          <div className="mt-4">
            <details>
              <summary>🐞 Laporkan masalah</summary>
              <p>Fakhrul: +6285385539271 (WA only, no call)</p>
              <p>Brahmana: +6285100879325 (WA only, no call)</p>
            </details>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 duration-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// the children data
type ManageCabinetHelpProps = {
  currPg: number;
  totPage: number;
  setCurrPg: React.Dispatch<React.SetStateAction<number>>;
  limCabinets: number;
  setLimCabinets: React.Dispatch<React.SetStateAction<number>>;
};

export function ManageCabinetHelp({
  currPg,
  totPage,
  setCurrPg,
  limCabinets,
  setLimCabinets,
}: ManageCabinetHelpProps) {
  return (
    <>
      <>
        <h2 className="text-2xl font-semibold mb-4">ℹ️ Manage Kabinet</h2>
        <div className="overflow-y-auto h-[80%]">
          <div className="mt-4">
            <b>Navigasi halaman:</b>
          </div>
          <ol className="list-decimal pl-8 space-y-4 mt-4">
            <li>
              Tombol{" "}
              <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm">
                <Link href={"/cp/cabinet/add"}>+ Add Cabinet</Link>
              </button>{" "}
              untuk pindah ke halaman tambah kabinet.
            </li>
            <li>
              Ikon{" "}
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
                <HiOutlinePencilAlt size={16} />
              </button>{" "}
              untuk pindah ke halaman edit kabinet yang dipilih.
            </li>
          </ol>
          <div className="mt-4">
            <b>Fitur halaman:</b>
          </div>
          <ol className="list-decimal pl-8 space-y-4">
            <li>
              Tombol navigasi halaman{" "}
              <RenderPagination
                currPage={currPg}
                totPage={totPage}
                onChange={setCurrPg}
                styling="inline-flex"
              />{" "}
              untuk mengambil data kabinet di halaman lain.
            </li>
            <li>
              Dropdown{" "}
              <div className="inline-flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 font-libertine">
                  Show
                </label>
                <select
                  value={limCabinets}
                  onChange={(e) => {
                    setLimCabinets(Number(e.target.value));
                    setCurrPg(1); // reset to first page
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primaryPink/50 transition-all cursor-pointer"
                >
                  {[5, 10, 15, 20].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>{" "}
              untuk mengubah banyak kabinet pada tabel dalam satu halaman.
            </li>
            <li>
              Ikon{" "}
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600">
                <HiOutlineTrash size={16} />
              </button>{" "}
              untuk menghapus kabinet yang dipilih. Perhatikan bahwa kabinet
              yang dihapus <b>harus tidak aktif</b>.
            </li>
            <li>
              Ikon{" "}
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-pink-50 hover:text-primaryPink">
                <HiOutlineEye size={18} />
              </button>{" "}
              untuk melihat pratinjau kabinet saat website dalam mode
              maintenance.
            </li>
          </ol>
          <div className="mt-4">
            <b>Info tambahan:</b>
          </div>
          <ol className="list-decimal pl-8 space-y-4">
            <li>
              Pastikan untuk mengaktifkan <b>HANYA 1 kabinet</b> untuk
              ditampilkan di halaman utama. Ini dilakukan untuk menjaga
              integritas data website ini.
            </li>
            <li>
              Jika ada error, coba cek koneksi internet anda. Jika tidak ada
              masalah internet laporkan kami.
            </li>
          </ol>
        </div>
      </>
    </>
  );
}

export function ManageDepartmentHelp() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">ℹ️ Manage Kabinet</h2>
      <h3 className="text-lg font-semibold mt-4">Navigasi halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4 mt-2">
        <li>
          Tombol{" "}
          <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm">
            <Link href={"/cp/department/add"}>+ Add Department</Link>
          </button>{" "}
          untuk pindah ke halaman tambah kabinet.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
            <HiOutlinePencilAlt size={16} />
          </button>{" "}
          untuk pindah ke halaman edit kabinet yang dipilih.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Fitur halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4">
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600">
            <HiOutlineTrash size={16} />
          </button>{" "}
          untuk menghapus kabinet yang dipilih. Perhatikan bahwa kabinet yang
          dihapus <b>harus tidak aktif</b>.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Info tambahan:</h3>
      <ol className="list-decimal pl-8 space-y-4">
        <li>
          Pastikan untuk mengaktifkan <b>HANYA 1 kabinet</b> untuk ditampilkan
          di halaman utama. Ini dilakukan untuk menjaga integritas data website
          ini.
        </li>
        <li>
          Jika ada error, coba cek koneksi internet anda. Jika tidak ada masalah
          internet laporkan kami.
        </li>
      </ol>
    </div>
  );
}
