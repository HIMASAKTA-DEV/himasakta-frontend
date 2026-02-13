import Footer from "@/layouts/Footer";
import Navbar from "@/layouts/Navbar";
import { LayoutProps } from "@/types/layout";

export default function Layout({
  children,
  withFooter,
  withNavbar,
  transparentOnTop,
}: LayoutProps) {
  return (
    <>
      {withNavbar && <Navbar transparentOnTop={transparentOnTop} />}
      {children}
      {withFooter && <Footer />}
    </>
  );
}
