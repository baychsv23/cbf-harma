import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Noto_Sans, Noto_Sans_Lao, } from "next/font/google";

import SessionProvider from "@/components/provider/SessionProvider";
import { getMessages } from "next-intl/server";
import RouteChangeLoader from "@/components/RouteChangeLoader";
import Sidebar from "@/components/UI/Sidebar";
import { getAuth } from "@/lib/requirePermission";
import ContactFloatingBtn from "@/components/UI/ContactFloatingBtn";
import Footer from "@/components/UI/Footer";
import Navbar from "@/components/UI/Navbar";

const notoSansLao = Noto_Sans_Lao({
  subsets: ["lao"],
  weight: ["400", "700"],
});

// const notoSansThai = Noto_Sans_Thai({
//   subsets: ["thai"],
//   weight: ["400", "700"],
// });
const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "700"] })

function getFontClass(locale: string) {
  switch (locale) {
    case "lo":
      return notoSansLao.className;
    case "en":
      return notoSans.className;
    default:
      return notoSansLao.className;
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const session = await getAuth();
  const messages = await getMessages();

  return (
    <div className={getFontClass(locale)}>
      <SessionProvider session={session}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RouteChangeLoader />
          {!session ?<> 
           <Navbar />
             {children}
          <ContactFloatingBtn />
                    <Footer />
          </> : <>   <Sidebar />
           <main className="transition-all duration-300 lg:ml-64 ">
            {children}
          </main></>}
       
          

        </NextIntlClientProvider>
      </SessionProvider>
    </div>
  );
}
