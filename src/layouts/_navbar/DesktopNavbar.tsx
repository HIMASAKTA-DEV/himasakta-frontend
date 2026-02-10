// ketika lebar layar >= 768px
import ButtonLink from "@/components/links/ButtonLink";
import { navigationBtn } from "./navigationBtn";

export default function DesktopNavbar() {
  const navBtnStyle =
    "p-2 transition-all duration-200 " +
    "hover:bg-neutral-100 hover:scale-105 " +
    "active:bg-neutral-200 active:scale-100 " +
    "focus-visible:outline-none focus-visible:ring focus-visible:ring-neutral-400 " +
    "text-black font-libertine ";

  return (
    <div className="hidden lg:flex gap-12">
      {navigationBtn.map((item) => (
        <ButtonLink
          key={item.label}
          href={item.href}
          variant="ghost"
          size="lg"
          className={navBtnStyle}
        >
          {item.label}
        </ButtonLink>
      ))}
    </div>
  );
}
