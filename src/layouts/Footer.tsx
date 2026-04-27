import DesktopFooter from "./_footer/DesktopFooter";
import MobileFooter from "./_footer/MobileFooter";

type FooterLinkType = {
  label: string;
  href: string;
};

export default function Footer({
  footerLinksData,
}: {
  footerLinksData?: FooterLinkType[];
}) {
  return (
    <>
      <div className="block lg:hidden z-[999]">
        <MobileFooter footerLinks={footerLinksData} />
      </div>

      <div className="hidden lg:block z-[999]">
        <DesktopFooter footerLinks={footerLinksData} />
      </div>
    </>
  );
}
