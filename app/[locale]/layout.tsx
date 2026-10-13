import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Noto_Sans_Lao } from "next/font/google";
import { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "flag-icons/css/flag-icons.min.css";
import "./globals.css";

import SessionProvider from "@/components/provider/SessionProvider";
import { getMessages } from "next-intl/server";
import { ApiAlertHandler } from "@/components/ApiAlertHandler";

const notoSansLao = Noto_Sans_Lao({
  subsets: ["lao"],
  weight: ["400", "700"],
});

function getFontClass(locale: string) {
  switch (locale) {
    case "lo":
      return notoSansLao.className;
    case "en":
      return notoSansLao.className;
    default:
      return notoSansLao.className;
  }
}

export const metadata: Metadata = {
  title: "CBF",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
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

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body suppressHydrationWarning className={getFontClass(locale)}>
        <NextTopLoader
          color="linear-gradient(to top, #059669, #10b981, #34d399)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 16px rgba(16, 185, 129, 0.9)"
        />
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ApiAlertHandler />
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
