import Footer from "@/layouts/Footer";
import Navbar from "@/layouts/Navbar";
import { LayoutProps } from "@/types/layout";
import MaintenanceNotifier from "@/components/commons/MaintenanceNotifier";

export default function Layout({
  children,
  withFooter,
  withNavbar,
  transparentOnTop,
}: LayoutProps) {
  return (
    <>
      <MaintenanceNotifier />
      {withNavbar && <Navbar transparentOnTop={transparentOnTop} />}
      {children}
      {withFooter && <Footer />}
    </>
  );
}
