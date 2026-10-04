import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cafe QR Order - សូមកុម្ម៉ង់អាហារ",
  description: "ប្រព័ន្ធកុម្ម៉ង់អាហារតាម QR Code",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="km" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
