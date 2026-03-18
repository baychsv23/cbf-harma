import Sidebar from "@/components/UI/Sidebar";
import { getAuth } from "@/lib/requirePermission";
import { redirect } from "@/i18n/routing";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuth();

  if (!session) {
    redirect({ href: "/auth/signin", locale: "lo" }); // Fallback locale
  }

  return (
    <>
      <Sidebar />
      <main className="transition-all duration-300 lg:ml-64 ">{children}</main>
    </>
  );
}
