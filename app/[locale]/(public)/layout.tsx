import { ApiAlertHandler } from "@/components/ApiAlertHandler";
import ContactFloatingBtn from "@/components/ui-web/ContactFloatingBtn";
import Footer from "@/components/ui-web/Footer";
import Navbar from "@/components/ui-web/Navbar";
import ScrollToTopButton from "@/components/ui-web/ScrollToTopButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <ContactFloatingBtn />
      <ScrollToTopButton />

      <Footer />
    </>
  );
}
