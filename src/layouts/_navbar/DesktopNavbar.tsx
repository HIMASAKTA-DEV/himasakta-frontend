// ketika lebar layar >= 768px
import ButtonLink from "@/components/links/ButtonLink";
import { navigationBtn } from "./navigationBtn";

export default function DesktopNavbar() {
  const navBtnStyle =
    "px-4 py-2 rounded-xl transition-all duration-300 " + // Rounded-xl for a modern look
    "hover:bg-neutral-800/5 hover:scale-105 " + // Subtle dark hover
    "active:scale-95 " +
    "text-black font-libertine font-medium tracking-wide";

  return (
    <div className="hidden lg:flex gap-8">
      {" "}
      {/* Reduced gap for better balance */}
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
