import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Noto_Sans_Lao } from "next/font/google";

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

  const messages = await getMessages();

  return (
    <div className={getFontClass(locale)}>
      <SessionProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ApiAlertHandler />
          {children}
        </NextIntlClientProvider>
      </SessionProvider>
    </div>
  );
}
