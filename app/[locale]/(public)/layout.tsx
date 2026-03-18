import ContactFloatingBtn from "@/components/UI/ContactFloatingBtn";
import Footer from "@/components/UI/Footer";
import Navbar from "@/components/UI/Navbar";
import ScrollToTopButton from "@/components/UI/ScrollToTopButton";

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
