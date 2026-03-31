// app/layout.tsx
import { Metadata } from "next";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";

export const metadata: Metadata = {
  title: "CBF",
  icons: {
    icon: "/images/logo.svg",
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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
