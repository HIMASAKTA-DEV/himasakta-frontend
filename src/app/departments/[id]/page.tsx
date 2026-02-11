import departments from "@/lib/_dummy_db/_departemen/dummyDepartemenAll.json";
import NoImg from "@/components/commons/NoImg";

interface DepartemenPageProps {
  params: { id: string };
}

export default function DepartemenPage({ params }: DepartemenPageProps) {
  const { id } = params;
  const departemen = departments.find((d) => d.id === parseInt(id));

  if (!departemen) {
    return <p>Departemen tidak ditemukan</p>;
  }

  const bankSoalLink = departemen.urlBankSoal || "#";
  const silabusLink = departemen.urlSilabus || "#";
  const bankRefLink = departemen.urlBankReferensi || "#";

  return (
    <div className="px-4 lg:px-20 py-8 flex flex-col gap-6">
      {/* Gambar departemen */}
      {departemen.image ? (
        <div className="w-full max-w-lg h-[300px] relative">
          <img
            src={departemen.image}
            alt={departemen.name}
            className="object-cover object-center w-full h-full rounded-xl"
          />
        </div>
      ) : (
        <NoImg className="w-full max-w-lg h-[300px] rounded-xl" />
      )}

      <h1 className="text-2xl font-bold">
        {departemen.name || "Tidak ada nama"}
      </h1>
      <p className="mt-2">
        {departemen.description || "Deskripsi belum tersedia."}
      </p>

      <h2 className="mt-6 text-xl font-semibold">Progenda</h2>
      {departemen.progenda && departemen.progenda.length > 0 ? (
        <ul className="list-disc pl-5 mt-2">
          {departemen.progenda.map((prog, idx) => (
            <li key={idx}>
              {prog.title || "Judul belum tersedia"} - {prog.date || "-"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2">Belum ada progenda.</p>
      )}

      <h2 className="mt-6 text-xl font-semibold">Links</h2>
      <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
        <li>
          <a
            href={bankSoalLink}
            target="_blank"
            className="text-blue-500 underline"
          >
            Bank Soal
          </a>
        </li>
        <li>
          <a
            href={silabusLink}
            target="_blank"
            className="text-blue-500 underline"
          >
            Silabus
          </a>
        </li>
        <li>
          <a
            href={bankRefLink}
            target="_blank"
            className="text-blue-500 underline"
          >
            Bank Referensi
          </a>
        </li>
      </ul>
    </div>
  );
}
