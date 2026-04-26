import ButtonLink from "@/components/links/ButtonLink";
import Lenis from "@studio-freight/lenis/types";
import clsx from "clsx";
import { navigationBtn } from "./navigationBtn";

type LenisWindow = typeof globalThis & {
  lenis?: Lenis;
};
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

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const lenis = (globalThis as LenisWindow).lenis;
    if (!lenis) return;

    const target = e.currentTarget.getAttribute("href");
    if (!target || !target.startsWith("#")) return;

    e.preventDefault();

    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;

    lenis.scrollTo(el, {
      offset: -140, // adjust kalau ada navbar fixed
      duration: 0.5,
    });
  };

  return (
    <div className="hidden lg:flex gap-8">
      {navigationBtn.map((item) => (
        <ButtonLink
          key={item.label}
          href={item.href}
          onClick={handleScroll}
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
