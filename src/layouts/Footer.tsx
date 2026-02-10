import DesktopFooter from "./_footer/DesktopFooter";
import MobileFooter from "./_footer/MobileFooter";

export default function Footer() {
  return (
    <>
      <div className="block lg:hidden">
        <MobileFooter />
      </div>

      <div className="hidden lg:block">
        <DesktopFooter />
      </div>
    </>
  );
}
