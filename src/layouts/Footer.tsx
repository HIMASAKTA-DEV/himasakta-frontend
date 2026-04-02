import DesktopFooter from "./_footer/DesktopFooter";
import MobileFooter from "./_footer/MobileFooter";

export default function Footer() {
  return (
    <>
      <div className="block lg:hidden z-[999]">
        <MobileFooter />
      </div>

      <div className="hidden lg:block z-[999]">
        <DesktopFooter />
      </div>
    </>
  );
}
