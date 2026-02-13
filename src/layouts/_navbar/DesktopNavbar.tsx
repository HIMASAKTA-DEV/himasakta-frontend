import ButtonLink from "@/components/links/ButtonLink";
import { navigationBtn } from "./navigationBtn";
import clsx from "clsx";

export default function DesktopNavbar({
  isTransparent,
}: {
  isTransparent: boolean;
}) {
  const navBtnStyle = clsx(
    "px-4 py-2 rounded-xl transition-all duration-300",
    "active:scale-95 font-libertine font-medium tracking-wide",
    isTransparent ? "text-white" : "text-black",
    isTransparent
      ? "hover:bg-white/20 hover:scale-105"
      : "hover:bg-neutral-800/5 hover:scale-105",
  );

  return (
    <div className="hidden lg:flex gap-8">
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
