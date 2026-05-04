// app/layout.tsx
import { Metadata } from "next";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import NextTopLoader from "nextjs-toploader";
export const metadata: Metadata = {
  title: "CBF",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body suppressHydrationWarning>
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
        {children}
      </body>
    </html>
  );
}
