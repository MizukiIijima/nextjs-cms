import type { Metadata } from "next";
import Header from "@/src/components/Header";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Next.js CMS",
    template: "%s | Next.js CMS",
  },
  description: "Next.js CMSで運営するブログサイトです。",
  applicationName: "Next.js CMS",
  keywords: ["Next.js", "CMS", "ブログ", "記事"],
  openGraph: {
    siteName: "Next.js CMS",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-screen bg-[#f4f6f8]">
        <div className="min-h-screen">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
