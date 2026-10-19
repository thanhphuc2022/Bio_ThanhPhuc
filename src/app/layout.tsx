import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phuc Card — Hồ Thanh Phúc",
  description: "Hồ Thanh Phúc · Backend Developer",
  openGraph: {
    title: "Phuc Card — Hồ Thanh Phúc",
    description: "Hồ Thanh Phúc · Backend Developer",
    type: "website",
    locale: "vi_VN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f7f2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
