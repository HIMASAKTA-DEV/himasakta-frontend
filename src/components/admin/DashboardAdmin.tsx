import HeaderSection from "../commons/HeaderSection";

type Props = {
  usr: string;
  onLogout: () => void;
};

function DashboardAdmin({ usr, onLogout }: Props) {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <HeaderSection title="Dashboard" />

        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Hi {usr} 👋</h1>

          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Logout
          </button>
        </div>

        <p>How are you today?</p>
      </div>
      <main className="flex flex-col gap-4 p-4">
        <h1 className="font-inter font-bold text-4xl text-center">
          Getting Started
        </h1>
        <ul className="list-none flex flex-col gap-4">
          <li className="flex flex-col gap-4 items-start mb-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-black"></span>
              <h1 className="font-inter font-bold text-3xl">
                What is Administrator Page?
              </h1>
            </div>
            <p>
              <span className="font-bold">
                An Administrator page or section
              </span>{" "}
              in software design is a dedicated interface used by authorized
              users—such as administrators or system maintainers—to manage,
              control, and configure the content, data, and behavior of a
              software application. This section typically provides tools for
              creating, reading, updating, and deleting (CRUD) data stored in
              the system’s database. Administrators can manage users, roles,
              permissions, content entries, media assets, and system settings
              through this interface. In many systems, the administrator page
              functions as a Content Management System (CMS), allowing
              non-technical users to update application content without
              modifying the source code. In other cases, it may also act as a
              Database Management System (DBMS) at the application level,
              offering structured access to underlying data while enforcing
              validation, security, and access control. Overall, the
              administrator section plays a crucial role in maintaining the
              integrity, security, and scalability of the software by
              centralizing management tasks and restricting access to sensitive
              operations.
            </p>
            <p>
              <span className="font-bold">
                Halaman atau bagian administrator
              </span>{" "}
              dalam perancangan perangkat lunak merupakan antarmuka khusus yang
              digunakan oleh pengguna dengan hak akses tertentu, seperti
              administrator atau pengelola sistem, untuk mengelola, mengontrol,
              dan mengonfigurasi konten, data, serta perilaku dari sebuah
              aplikasi. Bagian ini umumnya menyediakan fitur untuk melakukan
              operasi Create, Read, Update, dan Delete (CRUD) terhadap data yang
              tersimpan di dalam basis data. Melalui halaman administrator,
              pengelola sistem dapat mengatur data pengguna, peran dan hak
              akses, konten aplikasi, media, serta pengaturan sistem lainnya.
              Dalam banyak aplikasi, halaman administrator berfungsi sebagai
              Content Management System (CMS), yang memungkinkan pembaruan
              konten dilakukan tanpa perlu mengubah kode program secara
              langsung. Selain itu, pada tingkat tertentu, halaman ini juga
              dapat berperan sebagai sistem manajemen basis data (DBMS) di level
              aplikasi, dengan menyediakan akses terstruktur terhadap data
              sekaligus menerapkan validasi, keamanan, dan pembatasan akses.
              Secara keseluruhan, halaman administrator memiliki peran penting
              dalam menjaga keamanan, konsistensi, dan skalabilitas perangkat
              lunak dengan memusatkan proses pengelolaan dan membatasi akses
              terhadap operasi yang bersifat sensitif.
            </p>
          </li>
          <li className="flex flex-col gap-4 items-start">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-black"></span>
              <h1 className="font-inter font-bold text-3xl">How to logout?</h1>
            </div>
            <p>You can log out in many different ways</p>
          </li>
        </ul>
      </main>
    </section>
  );
}

export default DashboardAdmin;
