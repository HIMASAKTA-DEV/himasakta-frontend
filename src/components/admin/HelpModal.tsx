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
      <h2 className="text-2xl font-semibold mb-4">ℹ️ Manage Department</h2>
      <h3 className="text-lg font-semibold mt-4">Navigasi halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4 mt-2">
        <li>
          Tombol{" "}
          <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm">
            <Link href={"/cp/department/add"}>+ Add Department</Link>
          </button>{" "}
          untuk pindah ke halaman tambah department.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
            <HiOutlinePencilAlt size={16} />
          </button>{" "}
          untuk pindah ke halaman edit department yang dipilih.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Fitur halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4">
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600">
            <HiOutlineTrash size={16} />
          </button>{" "}
          untuk menghapus department yang dipilih.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Info tambahan:</h3>
      <ol className="list-decimal pl-8 space-y-4">
        <li>
          Tiap departemen harus memiliki seorang <b>Ketua Departemen</b> agar
          struktur organisasi lengkap.
        </li>
        <li>
          Perubahan pada departemen akan langsung terlihat pada halaman daftar
          departemen di website utama.
        </li>
      </ol>
    </div>
  );
}

export function ManageEventHelp() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">ℹ️ Manage Kegiatan</h2>
      <h3 className="text-lg font-semibold mt-4">Navigasi halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4 mt-2">
        <li>
          Tombol{" "}
          <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm">
            <Link href={"/cp/kegiatan/add"}>+ Add Event</Link>
          </button>{" "}
          untuk pindah ke halaman tambah kegiatan.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
            <HiOutlinePencilAlt size={16} />
          </button>{" "}
          untuk pindah ke halaman edit kegiatan yang dipilih.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Fitur halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4">
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600">
            <HiOutlineTrash size={16} />
          </button>{" "}
          untuk menghapus kegiatan yang dipilih.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Info tambahan:</h3>
      <ol className="list-decimal pl-8 space-y-4">
        <li>
          Kegiatan ini muncul di bagian "What's On HIMASAKTA" pada halaman
          utama.
        </li>
        <li>
          Pastikan <b>link</b> kegiatan diisi dengan benar (misal ke postingan
          Instagram atau berita terkait) agar tombol "View Detail" berfungsi.
        </li>
      </ol>
    </div>
  );
}

export function ManageGalleryHelp() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">ℹ️ Manage Gallery</h2>
      <h3 className="text-lg font-semibold mt-4">Navigasi halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4 mt-2">
        <li>
          Tombol{" "}
          <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm">
            <Link href={"/cp/gallery/add"}>+ Add Gallery</Link>
          </button>{" "}
          untuk pindah ke halaman tambah gambar galeri.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
            <HiOutlinePencilAlt size={16} />
          </button>{" "}
          untuk pindah ke halaman edit informasi gambar.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Fitur halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4">
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-pink-50 hover:text-primaryPink">
            <HiOutlineEye size={18} />
          </button>{" "}
          untuk melihat pratinjau gambar secara penuh.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600">
            <HiOutlineTrash size={16} />
          </button>{" "}
          untuk menghapus gambar.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Info tambahan:</h3>
      <ol className="list-decimal pl-8 space-y-4">
        <li>
          Gambar bertanda <b>Undeleteable</b> tidak bisa dihapus karena sedang
          digunakan sebagai thumbnail Berita, Progenda, atau Logo Departemen.
        </li>
        <li>
          Jika ingin menghapus gambar tersebut, ganti terlebih dahulu thumbnail
          pada data yang terkait.
        </li>
      </ol>
    </div>
  );
}

export function ManageNewsHelp() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">ℹ️ Manage Berita</h2>
      <h3 className="text-lg font-semibold mt-4">Navigasi halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4 mt-2">
        <li>
          Tombol{" "}
          <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm">
            <Link href={"/cp/news/add"}>+ Add Post</Link>
          </button>{" "}
          untuk pindah ke halaman tulis berita baru.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
            <HiOutlinePencilAlt size={16} />
          </button>{" "}
          untuk mengedit isi berita.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Fitur halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4">
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-pink-50 hover:text-primaryPink">
            <HiOutlineEye size={18} />
          </button>{" "}
          untuk melihat <b>Quick Preview</b> isi berita sebelum dipublikasikan.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600">
            <HiOutlineTrash size={16} />
          </button>{" "}
          untuk menghapus berita secara permanen.
        </li>
      </ol>
    </div>
  );
}

export function ManageNRPWhitelistHelp() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">ℹ️ Manage NRP Whitelist</h2>
      <h3 className="text-lg font-semibold mt-4">Fungsi Halaman:</h3>
      <p className="mt-2">
        Mengelola daftar NRP mahasiswa yang diperbolehkan untuk mengakses sistem
        khusus (misal: pendaftaran internal, voting, atau akses materi
        eksklusif).
      </p>
      <h3 className="text-lg font-semibold mt-4">Fitur halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4 mt-2">
        <li>
          Tombol <b>+ Add NRP</b> untuk menambah entitas whitelist baru.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
            <HiOutlinePencilAlt size={16} />
          </button>{" "}
          untuk mengoreksi nama atau NRP.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600">
            <HiOutlineTrash size={16} />
          </button>{" "}
          untuk mencabut akses NRP tersebut.
        </li>
      </ol>
    </div>
  );
}

export function ManageProgendaHelp() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">ℹ️ Manage Progenda</h2>
      <h3 className="text-lg font-semibold mt-4">Navigasi halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4 mt-2">
        <li>
          Tombol{" "}
          <button className="px-4 py-2 bg-primaryPink text-white font-libertine rounded-lg hover:opacity-90 active:opacity-80 duration-300 transition-all max-lg:text-sm">
            <Link href={"/cp/progenda/add"}>+ Add Progenda</Link>
          </button>{" "}
          untuk menambah program atau agenda baru.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
            <HiOutlinePencilAlt size={16} />
          </button>{" "}
          untuk mengedit konten progenda.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Fitur halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4">
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-pink-50 hover:text-primaryPink">
            <HiOutlineEye size={18} />
          </button>{" "}
          untuk melihat pratinjau konten progenda.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600">
            <HiOutlineTrash size={16} />
          </button>{" "}
          untuk menghapus progenda.
        </li>
      </ol>
    </div>
  );
}

export function ManageGlobalSettingHelp() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">ℹ️ Manage Global Setting</h2>
      <h3 className="text-lg font-semibold mt-4">Fungsi Halaman:</h3>
      <p className="mt-2">
        Mengatur konfigurasi website yang berlaku secara menyeluruh (Global).
      </p>
      <h3 className="text-lg font-semibold mt-4">Fitur Utama:</h3>
      <ol className="list-decimal pl-8 space-y-4 mt-2">
        <li>
          <b>Maintenance Mode</b>: Gunakan toogle ini jika ingin menutup akses
          website untuk publik saat sedang dalam perbaikan.
        </li>
        <li>
          <b>Assets & Branding</b>: Ganti logo website dan logo kabinet secara
          dinamis.
        </li>
        <li>
          <b>Social Links</b>: Update tautan media sosial HIMASAKTA ITS yang
          muncul di footer.
        </li>
      </ol>
    </div>
  );
}

export function ManageAnggotaHelp() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">ℹ️ Manage Anggota</h2>
      <h3 className="text-lg font-semibold mt-4">Fungsi Halaman:</h3>
      <p className="mt-2">
        Mengelola data fungsionaris/anggota tiap departemen dalam kabinet.
      </p>
      <h3 className="text-lg font-semibold mt-4">Fitur halaman:</h3>
      <ol className="list-decimal pl-8 space-y-4 mt-2">
        <li>
          <b>Filter Departemen</b>: Gunakan dropdown untuk mempermudah mencari
          anggota di departemen tertentu.
        </li>
        <li>
          Tombol <b>+ Add Member</b> untuk menambah anggota baru.
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
            <HiOutlinePencilAlt size={16} />
          </button>{" "}
          untuk mengedit data personal anggota (NRP, Nama, Jabatan).
        </li>
        <li>
          Ikon{" "}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600">
            <HiOutlineTrash size={16} />
          </button>{" "}
          untuk menghapus data anggota.
        </li>
      </ol>
      <h3 className="text-lg font-semibold mt-4">Info tambahan:</h3>
      <ol className="list-decimal pl-8 space-y-4">
        <li>
          Setiap departemen sebaiknya memiliki minimal satu anggota dengan role{" "}
          <b>Ketua Departemen</b>.
        </li>
      </ol>
    </div>
  );
}
