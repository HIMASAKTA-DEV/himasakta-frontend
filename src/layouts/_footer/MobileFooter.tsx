import NextImage from "@/components/NextImage";
import Link from "next/link";
import { footerLink } from "./footerLinks";
import { socmedLinks } from "./socmedLinks";

export default function MobileFooter() {
  return (
    <footer className="px-[60px] py-8 bg-black text-white">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-4 mb-6">
        <NextImage
          src="/HimasaktaMainWhite.png"
          width={70}
          height={70}
          alt="Himasakta"
        />
        <h1 className="font-averia text-3xl font-bold">HIMASAKTA</h1>
      </Link>

      {/* Links */}
      <div className="font-libertine text-lg flex flex-col mb-6">
        {footerLink.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="mb-3 hover:text-neutral-50"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Social */}
      <div className="flex gap-4 mb-6">
        {socmedLinks.map(({ name, url, icon: Icon }) => (
          <Link
            key={name}
            href={url}
            target="_blank"
            className="
              p-3 rounded-xl
              bg-neutral-100 text-black
            "
          >
            <Icon className="text-md" />
          </Link>
        ))}
      </div>

      <p className="font-libertine text-md text-white">&copy; 2026</p>
    </footer>
  );
}
