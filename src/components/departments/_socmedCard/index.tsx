import { normalizeLinks } from "@/lib/normalizeUrl";
import { DepartmentType } from "@/types/data/DepartmentType";
import Link from "next/link";
import { socmedLinks } from "./data";

function SocmedCard(dept: DepartmentType) {
  // handle all links
  const allLinks = socmedLinks.flatMap(({ key, baseUrl, Icon }) => {
    const rawVal = dept[key as keyof DepartmentType];
    const links = normalizeLinks(rawVal);

    return links.map((val) => ({
      url: baseUrl ? `${baseUrl}${val}` : val,
      Icon,
      key,
    }));
  });

  // no link means no data
  if (allLinks.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">Tidak ada media sosial</p>
    );
  }

  // render as normally
  return (
    <div className="flex gap-4">
      {allLinks.map(({ url, Icon, key }, idx) => (
        <Link
          key={`${key}-${idx}`}
          href={url}
          target="_blank"
          className="p-3 rounded-2xl bg-primaryPink text-white hover:opacity-70 transition-all duration-300 active:opacity-50"
        >
          <Icon className="text-xl" />
        </Link>
      ))}
    </div>
  );
}

export default SocmedCard;
