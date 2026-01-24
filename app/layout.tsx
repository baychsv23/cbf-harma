// app/layout.tsx
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
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
